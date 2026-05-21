---
title: "feat: Lift Claude novelist prose to Codex level"
status: active
type: feat
created: 2026-05-21
---

# feat: Lift Claude novelist prose to Codex level

## Summary

Codex(GPT-5.4)와 Claude novelist는 이미 동일한 프롬프트 base(`agents/novelist.md`의 `<Critical_Constraints>`)를 공유한다. 두 결과물 차이는 모델 차이지만, Codex 출력의 핵심 스타일 시그니처(수량화 묘사, 객관화 시점, 정확한 분량)를 few-shot 예시와 분량 floor 강제로 novelist.md에 박아넣어 Claude 출력이 Codex 출력에 근접하도록 만든다.

## Problem Frame

**관찰**: `novels/novel_1/chapters/chapter_001.opus.md` (Codex 출력, 163줄, ~5,500자)가 `chapter_001.md` (Claude 출력, 116줄, ~4,000자)보다 사용자 평가상 문체·분량·디테일 면에서 우월. 사용자는 Codex 수준 출력을 기본 집필 파이프라인의 default로 원함.

**근본 원인**: 모델 차이가 본질이지만 프롬프트 측면에서 두 가지 실제 결함 확인:
1. **분량 가이드 불일치**: `codex-writer.mjs:204`는 "5000~8000자", `novelist.md:297`은 "5,000-5,500자". 같은 base 프롬프트인데 호출 측 분량 가이드만 다름. → Claude 분량 미달의 직접 원인 가능성.
2. **회귀물 1인칭 스타일 예시 부재**: novelist.md의 통합 예시 2개는 판타지 조제실 씬과 감정 고조 씬뿐. 회귀물 1인칭의 수량화·객관화 시점은 예시로 명시되지 않음.

**가설**: novelist.md에 (a) 회귀물 1인칭 스타일을 few-shot으로 추가하고 (b) 분량 floor를 강제하면, Claude 출력이 Codex 출력에 일정 수준 근접한다. 본질적 모델 차이는 못 메우지만 사용자가 인지한 차이의 일부(분량 미달, 정량화 부족)는 해소된다.

**원칙**: 옵션 (a) Codex 기본화는 거부됨 (Codex CLI 의존, 비용 부담). 옵션 (b) 프롬프트 개선만으로 진행.

## Scope Boundaries

### In scope
- `agents/novelist.md` 통합 예시 섹션에 회귀물 1인칭 스타일 few-shot 추가 (Codex `chapter_001.opus.md`에서 추출)
- `agents/novelist.md`와 `scripts/codex-writer.mjs`의 분량 가이드 통일 (5,000~6,000자 범위로)
- HARD RULE 또는 별도 섹션에 분량 floor 강제 규칙 추가
- 1화 재집필 후 비교 검증 (기존 chapter_001.md를 .claude.md로 백업, 재집필 결과 비교)
- 변경사항 커밋, 푸시, 태그 v2.4.0 (minor bump — novelist 프롬프트 구조적 변경)

### Out of scope (의도적 제외)
- `provider-routing.json` 기본값 변경 — 옵션 (a) 거부에 따름
- `teams/writing-team-codex-2pass.team.json` 변경 — Codex 경로는 그대로 유지 (--codex 플래그로 명시적 활성화)
- Codex 출력을 무조건 더 낫다고 단정 — Codex 출력도 HARD RULE 6 (메타내러티브 금지) 살짝 위반. 사용자 선호 ≠ 객관적 우월
- 모델 변경 (현재 novelist.md의 `model: opus` 그대로)

### Deferred to Follow-Up Work
- 재집필 결과가 여전히 Codex 미달이면 → 옵션 (c) 하이브리드 (--codex 플래그를 기본화하는 별도 PR)
- novel_1 외 다른 프로젝트의 회귀물 외 장르 (판타지·로맨스 등) few-shot 보강

---

## Key Technical Decisions

| 결정 | 근거 |
|---|---|
| **few-shot으로만 추가, HARD RULE은 그대로** | HARD RULE 6 (메타내러티브 금지)을 회귀물용으로 유연화하는 건 위험. Codex가 살짝 위반한 부분이 사용자에게 어필했다고 그 룰 자체를 약화하면 다른 장르 품질이 떨어짐. 회귀물 스타일은 예시로 채널링하고 HARD RULE은 보호. |
| **분량 floor를 HARD RULE 9로 신설** | 기존 HARD RULES 8개는 문체 규칙. 분량은 별 차원이지만 "지키지 않으면 자동 차단"의 성격은 동일 — HARD RULE로 격상해서 Claude가 무의식적으로 4000자에서 멈추는 패턴 차단. |
| **novel_1/chapters/chapter_001.md → chapter_001.claude.md로 백업** | 비교 검증 위해 기존 Claude 출력 보존. Codex 출력은 이미 .opus.md로 분리돼 있음. 재집필 결과는 chapter_001.md로 덮어쓰기. |
| **버전 v2.4.0 (minor bump)** | novelist.md 구조적 변경 (통합 예시 섹션에 회귀물 추가, HARD RULE 9 신설)은 patch가 아닌 minor. v2.3.x 시리즈는 audit/fix, v2.4는 능동적 품질 개선. |

---

## High-Level Technical Design

novelist.md 통합 예시 섹션의 변경 구조:

```text
<Critical_Constraints>
  통합 예시: 이것이 당신의 기준입니다
    예시 1: 일반 서술 씬 (판타지 조제실) ← 기존
    예시 2: 감정 고조 씬 ← 기존
    예시 3 (NEW): 회귀물 1인칭 — 수량화·객관화 시점
      BAD: 표준 라노 회귀물 1화 (현재 Claude chapter_001.md 발췌)
      GOOD: 수량화·객관화 스타일 (Codex chapter_001.opus.md 발췌)
      이 문단의 특징:
        - 시간/공간 정량화 ("0.5초쯤", "한 박", "다섯 걸음")
        - 객관화 시점 ("객관적으로, 헤드폰이...")
        - 자조와 결심의 진폭 ("자조 두 번으로 한 톤 풀어두고...")
        - HARD RULE 6 메타내러티브 금지는 여전히 적용 — 작가적 자의식 ≠ 캐릭터의 화수 인식

  HARD RULES (9개 — 생성 중 항상 적용)
    1~8. 기존
    9 (NEW). 분량 floor 강제
      목표 분량의 90% 미달 절대 금지.
      5,000자 목표면 4,500자 미만 출력 시 자동 실패.
      분량 채우기 위해 의미 없는 묘사 추가는 금지 — 씬을 추가하거나 디테일 밀도를 높여야 함.
</Critical_Constraints>
```

이 다이어그램은 의도된 변경 형태를 보여주는 directional guidance입니다. 실제 구현은 novelist.md 본문에 자연스러운 마크다운으로 통합.

---

## Implementation Units

### U1. Codex chapter_001.opus.md에서 회귀물 스타일 시그니처 추출

**Goal**: 사용자가 좋다고 평가한 Codex 출력의 핵심 스타일 요소를 few-shot 예시로 박아넣을 수 있는 형태로 정제.

**Dependencies**: none

**Files**:
- 읽기: `novels/novel_1/chapters/chapter_001.opus.md`
- 읽기: `novels/novel_1/chapters/chapter_001.md` (BAD 예시 후보)
- 출력: 이 플랜 문서에 인라인 (다음 unit이 참조할 수 있도록)

**Approach**:
1. Codex 출력에서 다음 3개 시그니처를 대표하는 단락 발췌:
   - **수량화 묘사**: "0.5초쯤", "한 박", "다섯 걸음", "0.3초" 같은 정량화가 집중된 단락
   - **객관화 시점**: 일인칭이면서 자신을 외부 시점으로 보는 단락 (예: "객관적으로, 헤드폰이 모니터 위로 미끄러져 내렸다.")
   - **자조-결심 진폭**: 자기 의도 노출과 결심이 한 호흡에 묶이는 단락 (예: "자조 두 번으로 한 톤 풀어두고, 그 사이에 결심을 깔기로 했다")
2. Claude 출력에서 같은 비트를 다룬 단락을 BAD 예시로 발췌 (수량화 부재, 표준 회귀물 클리셰)
3. 각 발췌가 100~200자 범위로 들어가도록 자르기 (HARD RULE 2 단문 비율 등 모든 규칙 자체 검증)

**Test scenarios**:
- 발췌된 GOOD 단락이 HARD RULE 1~8을 모두 충족하는가 (필터워드 0, 단문 비율 OK, 감각 3+/500자, 등)
- 발췌된 BAD 단락이 실제로 발췌된 GOOD 단락에 비해 명백히 열등한가 (BAD가 BAD로 인지될 만큼 차이가 분명한가)
- Test expectation: none — 추출 산출물은 이 플랜 문서에 인라인되어 다음 unit으로 전달, 별도 테스트 없음

**Verification**: 이 플랜 문서에 발췌된 3쌍의 BAD/GOOD 단락이 적재됨.

---

### U2. agents/novelist.md 통합 예시 섹션에 "예시 3: 회귀물 1인칭" 추가

**Goal**: U1에서 추출한 BAD/GOOD 단락을 novelist.md의 기존 통합 예시 형식과 일관된 구조로 삽입.

**Dependencies**: U1

**Files**:
- 수정: `agents/novelist.md` (Critical_Constraints 섹션 내 통합 예시 영역, 현재 line 27~67)

**Approach**:
1. 현재 "예시 2: 감정 고조 씬" (line 55~67) 뒤에 "예시 3: 회귀물 1인칭 — 수량화·객관화 시점" 추가
2. 형식은 기존 예시와 동일: BAD 발췌 → 문제점 bullet → GOOD 발췌 → 특징 bullet
3. 특징 bullet에 명시:
   - 시간/공간 정량화의 효과 (디테일 신뢰감)
   - 객관화 시점이 일인칭과 충돌하지 않는 메커니즘 (관찰자적 자기 인식)
   - 자조-결심 진폭이 라노 회귀물 1화에 적합한 이유
   - **명시적 가드레일**: 이 스타일은 회귀물 1인칭에 한정. 다른 장르에서는 예시 1·2 우선. HARD RULE 6 (메타내러티브) 위반 아님 — 작가적 자의식 노출은 캐릭터의 "N화 인식"과 다름.

**Patterns to follow**: novelist.md 기존 통합 예시 2개의 마크다운 구조와 어조

**Test scenarios**:
- novelist.md를 codex-writer.mjs:157의 `<Critical_Constraints>` 정규식 매처가 여전히 잘 추출하는가 (정규식 boundary 깨뜨리지 않았는지)
- 새 예시의 GOOD 발췌가 novelist.md의 다른 BAD 예시와 충돌하지 않는가 (모순된 가이드 없는지)
- Test expectation: none — 프롬프트 문서 변경은 효과 검증을 U5에서 통합 수행

**Verification**: novelist.md에 "### 예시 3" 헤딩이 추가되고, BAD/GOOD/특징 3블록이 기존 형식대로 채워짐. `grep -A 30 "예시 3" agents/novelist.md` 출력 검토.

---

### U3. 분량 가이드 통일 + HARD RULE 9 (분량 floor) 신설

**Goal**: novelist.md와 codex-writer.mjs의 분량 가이드를 5,000~6,000자로 통일하고, novelist.md에 HARD RULE 9 "분량 floor 강제"를 추가해 Claude가 무의식적으로 4,000자에서 멈추는 패턴 차단.

**Dependencies**: none (U2와 독립, 같은 파일이지만 다른 섹션)

**Files**:
- 수정: `agents/novelist.md` (HARD RULES 섹션 line 70~109, QUALITY GATES 섹션 line 167~173, Emotional Arc Integration 회차 완료 체크리스트 line 296~303)
- 수정: `scripts/codex-writer.mjs` (line 204의 분량 가이드 문자열)

**Approach**:
1. **novelist.md HARD RULES 섹션에 HARD RULE 9 신설**:
   ```
   ### 9. 분량 floor 강제
   목표 분량(chapter_N.json의 target_word_count, 또는 style-guide.json의 default)의 90% 미달 절대 금지.
   5,000자 목표면 4,500자 미만 출력 시 자동 실패.
   분량 채우기 위해 의미 없는 묘사 추가는 금지 — 씬 추가나 디테일 밀도 향상으로 채울 것.
   ```
2. **novelist.md QUALITY GATES**: "Target word count: ±10% tolerance" → "Target word count: 90% floor (under)/+20% ceiling (over)" (Codex 가이드 5000~8000자에 맞춤)
3. **novelist.md 회차 완료 체크리스트 line 298**: "분량: 5,000-5,500자" → "분량: 5,000-6,000자 (절대 4,500자 미만 금지)"
4. **codex-writer.mjs line 204**: "목표 분량: 5000~8000자." → "목표 분량: 5,000~6,000자 (절대 4,500자 미만 금지)."
5. **novelist.md Self-Check 체크리스트 line 251**: HARD RULES 8개 → 9개로 갱신, 9번 항목 추가

**Patterns to follow**: 기존 HARD RULE 1~8의 형식 (제목 → 규칙 본문 → → 대체 기법 또는 예외)

**Test scenarios**:
- novelist.md HARD RULES 카운트가 9개로 일관 (HARD RULES 섹션 헤딩, Self-Check 체크리스트, Per-Scene Quality Gate line 259~268 모두 동기화)
- 분량 가이드가 novelist.md 3개 위치 + codex-writer.mjs 1개 위치에서 모두 동일 (drift 없음)
- codex-writer.mjs:204의 변경이 dry-run 출력에서 반영되는가
- Test expectation: 자동 테스트 작성은 없음 — 4개 위치 grep으로 일관성 수동 검증

**Verification**:
```bash
grep -n "분량\|5,000\|4,500" agents/novelist.md scripts/codex-writer.mjs
```
출력에서 4,500자 floor와 5,000~6,000자 범위가 모든 위치에서 동일하게 나타남.

---

### U4. 기존 chapter_001.md를 chapter_001.claude.md로 백업

**Goal**: 1화 재집필 전 기존 Claude 출력을 비교 baseline으로 보존.

**Dependencies**: none (U2/U3과 독립)

**Files**:
- 이동: `novels/novel_1/chapters/chapter_001.md` → `novels/novel_1/chapters/chapter_001.claude.md`

**Approach**: `git mv chapters/chapter_001.md chapters/chapter_001.claude.md` 후 commit (이 unit 단독 커밋, "chore: preserve original Claude chapter_001 for prose-quality baseline" 메시지).

**Test scenarios**:
- chapter_001.md가 더 이상 존재하지 않음 (재집필 시 충돌 없도록)
- chapter_001.claude.md가 새로 생기고 내용은 기존 chapter_001.md와 동일 (`diff` 또는 git history로 검증)
- chapter_001.opus.md는 그대로 (영향 없음)
- Test expectation: none -- 파일 이동만, 동작 검증 불필요

**Verification**: `ls novels/novel_1/chapters/chapter_001*.md` 가 `chapter_001.claude.md`와 `chapter_001.opus.md` 두 개만 보임.

---

### U5. 개선된 프롬프트로 1화 재집필 + 비교 검증

**Goal**: U2/U3의 novelist.md 변경이 실제로 Codex 수준에 근접한 출력을 생성하는지 검증. 분량 floor가 작동하는지, 회귀물 스타일 few-shot이 정착했는지 확인.

**Dependencies**: U2, U3, U4

**Files**:
- 생성: `novels/novel_1/chapters/chapter_001.md` (재집필 산출물)
- 읽기: `novels/novel_1/chapters/chapter_001.claude.md` (baseline)
- 읽기: `novels/novel_1/chapters/chapter_001.opus.md` (target)
- 읽기: `agents/novelist.md` (개선된 프롬프트)
- 읽기: `novels/novel_1/chapters/chapter_001.json` (있는 경우, plot)

**Approach**:
1. Task 도구로 novelist subagent 호출 (또는 직접 Claude로 1화 집필) — novelist.md 새 프롬프트 적용
2. 재집필 결과 분석:
   - 분량: 4,500자 이상인가? 5,000~6,000자 범위인가?
   - 수량화 묘사: "한 박", "0.5초", "다섯 걸음" 같은 정량화 표현이 baseline보다 늘었나?
   - 객관화 시점: 일인칭이면서 자기 객관화하는 단락이 들어갔나?
   - HARD RULES 1~9 위반 없는가?
3. **비교 보고서**를 stdout 또는 임시 파일에 작성 (분량, 스타일 시그니처 카운트, baseline 대비 변화)
4. **GO/NO-GO 판정**:
   - GO: 분량 floor 통과 + 스타일 시그니처 baseline 대비 50% 이상 증가 → 다음 unit 진행
   - NO-GO: 분량 floor 실패 또는 스타일 시그니처 변화 미미 → Deferred to Follow-Up으로 옵션 (c) 하이브리드 검토

**Execution note**: 재집필은 단일 시행이라 통계적 유의성 없음. 비교는 정성적 판정. 실패 시 retry 없이 NO-GO 처리하고 후속 PR로 위임.

**Test scenarios**:
- 재집필 결과가 4,500자 이상 (HARD RULE 9 작동 검증)
- 수량화 표현 등장 빈도가 baseline 대비 명백히 증가 (정성 판정)
- 캐릭터 보이스, POV 일관성은 baseline 수준 유지 (회귀 스타일 도입으로 다른 품질 떨어지지 않았는지 회귀 검증)
- HARD RULE 6 (메타내러티브) 위반이 없는지 ("N화", "지난번" 같은 표현 검색)

**Verification**:
- `wc -m novels/novel_1/chapters/chapter_001.md` 가 4,500 이상
- `grep -c "0\\.[0-9]초\\|한 박\\|한 줄" novels/novel_1/chapters/chapter_001.md` 가 chapter_001.claude.md 대비 증가
- 정성적: 재집필 결과를 사용자에게 보여주고 baseline·target과 비교 평가 받음 (LFG 파이프라인의 ce-code-review 단계에서 자동 검증 어려움 — 인간 평가 필요)

---

### U6. 커밋, 푸시, 태그 v2.4.0

**Goal**: U2~U5 변경사항을 통합 커밋하고 v2.4.0 minor release로 배포.

**Dependencies**: U5 (GO 판정 시)

**Files**:
- 수정: `.claude-plugin/marketplace.json` (version 2.3.2 → 2.4.0)
- 수정: `.claude-plugin/plugin.json` (version 2.3.2 → 2.4.0)

**Approach**:
1. version bump 2개 파일에서 2.3.2 → 2.4.0
2. 단일 commit: "feat(novelist): codex-style prose few-shot + length floor enforcement"
3. push origin master
4. tag v2.4.0 + push tag

**Note**: lfg 파이프라인의 ce-commit-push-pr 단계가 이 작업을 자동 수행할 가능성 있음. 그 단계에서 처리되면 U6은 사실상 skip.

**Test scenarios**:
- `claude plugin validate .` 통과
- 두 version 필드가 2.4.0으로 일치 (drift 검증 — v2.3.1 사건의 재발 방지)
- git tag list에 v2.4.0 등장, remote에 push됨

**Verification**: `gh release list` 또는 `git ls-remote --tags origin | grep v2.4.0` 출력 확인.

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **재집필 결과가 baseline과 차이 미미** (모델 본질 차이가 너무 커서 프롬프트로 못 메움) | 중 | 중 | U5의 NO-GO 판정으로 검출. 후속 PR로 옵션 (c) 하이브리드 검토. 이 플랜이 실패해도 novelist.md 개선분은 다른 회차/프로젝트에 여전히 유효. |
| **회귀물 스타일 few-shot이 다른 장르 출력 오염** (판타지 회차에 수량화 묘사가 침입) | 저 | 중 | 예시 3의 가드레일 명시: "회귀물 1인칭에 한정". 다른 장르 회차로 회귀 테스트 가능 (U5 후속) — 단, 이 플랜에선 명시적으로 Deferred. |
| **HARD RULE 9 분량 floor가 의미 없는 묘사 패딩 유발** | 중 | 저 | HARD RULE 9 본문에 명시: "분량 채우기 위해 의미 없는 묘사 추가는 금지 — 씬 추가나 디테일 밀도 향상으로 채울 것". critic agent가 패딩 검출. |
| **codex-writer.mjs의 `<Critical_Constraints>` 정규식 매처가 새 예시 추가로 broken** (line 157) | 저 | 고 | U2 Verification에 정규식 boundary 검증 포함. dry-run으로 추출 결과 확인. |
| **novelist.md 변경이 다른 의존 스크립트에도 영향** (codex-writer 외 다른 곳에서 novelist.md를 읽는 코드) | 저 | 중 | `grep -r "novelist.md\|novelist\\.md" scripts/ agents/ teams/` 로 의존성 사전 점검. |

---

## System-Wide Impact

- **codex-writer.mjs**: novelist.md의 `<Critical_Constraints>` 섹션을 정규식으로 추출 → 새 예시 3이 Codex 프롬프트에도 자동 반영됨. 이건 의도된 효과 (Codex 출력 자체도 개선될 수 있음).
- **다른 writing teams**: `writing-team-2pass`, `writing-team-collab-*` 등은 novelist agent를 직접 호출 → novelist.md 변경 자동 반영.
- **scene-by-scene 모드** (novelist.md line 253~268): HARD RULES 카운트(현재 8개) 변경 시 동기화 필요. U3에서 처리.
- **다른 캐릭터 agents** (`agents/characters/*.md`): novelist.md를 import하지 않음 → 영향 없음.

---

## Verification Strategy

1. **정적 검증** (U2, U3 직후):
   - `grep`으로 HARD RULES 카운트, 분량 가이드 일관성 확인
   - `claude plugin validate .`로 마켓플레이스 manifest 검증

2. **동적 검증** (U5):
   - 1화 재집필 → 분량, 스타일 시그니처, HARD RULES 준수 측정
   - baseline (chapter_001.claude.md) 대비 변화량 정량 비교
   - target (chapter_001.opus.md) 대비 근접도 정성 판정

3. **인간 평가** (LFG 파이프라인 종료 후):
   - 사용자가 재집필 결과를 baseline·target과 비교 평가
   - 사용자 평가가 NO-GO면 옵션 (c) 하이브리드 검토 PR로 이어짐
