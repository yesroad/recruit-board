---
name: commit-msg
description: "스테이지된 변경을 바탕으로 Conventional Commits 형식의 커밋 메시지를 2인 팀(author, reviewer)으로 생성. '커밋 메시지', 'commit message', '커밋 메시지 만들어줘' 같은 자연어 요청 시 반드시 사용. 단, 이미 메시지가 작성된 `git commit -m` 대체는 아니다."
user-invocable: true
allowed-tools: Agent, Skill, Bash, Read, Write
---

# Commit Message Skill

2인 팀을 순차로 호출해 `CLAUDE.md`의 커밋 규칙에 맞는 메시지를 생성한다.
**메시지 생성까지만 한다. 커밋은 하지 않는다.**

## Workflow

1. **Precondition — 스테이지 확인.**
   `git diff --cached --quiet` 를 실행한다.
   exit code 1(변경 있음)이면 통과, exit code 0(변경 없음)이면 "먼저 `git add`" 안내 후 종료.

2. **lint 게이트.**
   `lint` 스킬을 실행한다.
   오류가 남으면 **중단하고 사용자에게 넘긴다** — 통과하지 못하는 코드로 커밋 메시지를 만들지 않는다.
   lint가 파일을 고쳤으면 `git add` 로 다시 스테이지하도록 안내한 뒤 1번으로 돌아간다.

3. **test 게이트.**
   `git diff --cached --name-only` 로 스테이지된 변경의 성격을 본다.
   훅·상태 로직·순수 함수·MSW handler가 포함되면 `test-unit` 스킬을 실행한다.
   레이아웃·스타일·마크업·문서만 바뀌었으면 건너뛰고 그 판단을 한 줄로 알린다.
   테스트가 실패하면 **중단하고 사용자에게 넘긴다.**

4. **Precondition — 기록 동반 확인.**
   커밋과 `PROMPTS.md` 기록은 1:1로 대응해야 한다.
   `git diff --cached --name-only` 에 `PROMPTS.md` 가 없고, 스테이지된 변경이 `chore`/`docs` 성격이 아니면
   **차단하지 말고 경고만 남긴다.**
   > `PROMPTS.md`가 함께 스테이지되지 않았습니다. 이 기능의 프롬프트·리뷰 섹션을 함께 커밋할지 확인하세요.

5. **author 호출.**
   `git-operator` 에이전트를 Agent 도구로 호출.
   출력은 `.claude/_workspace/commit-draft.md`.

6. **reviewer 호출.**
   `git-operator-reviewer` 에이전트를 Agent 도구로 호출.
   출력은 `.claude/_workspace/review-report.md`.

7. **판정 분기.**
   - `PASS` — draft를 사용자에게 제시하고 완료.
   - `REDO` — reviewer 수정 지시를 프롬프트에 포함해 author 재호출 (최대 2회).
   - `SPLIT` — **재호출하지 않고 즉시 종료.** 여러 기능이 한 커밋에 섞였다는 뜻이므로
     reviewer가 적은 분리 방법을 사용자에게 그대로 전달한다. 메시지를 만들어 주지 않는다.
   - `ESCALATE` — 재호출하지 않고 종료. 남은 문제를 사용자에게 제시한다.

8. **루프 종료.**
   `PASS`·`SPLIT`·`ESCALATE`, 또는 재호출 2회 초과 시 종료.
   2회 초과 시 "자동 승인 한계 도달 — 수동 검토 필요" 경고와 함께 마지막 draft와 리포트를 함께 반환한다.
   **형식 미달인 draft를 PASS로 바꿔 반환하지 않는다.**

9. **마무리.**
   draft에 `TODO(ai-review):` 가 남아 있으면 사용자에게 그 줄을 직접 채우도록 안내한다.
   AI 초안을 어떻게 손봤는지는 사람만 아는 정보이며, 지어내면 기록과 어긋난다.

## 산출물 경로

에이전트 작업 파일은 `.claude/_workspace/` 아래에 둔다. 제출물이 아니므로 커밋에 섞이지 않도록
이 경로를 ignore 대상에 포함할 것.
