# 항공권 최저가 알림 앱 — 개발 진행 현황

> manyfast 프로젝트 `aaaf45b0` 기준 · 8개 요구사항 / 21개 기능 / 59개 스펙.
> 진행상태는 `manyfast_status.json` 에서 동기화됩니다. 디자인/구현/테스트·갭 항목은 수동 체크(재생성 시 보존).
>
> **갱신:** manyfast 스냅샷 반영 후 `python3 sync_progress.py` 실행.

**와이어프레임** ✅완료 ⚠️부분 ❌없음 🔩백엔드 · **진행** 🔲todo 👀리뷰요청 ✏️수정요청 ✅done 🚫blocked

## Phase 0 — 데이터 기반 (선행 인프라)

> 가격 관련 모든 기능의 전제. 이게 없으면 검색·알림·인사이트가 동작하지 않음.

- [ ] **F-ZVLVAP** 데이터 소스 연동 및 수집 스케줄 — `R-LCDSFI(high)` · 스펙 3 · 🔩 백엔드 · 🔲 todo
  - [ ] 디자인 ↳ F-ZVLVAP
  - [ ] 구현 ↳ F-ZVLVAP
  - [ ] 테스트 ↳ F-ZVLVAP
- [ ] **F-IJLLWS** 가격 정규화 및 중복 제거 — `R-LCDSFI(high)` · 스펙 3 · 🔩 백엔드 · 🔲 todo
  - [ ] 디자인 ↳ F-IJLLWS
  - [ ] 구현 ↳ F-IJLLWS
  - [ ] 테스트 ↳ F-IJLLWS
- [ ] **F-MZTGPZ** 검색 조건 기반 최저가 계산 — `R-LCDSFI(high)` · 스펙 3 · 🔩 백엔드 · 🔲 todo
  - [ ] 디자인 ↳ F-MZTGPZ
  - [ ] 구현 ↳ F-MZTGPZ
  - [ ] 테스트 ↳ F-MZTGPZ

## Phase 1 — 검색·구매 MVP (핵심 가치 루프)

> 검색 → 결과 → 상세 → 구매. 제품의 최소 기능 단위.

- [ ] **F-YWDYVJ** 검색 조건 입력 (출발/도착/인원/좌석) — `R-LNPTLE(high)` · 스펙 3 · ✅ 항공권 검색 화면 · 👀 리뷰요청
  - [x] 디자인 ↳ F-YWDYVJ
  - [x] 구현 ↳ F-YWDYVJ
  - [ ] 테스트 ↳ F-YWDYVJ
- [ ] **F-AWIACR** 검색 결과 목록/정렬/필터 — `R-LNPTLE(high)` · 스펙 3 · ✅ 검색 결과 목록 · 👀 리뷰요청
  - [x] 디자인 ↳ F-AWIACR
  - [x] 구현 ↳ F-AWIACR
  - [x] 테스트 ↳ F-AWIACR
- [ ] **F-DNKHRN** 항공권 상세(요약) 보기 — `R-LNPTLE(high)` · 스펙 3 · ✅ 항공권 상세 화면 · 👀 리뷰요청
  - [x] 디자인 ↳ F-DNKHRN
  - [x] 구현 ↳ F-DNKHRN
  - [ ] 테스트 ↳ F-DNKHRN
- [ ] **F-BTICYL** 딥링크/외부 브라우저 구매 페이지 이동 — `R-TRIBWQ(high)` · 스펙 3 · ✅ 상세 내 "구매 페이지로 이동" · 🔲 todo
  - [x] 디자인 ↳ F-BTICYL
  - [ ] 구현 ↳ F-BTICYL
  - [ ] 테스트 ↳ F-BTICYL
- [ ] **F-YQDSNW** 이동 전 가격/조건 재확인 안내 — `R-TRIBWQ(high)` · 스펙 3 · ⚠️ 예약 조건 오버레이로만 부분 · 🔲 todo
  - [x] 디자인 ↳ F-YQDSNW
  - [ ] 구현 ↳ F-YQDSNW
  - [ ] 테스트 ↳ F-YQDSNW

## Phase 2 — 계정 및 인증

> 개인화 알림(Phase 3)의 전제. 인증/온보딩 플로우는 정의됨, 와이어프레임은 보완 필요.

- [ ] **F-WURFTH** 회원가입/로그인 — `R-KBWBWR(medium)` · 스펙 3 · ✅ 로그인·회원가입·소셜·온보딩·약관·이메일인증·비번재설정·오류 · 👀 리뷰요청
  - [x] 디자인 ↳ F-WURFTH
  - [x] 구현 ↳ F-WURFTH
  - [x] 테스트 ↳ F-WURFTH
- [ ] **F-KYCPVV** 알림 목록 관리(수정/중지/삭제) — `R-KBWBWR(medium)` · 스펙 2 · ✅ 알림 목록 관리 · 👀 리뷰요청
  - [x] 디자인 ↳ F-KYCPVV
  - [x] 구현 ↳ F-KYCPVV
  - [x] 테스트 ↳ F-KYCPVV

## Phase 3 — 최저가 알림 (핵심 차별점)

> 알림 설정 → 가격 감지 → 발송 → 이력. 제품의 차별 가치.

- [ ] **F-GSRLWB** 알림 조건 생성(구간/날짜/가격) — `R-ESMJRA(high)` · 스펙 3 · ✅ 알림 조건 설정 · 👀 리뷰요청
  - [x] 디자인 ↳ F-GSRLWB
  - [x] 구현 ↳ F-GSRLWB
  - [x] 테스트 ↳ F-GSRLWB
- [ ] **F-PPIJYM** 알림 조건 검증 및 저장 — `R-ESMJRA(high)` · 스펙 3 · ✅ 조건 설정/수정 (검증 백엔드) · 👀 리뷰요청
  - [x] 디자인 ↳ F-PPIJYM
  - [x] 구현 ↳ F-PPIJYM
  - [ ] 테스트 ↳ F-PPIJYM
- [ ] **F-INGLFW** 가격 변동 감지 및 알림 트리거 — `R-ESMJRA(high)` · 스펙 3 · 🔩 백엔드 · 🔲 todo
  - [ ] 디자인 ↳ F-INGLFW
  - [ ] 구현 ↳ F-INGLFW
  - [ ] 테스트 ↳ F-INGLFW
- [ ] **F-VKCJMU** 푸시 알림 수신/권한 안내 — `R-LAAZGC(high)` · 스펙 2 · ✅ 푸시 알림 권한 안내 · 🔲 todo
  - [x] 디자인 ↳ F-VKCJMU
  - [ ] 구현 ↳ F-VKCJMU
  - [ ] 테스트 ↳ F-VKCJMU
- [ ] **F-YNWTZY** 알림 이력 리스트/상세 — `R-LAAZGC(high)` · 스펙 3 · ✅ 알림 이력 / 이력 상세 · 👀 리뷰요청
  - [x] 디자인 ↳ F-YNWTZY
  - [x] 구현 ↳ F-YNWTZY
  - [ ] 테스트 ↳ F-YNWTZY
- [ ] **F-VJFFIO** 알림 이력에서 재진입(상세/구매) — `R-LAAZGC(high)` · 스펙 2 · ⚠️ 재진입 버튼 미확인 · 👀 리뷰요청
  - [x] 디자인 ↳ F-VJFFIO
  - [x] 구현 ↳ F-VJFFIO
  - [ ] 테스트 ↳ F-VJFFIO

## Phase 4 — 가격 인사이트 (부가 가치)

> 캘린더·트렌드·유연한 날짜 추천. 리텐션 강화용 부가 기능.

- [ ] **F-UMNAJM** 가격 캘린더(날짜별 최저가) — `R-HJPMMB(medium)` · 스펙 3 · ✅ 가격 캘린더 · 🔲 todo
  - [x] 디자인 ↳ F-UMNAJM
  - [ ] 구현 ↳ F-UMNAJM
  - [ ] 테스트 ↳ F-UMNAJM
- [ ] **F-BYHSQJ** 가격 트렌드 그래프(기간 추이) — `R-HJPMMB(medium)` · 스펙 3 · ✅ 가격 트렌드 그래프 · 🔲 todo
  - [x] 디자인 ↳ F-BYHSQJ
  - [ ] 구현 ↳ F-BYHSQJ
  - [ ] 테스트 ↳ F-BYHSQJ
- [ ] **F-ABUMIB** 캘린더/그래프에서 알림 만들기 — `R-HJPMMB(medium)` · 스펙 2 · ⚠️ CTA 미확인 · 👀 리뷰요청
  - [x] 디자인 ↳ F-ABUMIB
  - [x] 구현 ↳ F-ABUMIB
  - [ ] 테스트 ↳ F-ABUMIB
- [ ] **F-KIOYKC** 유연한 날짜 추천 생성(가장 저렴한 구간) — `R-TITZOR(medium)` · 스펙 3 · ✅ 유연한 날짜 추천 · 🔲 todo
  - [x] 디자인 ↳ F-KIOYKC
  - [ ] 구현 ↳ F-KIOYKC
  - [ ] 테스트 ↳ F-KIOYKC
- [ ] **F-JAYALH** 추천 결과 캘린더 시각화 — `R-TITZOR(medium)` · 스펙 3 · ✅ 가격 캘린더 내 시각화 · 🔲 todo
  - [x] 디자인 ↳ F-JAYALH
  - [ ] 구현 ↳ F-JAYALH
  - [ ] 테스트 ↳ F-JAYALH

## 디자인 보완 필요 (와이어프레임 갭)

- [x] 온보딩 화면 (스플래시 + 소개 캐러셀)
- [x] 약관 동의 / 약관 상세 / 개인정보처리방침 상세
- [x] 이메일 인증 안내·재발송
- [x] 비밀번호 재설정 → 새 비밀번호 입력
- [x] 인증 오류/예외 5종 (입력오류·중복가입·로그인실패·네트워크·소셜취소)
- [x] `F-VJFFIO` 이력→상세/구매 재진입 버튼
- [x] `F-ABUMIB` 캘린더/그래프 내 "알림 만들기" CTA

## 정리/하우스키핑

- [ ] 인증/온보딩 유저플로우 ↔ `F-WURFTH` 연결 (manyfast 에디터에서)
- [ ] manyfast 프로젝트 meta 통계 갱신(`regenerate_meta`)

## 진행 요약

| Phase | 완료 / 전체 |
|---|---|
| Phase 0 — 데이터 기반 | 0 / 3 |
| Phase 1 — 검색·구매 MVP | 0 / 5 |
| Phase 2 — 계정 및 인증 | 0 / 2 |
| Phase 3 — 최저가 알림 | 0 / 6 |
| Phase 4 — 가격 인사이트 | 0 / 5 |
| **합계** | **0 / 21** |

### 단계별 진척 (기능 단위)

| 단계 | 완료 / 전체 |
|---|---|
| 디자인 | 17 / 21 |
| 구현 | 10 / 21 |
| 테스트 | 4 / 21 |

_최종 동기화: 2026-06-21 (manyfast 스냅샷 2026-06-21T05:45:00Z)_
