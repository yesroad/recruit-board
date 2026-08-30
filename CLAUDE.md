# recruit-board

채용 파이프라인 보드. 서류검토 → 면접 → 처우협의 → 최종합격/불합격.
React + Vite · Vitest + Testing Library · MSW

## 규칙

- 커밋 1개 = 기능 1개. `squash`·`force-push` 금지.
- 기능 커밋에는 PROMPTS.md 섹션을 함께 스테이지한다. `chore`·`docs`는 예외.
- 커밋 본문에 AI 초안을 어떻게 손봤는지 한 줄을 남긴다.
- MSW handler는 지연 200~800ms · 실패 15%를 유지한다. 낮추지 않는다.
- 테스트는 `src/mocks/handlers.ts` 를 재사용한다.
- **불필요한 방어 로직을 넣지 않는다.** 타입으로 보장된 `null` 체크, 일어나지 않는 케이스의 `try-catch`, 빈 `catch`.
- **검증은 사람이 한다.** 재현하지 않은 지적을 PROMPTS.md에 옮기지 않는다.
- 모호한 요구사항은 가정하고 그 가정을 DECISIONS.md에 남긴다.
- md 기록은 커밋 메시지와 같은 밀도로 쓴다. 각 항목 1~2줄.

## 기능 단위명

```
mock-api  board-layout  card-list  stage-move  optimistic-update  search-filter
detail-panel  loading-error-empty  a11y-keyboard  race-condition  undo  virtualization
```

커밋 scope와 PROMPTS.md 섹션 제목이 이 이름으로 일치한다.
기능이 아닌 변경은 scope 없이 `chore:`.
진행하며 쪼개거나 합칠 수 있다. 바꿨으면 이 목록도 함께 고친다.

## 작업 루프

1. 구현
2. `/review`
3. **지적을 직접 재현하고 수정한다.** 고쳤으면 `/review` 재실행
4. `/prompt-log`
5. `git add -A`
6. `/commit-msg` — lint와 test는 여기서 자동으로 돈다
7. `git commit`
8. 결정이 있었으면 `/decision-log`

## 경로

- 제출물은 루트에 둔다. `README.md` `PROMPTS.md` `DECISIONS.md`
- 에이전트 작업 파일은 `.claude/_workspace/`. 제출물이 아니다.
