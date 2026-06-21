#!/usr/bin/env python3
"""
PROGRESS.md 생성/동기화 스크립트.

단일 소스: manyfast_status.json (manyfast 프로젝트의 기능별 progress 스냅샷).
  - 기능 진행상태는 manyfast 의 progress 값으로 갱신됩니다.
  - 디자인/구현/테스트 하위 체크박스, 갭/하우스키핑 항목의 수동 체크는
    재생성해도 보존됩니다(라벨 기준 메모리).

스냅샷 갱신 방법:
  manyfast MCP(read_project_meta / read_project)에서 각 기능의 progress 를 읽어
  manyfast_status.json 의 "features" 맵을 갱신한 뒤 이 스크립트를 실행하세요.

사용:
  python3 sync_progress.py            # PROGRESS.md 생성/동기화
"""
import json, re, os, datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
SNAPSHOT = os.path.join(ROOT, "manyfast_status.json")
PROGRESS = os.path.join(ROOT, "PROGRESS.md")

# progress 값 → (체크여부, 표시 태그)
STATUS = {
    "todo":               (False, "🔲 todo"),
    "review-requested":   (False, "👀 리뷰요청"),
    "revision-requested": (False, "✏️ 수정요청"),
    "done":               (True,  "✅ done"),
    "blocked":            (False, "🚫 blocked"),
}

# 기능 메타데이터 (Phase / 이름 / 상위요구사항(중요도) / 스펙수 / 와이어프레임 상태)
PHASES = [
    ("Phase 0 — 데이터 기반 (선행 인프라)",
     "가격 관련 모든 기능의 전제. 이게 없으면 검색·알림·인사이트가 동작하지 않음.", [
        ("F-ZVLVAP", "데이터 소스 연동 및 수집 스케줄", "R-LCDSFI(high)", 3, "🔩 백엔드"),
        ("F-IJLLWS", "가격 정규화 및 중복 제거", "R-LCDSFI(high)", 3, "🔩 백엔드"),
        ("F-MZTGPZ", "검색 조건 기반 최저가 계산", "R-LCDSFI(high)", 3, "🔩 백엔드"),
    ]),
    ("Phase 1 — 검색·구매 MVP (핵심 가치 루프)",
     "검색 → 결과 → 상세 → 구매. 제품의 최소 기능 단위.", [
        ("F-YWDYVJ", "검색 조건 입력 (출발/도착/인원/좌석)", "R-LNPTLE(high)", 3, "✅ 항공권 검색 화면"),
        ("F-AWIACR", "검색 결과 목록/정렬/필터", "R-LNPTLE(high)", 3, "✅ 검색 결과 목록"),
        ("F-DNKHRN", "항공권 상세(요약) 보기", "R-LNPTLE(high)", 3, "✅ 항공권 상세 화면"),
        ("F-BTICYL", "딥링크/외부 브라우저 구매 페이지 이동", "R-TRIBWQ(high)", 3, "✅ 상세 내 \"구매 페이지로 이동\""),
        ("F-YQDSNW", "이동 전 가격/조건 재확인 안내", "R-TRIBWQ(high)", 3, "⚠️ 예약 조건 오버레이로만 부분"),
    ]),
    ("Phase 2 — 계정 및 인증",
     "개인화 알림(Phase 3)의 전제. 인증/온보딩 플로우는 정의됨, 와이어프레임은 보완 필요.", [
        ("F-WURFTH", "회원가입/로그인", "R-KBWBWR(medium)", 3, "✅ 로그인·회원가입·소셜·온보딩·약관·이메일인증·비번재설정·오류"),
        ("F-KYCPVV", "알림 목록 관리(수정/중지/삭제)", "R-KBWBWR(medium)", 2, "✅ 알림 목록 관리"),
    ]),
    ("Phase 3 — 최저가 알림 (핵심 차별점)",
     "알림 설정 → 가격 감지 → 발송 → 이력. 제품의 차별 가치.", [
        ("F-GSRLWB", "알림 조건 생성(구간/날짜/가격)", "R-ESMJRA(high)", 3, "✅ 알림 조건 설정"),
        ("F-PPIJYM", "알림 조건 검증 및 저장", "R-ESMJRA(high)", 3, "✅ 조건 설정/수정 (검증 백엔드)"),
        ("F-INGLFW", "가격 변동 감지 및 알림 트리거", "R-ESMJRA(high)", 3, "🔩 백엔드"),
        ("F-VKCJMU", "푸시 알림 수신/권한 안내", "R-LAAZGC(high)", 2, "✅ 푸시 알림 권한 안내"),
        ("F-YNWTZY", "알림 이력 리스트/상세", "R-LAAZGC(high)", 3, "✅ 알림 이력 / 이력 상세"),
        ("F-VJFFIO", "알림 이력에서 재진입(상세/구매)", "R-LAAZGC(high)", 2, "⚠️ 재진입 버튼 미확인"),
    ]),
    ("Phase 4 — 가격 인사이트 (부가 가치)",
     "캘린더·트렌드·유연한 날짜 추천. 리텐션 강화용 부가 기능.", [
        ("F-UMNAJM", "가격 캘린더(날짜별 최저가)", "R-HJPMMB(medium)", 3, "✅ 가격 캘린더"),
        ("F-BYHSQJ", "가격 트렌드 그래프(기간 추이)", "R-HJPMMB(medium)", 3, "✅ 가격 트렌드 그래프"),
        ("F-ABUMIB", "캘린더/그래프에서 알림 만들기", "R-HJPMMB(medium)", 2, "⚠️ CTA 미확인"),
        ("F-KIOYKC", "유연한 날짜 추천 생성(가장 저렴한 구간)", "R-TITZOR(medium)", 3, "✅ 유연한 날짜 추천"),
        ("F-JAYALH", "추천 결과 캘린더 시각화", "R-TITZOR(medium)", 3, "✅ 가격 캘린더 내 시각화"),
    ]),
]

SUBTASKS = ["디자인", "구현", "테스트"]

# 정적 체크리스트(수동 추적) — 라벨 기준으로 상태 보존
GAP_ITEMS = [
    "온보딩 화면 (스플래시 + 소개 캐러셀)",
    "약관 동의 / 약관 상세 / 개인정보처리방침 상세",
    "이메일 인증 안내·재발송",
    "비밀번호 재설정 → 새 비밀번호 입력",
    "인증 오류/예외 5종 (입력오류·중복가입·로그인실패·네트워크·소셜취소)",
    "`F-VJFFIO` 이력→상세/구매 재진입 버튼",
    "`F-ABUMIB` 캘린더/그래프 내 \"알림 만들기\" CTA",
]
HOUSEKEEPING = [
    "인증/온보딩 유저플로우 ↔ `F-WURFTH` 연결 (manyfast 에디터에서)",
    "manyfast 프로젝트 meta 통계 갱신(`regenerate_meta`)",
]


def load_prior_checks(path):
    """기존 PROGRESS.md 에서 체크박스 라벨→상태를 읽어 보존용 메모리 생성."""
    mem = {}
    if not os.path.exists(path):
        return mem
    for line in open(path, encoding="utf-8"):
        m = re.match(r"\s*- \[([ xX])\]\s+(.*?)\s*$", line)
        if m:
            mem[m.group(2)] = (m.group(1).lower() == "x")
    return mem


def cb(checked):
    return "[x]" if checked else "[ ]"


def build(snapshot, mem):
    feats = snapshot.get("features", {})
    L = []
    L.append("# 항공권 최저가 알림 앱 — 개발 진행 현황")
    L.append("")
    total_feats = sum(len(fm) for _, _, fm in PHASES)
    L.append(f"> manyfast 프로젝트 `{snapshot.get('projectId','')[:8]}` 기준 · "
             f"8개 요구사항 / {total_feats}개 기능 / 59개 스펙.")
    L.append("> 진행상태는 `manyfast_status.json` 에서 동기화됩니다. "
             "디자인/구현/테스트·갭 항목은 수동 체크(재생성 시 보존).")
    L.append(">")
    L.append("> **갱신:** manyfast 스냅샷 반영 후 `python3 sync_progress.py` 실행.")
    L.append("")
    L.append("**와이어프레임** ✅완료 ⚠️부분 ❌없음 🔩백엔드 · "
             "**진행** 🔲todo 👀리뷰요청 ✏️수정요청 ✅done 🚫blocked")
    L.append("")

    phase_counts = []
    sub_counts = {s: 0 for s in SUBTASKS}
    for title, desc, feats_meta in PHASES:
        done_n = 0
        L.append(f"## {title}")
        L.append("")
        L.append(f"> {desc}")
        L.append("")
        for fid, name, req, specs, wf in feats_meta:
            prog = feats.get(fid, "todo")
            checked, tag = STATUS.get(prog, (False, prog))
            if checked:
                done_n += 1
            L.append(f"- {cb(checked)} **{fid}** {name} — `{req}` · 스펙 {specs} · {wf} · {tag}")
            for st in SUBTASKS:
                label = f"{st} ↳ {fid}"
                on = mem.get(label, False)
                if on:
                    sub_counts[st] += 1
                L.append(f"  - {cb(on)} {label}")
        L.append("")
        phase_counts.append((title.split(" (")[0], done_n, len(feats_meta)))

    # 디자인 보완 필요
    L.append("## 디자인 보완 필요 (와이어프레임 갭)")
    L.append("")
    for item in GAP_ITEMS:
        L.append(f"- {cb(mem.get(item, False))} {item}")
    L.append("")

    # 하우스키핑
    L.append("## 정리/하우스키핑")
    L.append("")
    for item in HOUSEKEEPING:
        L.append(f"- {cb(mem.get(item, False))} {item}")
    L.append("")

    # 요약
    total_done = sum(d for _, d, _ in phase_counts)
    total_all = sum(t for _, _, t in phase_counts)
    L.append("## 진행 요약")
    L.append("")
    L.append("| Phase | 완료 / 전체 |")
    L.append("|---|---|")
    for name, d, t in phase_counts:
        L.append(f"| {name} | {d} / {t} |")
    L.append(f"| **합계** | **{total_done} / {total_all}** |")
    L.append("")
    L.append("### 단계별 진척 (기능 단위)")
    L.append("")
    L.append("| 단계 | 완료 / 전체 |")
    L.append("|---|---|")
    for st in SUBTASKS:
        L.append(f"| {st} | {sub_counts[st]} / {total_all} |")
    L.append("")
    today = datetime.date.today().isoformat()
    L.append(f"_최종 동기화: {today} (manyfast 스냅샷 {snapshot.get('updatedAt','?')})_")
    L.append("")
    return "\n".join(L)


def main():
    snapshot = json.load(open(SNAPSHOT, encoding="utf-8"))
    mem = load_prior_checks(PROGRESS)
    out = build(snapshot, mem)
    open(PROGRESS, "w", encoding="utf-8").write(out)
    feats = snapshot.get("features", {})
    done = sum(1 for v in feats.values() if v == "done")
    print(f"PROGRESS.md 갱신 완료 — 기능 {done}/{len(feats)} done "
          f"(수동 체크 {sum(mem.values())}건 보존)")


if __name__ == "__main__":
    main()
