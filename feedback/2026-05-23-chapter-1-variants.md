# Chapter 1 variant feedback — 2026-05-23

회귀물 1화 다섯 가지 버전에 대한 사용자 피드백 템플릿.
**Reference baseline (사용자 quality bar)**: `V_codex` — `novels/novel_1/chapters/chapter_001.opus.md` (Codex GPT-5.4 작성)

비교 markdown은 `novels/novel_1/chapters/chapter_001_comparison.md`에서 한 번에 5개를 펼쳐 볼 수 있습니다 (각 섹션의 `<details>` 토글).

---

## Quick rank (best → worst, by gut feel)

읽고 가장 마음에 드는 순서대로:

1.
2.
3.
4.
5.

---

## Per-variant notes

### V0 — Claude baseline (`chapter_001.md.experiment-baseline`)

- **잘된 점**:
- **안된 점**:
- **V_codex 대비 갭**:

### V_codex — Codex reference (`chapter_001.opus.md`)

- **유지하고 싶은 점**:
- **그래도 바꿀 점이 있다면**:

### V1 — writing-team-collab (1-pass Opus)

- **잘된 점**:
- **안된 점**:
- **V_codex 대비 갭**:

### V2 — writing-team-collab-2pass (draft → oracle → prose-surgeon)

- **잘된 점**:
- **안된 점**:
- **V_codex 대비 갭**:
- **2-pass 효과 체감**: (1-pass 대비 prose-surgeon 보정이 의미 있어졌나? — 변화 없음 / 약간 / 분명)

### V3 — writing-team-collab-3pass (+ chapter-polisher)

- **잘된 점**:
- **안된 점**:
- **V_codex 대비 갭**:
- **3-pass 효과 체감**: (polish 단계가 술술 읽힘/몰입감을 더했나? — 변화 없음 / 약간 / 분명)

---

## Dimensions I care about (자유 서술 — 무엇이 중요하든 적어주세요)

예시:
- 문체의 술술 읽힘 / 몰입감 / 페이스
- 대화 자연스러움 vs 정보 전달 위주
- 감각 묘사의 농도 (시각/청각/촉각/후각/미각)
- 정서/감정 흐름 (회귀 직후 깨달음의 무게)
- 한국 라이트노벨 회귀물 특유의 톤
- 도입 hook의 강도
- 장면 전환의 매끄러움
- 일인칭 시점의 일관성
- 메타/연출 언어 ("0.5초 침묵", "화면 페이드" 등) 누수
- 문장 리듬 (짧은 단문 연속 vs 만연체)

당신의 우선순위:
1.
2.
3.

---

## If I had to pick ONE diff to make the plugin output match V_codex, it would be:

(가장 결정적인 한 가지 변화 — 모델? 프롬프트? 파이프라인 단계? plot JSON 정제? 다른 무엇?)



---

## Open questions for diagnosis

진단 단계에서 답하고 싶은 의문 (있다면):

-

---

## Next plan (이 피드백 이후 무엇을 할지)

피드백을 다 적은 후, 다음 단계 선택:

- [ ] **A**: 가장 마음에 드는 변형판이 V_codex 수준에 도달 → 그 파이프라인을 default writing path로 설정
- [ ] **B**: 모든 변형판이 V_codex에 미치지 못함 → novelist.md / writer-brief-builder / quality-oracle / chapter-polisher 단계별 진단
- [ ] **C**: 변형판 중 일부가 가능성 보임 → 그 변형판의 약점을 좁혀 수정 (e.g., V2가 좋은데 대화만 약함 → prose-surgeon에 dialogue-naturalness directive 추가)
- [ ] **D**: 다른 방향 — 자유 서술

선택 + 사유:

