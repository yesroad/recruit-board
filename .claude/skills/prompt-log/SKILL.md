---
name: prompt-log
description: "방금 완료한 기능의 프롬프트·AI 출력·검증 내용을 PROMPTS.md에 기능별 섹션으로 추가. 2인 팀(author, reviewer)으로 생성. '기록', '프롬프트 로그', '기능 끝났어' 같은 요청과 커밋 직전에 반드시 사용. 설계 결정 기록은 decision-log가 담당한다."
user-invocable: true
allowed-tools: Agent, Bash, Read, Write, Edit
---

# Prompt Log Skill

2인 팀을 순차로 호출해 루트 `PROMPTS.md` 의 기능별 섹션을 만든다.

**이 스킬은 검증하지 않는다.** 사용자가 이미 한 검증을 인터뷰해서 문장으로 옮길 뿐이다.
에이전트가 찾아준 문제를 직접 재현하지 않은 채 옮기면 검증한 것이 아니라 검증한 척한 것이다.

## Workflow

1. **Precondition.**
   `git status --porcelain` 을 실행한다. 변경이 하나도 없으면 "기록할 작업 없음" 안내 후 종료.
   **스테이지 여부는 보지 않는다** — 기록이 먼저고 `git add` 는 그 뒤다.

2. **author 호출.**
   `prompt-log-author` 에이전트를 Agent 도구로 호출. 출력은 `.claude/_workspace/prompt-draft.md`.

3. **reviewer 호출.**
   `prompt-log-reviewer` 에이전트를 Agent 도구로 호출. 출력은 `.claude/_workspace/prompt-review.md`.

4. **판정 분기.**
   - `PASS` — 5번으로.
   - `REDO` — reviewer 수정 지시를 프롬프트에 포함해 author 재호출 (최대 2회).
   - `PENDING` — 인터뷰로 진입.

5. **`PROMPTS.md` 에 append.**
   파일이 없으면 루트에 만들고, 있으면 마지막에 추가한다. **기존 섹션은 수정하지 않는다.**

6. **마무리.** 요약을 제시하고 "이제 `/commit-msg`" 를 안내한다.

## 인터뷰

빈칸을 한 번에 몰아 묻는다. 기능당 1~2분을 넘기지 않는다.

- **어떻게 알아챘나** — 재현 / 테스트 / 코드 정독 / 아직 확인 안 함
- **채택·수정·기각, 그리고 왜**
- 수정했다면 그 의도

`무엇이 문제였나` 와 `어떻게 고쳤나` 의 사실 부분은 author가 이미 채웠으므로 묻지 않는다.

**"아직 확인 안 함"이면 그 항목을 지어내 채우지 않는다.**
(a) 지금 재현하고 오기 — 에이전트가 준 재현 절차를 다시 보여준다. (b) 비운 채 진행.
(b)를 택하면 섹션이 짧아진다. 감점 사유가 아니다 — 억지로 부풀린 리뷰가 오히려 형식적으로 읽힌다.

## 기록하지 않는 것

`lint` 스킬이 처리한 단순 린트·타입 오류. 단, 복잡한 타입 오류를 고쳤다면 설계 판단이 섞였으므로 기록 대상이다.
