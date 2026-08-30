# 채용 파이프라인 보드

프론트엔드 채용 사전과제

**제출자: 김응길**

---

## 실행 방법

```bash
pnpm install
pnpm dev     # http://localhost:5173
```

```bash
pnpm test    # Vitest
pnpm build   # tsc -b && vite build
pnpm lint    # eslint
```

---

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| 빌드 | Vite 8 |
| 프레임워크 | React 19 |
| 언어 | TypeScript 6 (strict) |
| 스타일 | Tailwind v4 (`@theme` 토큰, 설정 파일 없음) |
| 서버 상태 | TanStack Query 5 |
| mock | MSW 2 (브라우저와 테스트가 handler 공유) |
| 테스트 | Vitest, Testing Library |
| 가상 스크롤 | TanStack Virtual |

---

## 구현 기능

| 구분 | 기능 |
| --- | --- |
| 보드 | 5단계 컬럼(서류검토, 면접, 처우협의, 최종합격, 불합격), 단계별 건수 |
| 카드 | 이름, 직무, 지원일, 현재 단계 배지 |
| 단계 이동 | 액션 버튼 방식. mock API 저장으로 새로고침 후에도 유지 |
| 낙관적 업데이트 | UI 선반영, 실패 시 복구, 성공과 실패 모두 안내 |
| 검색 / 필터 | 이름 검색 + 직무 필터. 1,000건에서 입력이 막히지 않음 |
| 상세 보기 | 카드 클릭 시 사이드 패널. 지원 정보와 진행 이력 |
| 상태 처리 | 로딩 스켈레톤, 에러 + 재시도, 빈 상태(컬럼 0건과 검색 0건 구분) |
| 접근성 | 키보드만으로 단계 이동과 상세 열람. 포커스 트랩, live region |

---

## mock API

실제 백엔드가 없습니다. MSW handler 가 지연 200~800ms 와 실패 15% 를 시뮬레이션하고,
데이터는 localStorage 에 저장되어 새로고침 후에도 유지됩니다. 시드는 1,000건입니다.

### 동작 확인용 URL 스위치

실패는 확률로 일어나기 때문에 그대로 두면 재현이 어렵습니다. 쿼리 파라미터로 조정합니다.

| 파라미터 | 용도 | 예시 |
| --- | --- | --- |
| `delay` | 지연을 고정값으로 | `?delay=0` |
| `fetchFailRate` | 조회 실패율 | `?fetchFailRate=1` 이면 에러 화면 |
| `moveFailRate` | 이동 실패율 | `?moveFailRate=1` 이면 롤백 확인 |

```
http://localhost:5173/?moveFailRate=1      단계 이동이 항상 실패, 롤백 동작 확인
http://localhost:5173/?fetchFailRate=1     조회가 항상 실패, 에러 화면과 재시도 확인
http://localhost:5173/?delay=0             지연 없이 빠르게 조작
```

읽기와 쓰기 실패율을 분리한 이유는 조회는 정상인데 이동만 실패하는 상황을 만들어야
낙관적 업데이트의 롤백을 볼 수 있기 때문입니다.

---

## 디렉토리 구조

```
src/
├── components/          화면 컴포넌트
│   └── <Name>/
│       ├── index.tsx        마크업
│       ├── use<Name>.ts     상태와 쿼리 조합
│       └── components/      그 컴포넌트 전용 하위 파트
├── queries/             TanStack Query (queries.ts / mutations.ts)
├── services/            API 서비스, axios 인스턴스, 인터셉터
├── mocks/               MSW handler, 시드, 저장소, 설정
├── hooks/               공용 훅 (포커스 트랩, 외부 클릭)
├── constants/           단계 정의, 쿼리 키, 페이지 크기
├── lib/                 포맷 유틸
└── types/               도메인 타입

.claude/                 작업 하네스 (에이전트, 스킬, 계획서)
```

컴포넌트는 마크업과 로직을 파일로 나눕니다. 형제 컴포넌트는 `components/` 최상위에 두고,
특정 컴포넌트에서만 쓰는 하위 파트만 그 아래 `components/` 로 넣습니다.

---

## 아키텍처

```
App
 |
 v
Board / DetailPanel        마크업
 |
 v
useBoard / useDetailPanel  로컬 상태 + 쿼리 조합
 |
 v
queries/candidate          캐시 정책 (queryKey, staleTime)
 |
 v
services/api/candidate     요청 변환, 응답 정규화
 |
 v
services/instance          axios + 에러 인터셉터
 |
 v
mocks/handlers             MSW. 지연과 실패 시뮬레이션
 |
 v
mocks/db                   localStorage
```

---

## 설계 포인트

### 1. 롤백 코드를 없앤 낙관적 업데이트

TanStack Query 공식 예제의 "목록 전체 스냅샷 후 실패 시 통째 복원" 을 그대로 쓰면
**A 가 실패할 때 그 사이 성공한 B 까지 되돌아갑니다.**

서버 사실과 낙관적 의도를 분리했습니다.

```
서버 사실     candidate.stage      Query 캐시. 직접 손대지 않음
낙관적 의도   pendingStage[id]     별도 오버레이
화면          pendingStage[id] ?? candidate.stage
```

성공하면 오버레이를 지웁니다. 캐시에 이미 서버 확정값이 들어와 있습니다.
실패해도 오버레이를 지웁니다. 원본이 그대로라 화면이 저절로 복구됩니다.

**롤백 코드 자체가 없으므로 "어느 경로에서 롤백을 빠뜨렸다" 는 버그가 구조적으로 생기지 않습니다.**
백그라운드 refetch 가 돌아도 진행 중인 이동은 오버레이가 이기므로 화면이 튀지 않습니다.

### 2. 브라우저와 테스트가 같은 mock 계약을 공유

Next.js Route Handler 로 mock 을 만들면 테스트용 mock 을 한 벌 더 만들게 됩니다.
두 벌이 어긋나는 순간 테스트가 통과해도 화면은 깨집니다.

MSW 는 `src/mocks/handlers.ts` 하나를 브라우저(`browser.ts`)와 Vitest(`server.ts`) 가
함께 씁니다. 테스트에서 특정 실패가 필요하면 `server.use()` 로 그 테스트에서만 덮어씁니다.
기본값은 건드리지 않습니다.

### 3. 입력이 막히지 않는 검색

1,000건에서 매 입력마다 필터를 다시 계산하면 타이핑이 끊깁니다. 두 가지를 같이 씁니다.

```ts
const deferredQuery = useDeferredValue(useDebouncedValue(query, DEBOUNCE_MS))
```

디바운스는 무거운 렌더 **횟수** 를 줄이고, `useDeferredValue` 는 그 한 번의 렌더가
**다음 입력을 막지 않게** 합니다. 역할이 달라 둘 다 필요합니다.

### 4. 키보드만으로 조작

컬럼 하나에 카드가 수백 개고 카드마다 버튼이 2~3개면 탭스톱이 수천 개가 됩니다.
Tab 만으로는 아래쪽 카드에 도달할 수 없습니다.

컬럼당 탭스톱을 1개로 두고 방향키로 이동하는 roving tabindex 를 썼습니다.

| 키 | 동작 |
| --- | --- |
| `Tab` | 컬럼 간 이동 |
| `↑` `↓` | 같은 컬럼 안에서 카드 이동 |
| `←` `→` | 선택한 카드를 이전 / 다음 단계로 |
| `Enter` | 상세 패널 열기 |
| `Esc` | 패널 닫기. **열기 전 카드로 포커스 복귀** |

상세 패널은 포커스 트랩을 직접 구현했습니다. AI 초안은 Esc 는 처리했지만 닫을 때
원래 카드로 포커스를 되돌리지 않았고, 키보드로 직접 재현해 잡았습니다.

이동 결과는 성공과 실패를 **둘 다** live region 으로 알립니다. 성공 시 카드가 다른 컬럼으로
사라지기 때문에, 알리지 않으면 스크린리더 사용자는 무슨 일이 일어났는지 알 수 없습니다.

### 5. 상태 처리와 에러 계층

로딩은 스켈레톤, 에러는 재시도 버튼, 빈 상태는 두 경우를 구분합니다.
컬럼에 카드가 없는 것과 검색 결과가 없는 것은 사용자가 할 행동이 다릅니다.

에러는 계층별로 나눠 처리합니다. 렌더 오류는 `ErrorBoundary`, HTTP 오류는 axios
인터셉터, 조회 실패는 각 화면의 에러 상태입니다.

### 6. 색만으로 알리지 않기

단계 배지와 카드 상태(이동 중, 되돌림)는 색과 함께 **텍스트 배지** 를 붙였습니다.
색각 이상 사용자와 스크린리더 사용자가 같은 정보를 얻어야 합니다.

`prefers-reduced-motion` 을 존중해 애니메이션을 끕니다.

---

## AI 협업 방식

한 번의 대화로 만들지 않고, `.claude/` 에 이 과제 전용 에이전트 6개와 스킬 6개를 먼저
구성한 뒤 작업했습니다. 기능 하나마다 같은 순서를 돌았습니다.

```
구현
 ↓
/review          code-reviewer + a11y-checker 가 지적. 둘 다 읽기 전용
 ↓
직접 재현하고 수정   <- 이 단계가 PROMPTS.md 리뷰란의 재료
 ↓
/prompt-log      초안을 만들고 판단 항목만 인터뷰
 ↓
git add -A
 ↓
/commit-msg      lint, test 통과 후 메시지 작성과 검증
 ↓
git commit
```

핵심은 **검증자에게 수정 권한을 주지 않은 것** 입니다. 에이전트가 바로 고치면 사람이
재현하는 단계를 건너뛰게 되고, 그러면 `PROMPTS.md` 의 "어떻게 알아챘나" 에 쓸 사실이
남지 않습니다. 같은 이유로 리뷰는 커밋 게이트에 넣지 않았습니다. 지적을 재현할 시간이
필요하기 때문입니다.

이 구성으로 커밋과 `PROMPTS.md` 섹션이 1:1로 대응합니다.

---

## 문서

| 파일 | 내용 |
| --- | --- |
| `PROMPTS.md` | 기능별 프롬프트와 리뷰 기록 |
| `DECISIONS.md` | 설계 결정, 기각한 선택지, 세운 가정 |
| `.claude/docs/mockup.html` | UI 목업. 상태별 카드와 키보드 조작표 |
