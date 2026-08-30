# PROMPTS

## 의존성 설치와 개발 환경 설정

- `63a6e1f`

### 프롬프트 1

```
tailwindcss v4, react-query, msw, vitest, react-virtual 등 필요한 의존성 패키지 항목에 맞게 설치해
```

### AI 출력 요지

의존성 설치와 Vite·Vitest·Tailwind·ESLint 연결. 판단 두 가지가 들어갔다.

- `test` 스크립트를 `vitest run`으로 고정하고 워치는 `test:watch`로 분리했다.
워치 모드면 커밋 게이트가 응답을 기다리며 멈춘다.
- 단계별 색과 `:focus-visible` 링을 `@theme` 한 곳에 정의했다. 링을 유틸리티로 흩으면
키보드 커밋에서 빠뜨리는 곳이 생긴다.

### 리뷰 / 검증

- 무엇이 문제였나
  - pnpm 11이 MSW 빌드 스크립트를 차단해 `lint`·`test`·`build`가 전부 실행조차 되지 않았다
  - `@vitest/coverage-v8`을 근거 없이 설치해 두고 커버리지 설정도 스크립트도 만들지 않았다
- 어떻게 알아챘나
  - `pnpm lint`를 돌렸더니 린트 결과가 아니라 `ERR_PNPM_IGNORED_BUILDS`가 나왔다
  - `package.json`의 `pnpm.onlyBuiltDependencies`를 넣었더니 "no longer read by pnpm" 경고만 떴고,
  pnpm이 다시 쓴 `pnpm-workspace.yaml`에서 `allowBuilds` 키를 찾았다
  - 미사용 의존성은 code-reviewer가 잡았다
- 채택 / 수정 / 기각
  - 수정. `pnpm-workspace.yaml`의 `allowBuilds`로 풀었다
  - 채택. `@vitest/coverage-v8`을 제거했다. 
- 어떻게 고쳤나
  - 설치 명령이 아니라 워크스페이스 설정이 문제였다. 버전이 바뀌며 설정 위치가 옮겨간 경우라
  같은 키를 다른 파일에서 찾는 것으로 해결했다

---

## [mock-api] 지연·실패를 시뮬레이션하는 mock API

- `d4a2b95`

### 프롬프트 1

```
정책서 보고 mock-api 구현 진행하자
```

### AI 출력 요지

MSW 핸들러 3개와 localStorage 저장소. 설계 판단 세 가지가 들어갔다.

- 조회 실패율과 이동 실패율을 분리했다. 값이 하나면 목록이 안 떠서 이동 실패 롤백을 시연할 수 없다.
- 실패 주사위를 검증 통과 후 저장 직전에 굴렸다. 순서가 반대면 "실패했는데 데이터는 바뀐" 상태가 생긴다.
- `browser.ts`와 `server.ts`가 같은 `handlers`를 쓴다. mock을 두 벌 만들면 한쪽만 고쳤을 때 테스트가 통과해 버린다.

### 리뷰 / 검증

- 무엇이 문제였나
  - `test/setup.ts`가 매 테스트 후 실패율을 15%로 되살려, 이후 모든 테스트가 15% 확률로 깨질 상황이었다
  - 테스트가 0개인데 `--passWithNoTests`라 커밋 게이트에 초록불이 떴다
- 어떻게 알아챘나
  - 15% 실패는 화면으로 재현이 안 된다고 판단했다. 눈으로는 "가끔 이상한데" 수준이라
  code-reviewer에 재현 조건을 지정하고 추측성 지적을 금지해 돌렸다
  - 지연과 실패 동작은 실제로 실행해 확인했다. 지연 표본 min 200.8 / max 797.8ms,
  `moveFailRate:1` PATCH 시 500 응답 후 저장소 불변
- 채택 / 수정 / 기각
  - 수정. 테스트 기준선을 지연 0·실패율 0으로 잡았다. mock 기본값은 건드리지 않아
  "실패율을 낮추지 않는다"와 충돌하지 않는다
  - 채택. 도달 불가인 `typeof location` 분기를 삭제했다
  - 보류. 스키마 버전과 응답의 순서 판별 수단은 `race-condition`에서 `version`을 추가할 때 함께 본다.
    지금 넣으면 쓰는 데 없는 방어 코드가 된다
- 어떻게 고쳤나
  - `setup.ts`의 `afterEach(resetConfig)`를 `beforeEach` 기준선으로 옮겼다.
    되돌리는 대신 매 테스트 시작을 고정하는 쪽이다

---

## [mock-api] 계약 테스트와 캐시 버그 수정

- `dc98387`

### 프롬프트 1

```
code-reviewer가 잡아준 것들 테스트로 확인하고 진행하자
```

### AI 출력 요지

계약 테스트 17개. 화면 없이 Vitest + MSW `server`로 전부 검증된다.
앞 커밋에서 `handlers`를 공유하게 해둔 덕에 별도 mock 없이 그대로 붙였다.

### 리뷰 / 검증

- 무엇이 문제였나
  - `db.ts`의 모듈 캐시가 localStorage 초기화를 무시했다. 저장소를 비워도 옛 값이 나오고
  다음 쓰기가 옛 데이터를 되살린다
- 어떻게 알아챘나
  - 지적을 그대로 옮기지 않고 `db.test.ts`로 재현했다. 첫 테스트가 틀렸다 -
  시드의 `c-0001`이 원래 `hired`라 `hired`로 옮기는 게 무변화 이동이었다
  - 다른 단계로 옮기도록 고친 뒤, 수정 전 코드로 되돌려 실패하는 것을 확인하고 나서 고쳤다
- 채택 / 수정 / 기각
  - 수정. 캐시 무효화 시점을 관리하는 대신 캐시를 없앴다. 동기화할 게 없으면 어긋날 수도 없다
- 어떻게 고쳤나
  - `load()`가 매번 localStorage를 읽는다. 부수적으로 내부 배열 참조 유출도 사라졌다

