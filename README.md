# 최저가 항공권 알림 (whypaymore)

React Native (Expo SDK 54) + TypeScript 기반 항공권 최저가 알림 앱.
`whypaymore.fig` 와이어프레임을 구현하고, 핵심 흐름은 **앱 내 상태/데이터 로직까지 동작**합니다(목 데이터).

## 실행

```bash
npm install
npm start          # Expo Dev Server (i: iOS, a: Android)
npm run typecheck  # tsc --noEmit
npm test           # Jest (jest-expo)
```

### 실시간 항공권 (MyRealTrip MCP) — 키 불필요

`EXPO_PUBLIC_USE_MYREALTRIP=true` 이면 검색이 **MyRealTrip 실시간 항공권**(국내/국제)을 사용합니다. API 키·가입이 필요 없습니다.

```bash
cp .env.example .env   # EXPO_PUBLIC_USE_MYREALTRIP=true (기본값)
npm start
```

- MyRealTrip MCP 서버(`mcp-servers.myrealtrip.com`)를 JSON-RPC(stateless HTTP)로 직접 호출
- 출/도착지 공항코드로 국내(`searchDomesticFlights`)/국제(`searchInternationalFlights`) 자동 분기
- 실제 한국 항공사(대한항공·제주항공·이스타·티웨이 등) 가격 + **실제 예약 링크** 제공 → 상세의 "구매 페이지로 이동"이 실제 예약 페이지를 엽니다
- 플래그가 없으면(테스트/CI 포함) 목 데이터로 폴백 → 결정적 테스트 보장
- 참고: 검색 날짜는 미래여야 합니다(검색 폼 기본값은 오늘+14일). 항공사/LCC 필터의 사전 정의 목록은 실데이터에선 매칭이 제한적

## 구조

```
App.tsx                 진입점 (Auth · Alerts · Navigation · SafeArea)
src/
  theme/                디자인 토큰 (색/타이포/스페이싱) — 와이어프레임 추출
  components/           Text · Button · Input · layout · Async(Loading/Error/Boundary)
  navigation/           RootNavigator(인증/앱 그룹 분기) · TabNavigator(5 tabs) · types
  services/api.ts       목 API 서비스 계층 (지연·실패 시뮬, 검색 필터/정렬)
  hooks/useAsync.ts     loading/error/data + reload 훅
  auth/AuthContext       로그인 상태 + 세션 영구 저장(AsyncStorage)
  alerts/AlertsContext   알림 CRUD 스토어 + 영구 저장
  data/mock.ts          와이어프레임 추출 목 데이터
  screens/              30개 화면
  *.test.ts(x)          Jest 테스트
```

## 화면 (탭 5 + 스택 25)

- **탭**: 홈 · 탐색(가격) · 알림 · 이력 · 마이
- **검색·구매**: 항공권 검색 → 검색 결과 → 항공권 상세 → 예약 조건(모달)
- **알림**: 알림 목록 · 조건 설정/수정 · 일시중지/삭제(모달)
- **가격 인사이트**: 가격 캘린더 · 트렌드 그래프 · 유연한 날짜 추천
- **이력**: 알림 이력 · 이력 상세 · 푸시 권한(모달)
- **계정/설정**: 계정 정보 · 알림 목록 관리 · 앱 설정
- **온보딩/인증**: 스플래시 · 온보딩 · 약관 동의/상세 · 로그인 · 회원가입 · 소셜 · 이메일 인증 · 비밀번호 재설정/변경 · 인증 오류(5종)

## 동작하는 기능 (UI + 상태/데이터 로직)

- **검색 흐름**: 검색 폼 조건 → 결과(헤더에 실제 노선/날짜/승객 반영) → 선택 편 상세(`flightId` 조회). **키 설정 시 실제 Amadeus API 검색**, 미설정 시 목 데이터
- **검색 필터/정렬**: 직항·오전출발·LCC·항공사(다중) 필터가 실제로 목록을 거르고, 가격/소요/출발 정렬
- **알림 CRUD**: 생성·수정·일시중지/재개·삭제가 전역 스토어에서 동작, 홈/상세와 연동
- **로그인 상태 유지**: 로그인/소셜/이메일 인증 완료 시 자동 진입, 로그아웃 시 인증 화면 복귀, **앱 재시작 후 세션 유지**(AsyncStorage)
- **비동기 UX**: 로딩/에러/빈 상태 + 재시도 (앱 설정 › 개발자에서 오류 시뮬레이션 토글)

## 테스트

```bash
npm test
```

`jest-expo` 프리셋. 현재 15개 통과 — API 필터/정렬/에러, 알림 스토어 CRUD, Button 컴포넌트.

## 다음 단계

기능 진행 현황은 [PROGRESS.md](PROGRESS.md) 참고.
남은 작업: Phase 0 데이터 수집·정규화(`F-ZVLVAP/IJLLWS/MZTGPZ`)와 Phase 3 알림 트리거(`F-INGLFW`) 등 **실제 백엔드 연동**, 화면 흐름 통합 테스트 확대.
