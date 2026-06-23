import { describe, it, expect } from 'vitest';
import {
  analyzeProseTasteMetrics,
  evaluateProseTaste,
} from '../../src/quality/prose-taste-gate.js';
import { StyleStageEvaluator } from '../../src/quality/stage-evaluators.js';
import { validateScopeCompliance } from '../../src/pipeline/prose-surgeon.js';

const CLEAN_PROSE = `
비가 그친 뒤 골목의 물웅덩이가 간판 불빛을 천천히 흔들었다.

서연은 젖은 소매를 접고 문 앞에 섰다. 안쪽에서는 컵을 내려놓는 소리가 한 번 났고, 그 뒤로는 아무도 움직이지 않았다.

"늦었네."

그 말에 변명부터 떠올랐지만, 서연은 봉투를 먼저 내밀었다. 종이 끝이 조금 구겨져 있었다.
`.trim();

const IRRITATING_AI_PROSE = `
도현은 방에 들어섰다. 감각이 왔다. 반응이 잡혔다. 변화가 있었다.

심장이 빠르게 뛰었다. 손끝이 저릿했다. 숨이 막혔다. 가슴이 조여왔다. 목구멍이 말랐다.

차가운 빛이 번쩍였고, 비릿한 냄새가 났고, 달콤한 향이 퍼졌고, 뜨거운 온도가 피부에 닿았다. 그것은 칼날처럼 날카롭고, 유리처럼 차갑고, 폭풍처럼 거칠고, 마치 심연 같은 어둠이었다.

하나, 그는 살아야 했다. 둘, 그녀를 구해야 했다. 셋, 이 복선은 다음 회차의 보상 쾌감으로 이어질 것이다.
`.trim();

const CHOPPY_AI_PROSE = `
도현은 골목에 섰다. 문이 닫혔다. 전화가 끊겼다. 발소리가 멎었다. 불빛이 꺼졌다. 그는 멈췄다. 손이 떨렸다.

아무도 말하지 않았다.
`.trim();

const IMMERSIVE_RHYTHM_FLATLINE_PROSE = `
서연은 이 상황이 더 이상 단순한 오해가 아니라고 생각했다.
민준의 침묵은 두 사람 사이의 거리를 보여 주는 결과였다.
관계는 이미 예전과 다른 상태가 되어 있었다.
모든 선택은 결국 서로를 시험하는 의미였다.
불안은 더 커졌고 확신은 점점 작아졌다.
그녀는 자신이 왜 멀어졌는지 알 수 있었다.
그 시간은 두 사람에게 중요한 의미로 남아 있었다.
`.trim();

const GROUNDED_IMMERSIVE_RHYTHM_PROSE = `
서연은 봉투를 컵 아래로 밀었다.
민준은 대답 대신 녹음기의 빨간 불을 껐다.
복도 끝 발소리가 멎자 그녀는 사진 뒷면의 번호를 확인했다.
"네가 고르면 내가 책임질게."
그 말 뒤에 문 잠금장치가 한 번 더 내려갔다.
`.trim();

const HEDGED_PERCEPTION_PROSE = `
서연은 문 앞에 선 것 같았다. 안쪽의 침묵은 어쩐지 대답처럼 느껴졌다. 손잡이는 묘하게 차가운 듯했다.

그는 아직 화난 것 같았고, 그녀의 말도 분명하지 않은 모양이었다. 복도 끝 불빛은 희미하게 흔들렸고, 모든 일이 어렴풋이 잘못된 느낌이었다.
`.trim();

const ABSTRACT_FILTERED_PROSE = `
도현은 진실과 운명과 기억의 의미를 생각했다. 도현은 그 감정의 가능성을 알 수 있었다. 도현은 관계의 균열과 선택의 고통을 깨달았다. 도현은 침묵의 불안과 상처의 존재를 느꼈다. 도현은 이 모든 혼란이 결국 절망과 희망 사이에 있다는 사실을 이해했다.

그는 그 결심이 자신의 의지와 욕망을 증명한다고 생각했다. 그는 그 상실의 공허함이 구원의 가능성이라고 알 수 있었다. 그는 이 모든 감정이 아직 끝나지 않았다는 사실을 깨달았다.
`.trim();

const THERAPY_SPEAK_PROSE = `
서연은 민준에게 화가 난 것이 아니라 자신의 불안정 애착과 인정욕구가 반응한 것이라고 깨달았다. 그 집착은 어린 시절의 결핍감 때문에 생긴 방어기제였다는 사실을 알 수 있었다. 그녀는 자존감이 낮아서 상대에게 의존하려 했고, 그래서 관계 불안이 모든 선택의 원인이었다고 이해했다.

결국 그 트라우마는 자기혐오와 회피 성향을 증명했고, 서연은 그 심리적 상처가 지금의 침묵을 만든 문제였다고 정리했다.
`.trim();

const GROUNDED_INNER_WOUND_PROSE = `
서연은 민준이 "괜찮아"라고 말할 때마다 한 발 늦게 웃었다. 괜찮다는 말은 대답이 아니라 문을 닫는 소리처럼 들렸다.

트라우마라는 단어가 떠올랐지만, 그녀는 그 말을 삼키고 컵 아래 사진을 먼저 꺼냈다. 사진 뒷면의 번호가 손끝에 묻자 민준은 의자를 문 앞으로 밀었다.
`.trim();

const BACKSTORY_INFO_DUMP_PROSE = `
서연은 어린 시절부터 늘 문 앞에서 기다리는 아이였다.
그때부터 그녀는 누구도 쉽게 믿지 못하는 사람이 되었다.
몇 년 전의 사고는 가족의 모든 관계를 바꾸어 놓았다.
그날 이후 서연은 작은 소리에도 과거의 복도를 떠올렸다.
예전의 약속은 아직도 그녀의 선택을 설명하는 이유였다.
오래전 남은 비밀은 두 사람 사이의 침묵을 만들었다.

민준은 탁자 앞에 앉아 있었다.
`.trim();

const GROUNDED_BACKSTORY_TRIGGER_PROSE = `
서연은 몇 년 전 사고를 떠올렸다.
그러나 문틈 아래 새 봉투가 밀려 들어오자 그녀는 사진을 꺼내 번호를 확인했다.
번호가 일치하자 민준은 녹음기를 켜고 문을 막았다.
`.trim();

const RELATIONSHIP_MONTAGE_SUMMARY_PROSE = `
시간이 흘렀고 두 사람의 거리는 점점 가까워졌다.
며칠 사이 서연은 민준을 조금씩 믿게 되었다.
그동안 민준의 마음도 서서히 달라졌다.
두 사람 사이의 오해는 어느새 풀려 있었다.
그렇게 관계는 이전보다 깊어졌다.
결국 서로에게 특별한 존재가 되었다.
`.trim();

const GROUNDED_RELATIONSHIP_TURN_PROSE = `
사흘 뒤, 서연은 봉투 안쪽의 번호를 민준에게 건넸다.
민준은 신고 대신 녹음기를 켜고 "네가 고르면 내가 책임질게"라고 말했다.
서연은 사진을 찢지 않고 주머니에 넣었다.
민준이 문 앞을 막자 그녀는 잠금장치 위에 손을 올렸다.
`.trim();

const TIME_SKIP_SUMMARY_CHAIN_PROSE = `
며칠이 지났다.
준비는 끝났다.
계획은 완성됐다.
사람들은 각자 움직였다.
상황은 빠르게 달라졌다.
필요한 것은 모두 갖춰졌다.
남은 것은 결전뿐이었다.
`.trim();

const GROUNDED_TIME_SKIP_PROSE = `
사흘 뒤, 서연은 젖은 봉투를 경찰서 계단참에 내려놓았다.
봉투 안쪽의 사진과 신고서에는 같은 주소가 적혀 있었다.
기한이 두 시간 줄어든 탓에 민준은 계획을 포기하고 문을 잠갔다.
서연은 전화 기록을 확인하자마자 번호를 눌렀고, 계단 아래 통제선이 다시 닫혔다.
`.trim();

const CONTRASTIVE_REFRAME_CADENCE_PROSE = `
그건 승리가 아니었다.
유예였다.
그건 선택이 아니었다.
대가였다.
문제는 두려움이 아니었다.
익숙함이었다.
남은 것은 희망이 아니었다.
경고였다.
`.trim();

const GROUNDED_CONTRASTIVE_REFRAME_PROSE = `
그건 승리가 아니라, 서연이 봉투에 서명하고 문을 잠그는 선택이었다.
민준은 다친 손으로 사진을 밀어 넣었고, 닫힌 문 뒤에서 발소리가 멎었다.
문제는 두려움이 아니라 손잡이에 묻은 피였다.
서연은 통제선 안으로 들어가 번호를 확인하고 전화를 걸었다.
`.trim();

const LORE_NAME_OVERLOAD_PROSE = `
아르카디온 왕국은 칠성 교단과 백은 마탑의 계약으로 세워졌다고 전해졌다.
흑요석 제국군은 에테르 코어와 루멘 룬을 관리하는 황실 프로토콜에 속해 있었다.
청염 길드는 제3게이트 던전과 성역 결계를 아카데미 랭크 시스템으로 분류했다.
노바 재단은 성물 의식과 성검 예언을 원로원 프로젝트의 법칙으로 기록했다.
서연은 그 모든 이름을 한 번에 듣고도 컵을 잡지 못했다.
`.trim();

const GROUNDED_LORE_INTRO_PROSE = `
서연은 낡은 목걸이의 푸른 돌을 손바닥에 올렸다.
민준은 그것을 마나 코어라고 불렀지만, 설명은 거기서 멈췄다.
돌이 손바닥에서 금이 가자 문 안쪽 경보가 켜졌다.
서연은 컵 아래 숨겨 둔 사진을 꺼내 코어의 문양과 맞춰 봤다.
번호가 일치하자 민준은 "한 개만 기억해. 이걸 열면 계약이 끝나."라고 말했다.
`.trim();

const SYSTEM_STAT_BLOCK_DUMP_PROSE = `
상태창이 떠올랐다.
레벨 12.
힘 34.
민첩 28.
체력 40.
스킬 화염구 Lv. 3.
보상 경험치 500.
퀘스트가 갱신됐다.
스탯 포인트 3을 획득했다.
등급은 B로 상승했다.
`.trim();

const GROUNDED_SYSTEM_COST_PROSE = `
상태창이 떠올랐다.
남은 HP가 12로 떨어지자 서연은 회복 포션 대신 문 잠금 해제를 선택했다.
스킬 화염구 Lv. 3은 마력을 40 소모했고, 그 바람에 퇴로의 결계가 꺼졌다.
보상 경험치 500이 들어왔지만 민준의 위치 추적 시간이 30초 줄었다.
`.trim();

const DECLARED_RESOLVE_LOOP_PROSE = `
서연은 더 이상 물러설 수 없다고 결심했다.
그녀는 반드시 진실을 밝혀야 한다고 다짐했다.
이제는 두려움을 피하지 않기로 했다.
민준도 끝까지 버티기로 마음먹었다.
두 사람은 포기할 수 없다는 각오를 다시 세웠다.
그러나 봉투도, 전화도, 문도 아직 움직이지 않았다.
`.trim();

const GROUNDED_RESOLVE_ACTION_PROSE = `
서연은 더 이상 물러설 수 없다고 생각했다.
그래서 봉투를 찢고 사진 뒷면의 번호로 전화를 걸었다.
통화음이 두 번 울리자 민준은 문을 잠그고 녹음기를 켰다.
서연은 도망치는 대신 신고서 아래에 이름을 서명했다.
`.trim();

const REVELATION_SUMMARY_LEAP_PROSE = `
서연은 그제야 모든 것을 깨달았다.
흩어져 있던 단서들이 하나로 이어졌다.
진실은 처음부터 민준을 가리키고 있었다.
모든 의문이 풀렸고 답은 명확했다.
이제 남은 것은 진실을 밝히는 일뿐이었다.
`.trim();

const GROUNDED_REVELATION_DEDUCTION_PROSE = `
서연은 봉투 안쪽의 숫자 세 개를 컵 옆에 적었다.
첫 번째 숫자만 신고 기록의 시간과 달랐다.
사진 뒷면의 번호를 로그 파일과 맞춰 보자 민준의 출입 기록이 7분 비어 있었다.
서연은 그제야 민준이 로그를 바꿨다는 것을 알아차리고 녹음기를 켰다.
`.trim();

const PROCEDURAL_CHECKLIST_CADENCE_PROSE = `
서연은 파일을 확인했다.
통화 기록을 검토했다.
사진 뒷면의 번호를 대조했다.
로그 파일을 다시 열었다.
CCTV 시간을 정리했다.
민준은 자료를 분류했다.
모든 기록은 조사 목록에 추가됐다.
`.trim();

const OBJECT_ACTION_LOG_CADENCE_PROSE = `
봉투 안쪽의 숫자를 손바닥 위에 옮겨 적었다.
접힌 사진 뒷면의 얼룩을 휴대폰 불빛 아래에서 다시 확인했다.
통화 기록 맨 아래 빈칸을 노트 첫 줄에 그대로 베껴 놓았다.
컵 옆에 놓인 녹음기의 시간을 신고 기록과 천천히 맞춰 보았다.
복도 끝 카메라 번호를 지도 가장자리에 작게 표시해 두었다.
탁자 아래 떨어진 열쇠를 주머니에 넣고 문 앞까지 걸어갔다.
`.trim();

const GROUNDED_PROCEDURAL_DEDUCTION_PROSE = `
서연은 통화 기록을 확인하다가 21시 14분만 비어 있는 것을 봤다.
사진 뒷면의 번호를 로그와 맞춰 보자 민준의 알리바이가 7분 무너졌다.
민준은 CCTV 시간을 되감았고, 화면 속 남자가 오른손으로 출입카드를 찍는 장면에서 멈췄다.
서연은 용의자 순서를 바꾸고 즉시 신고서 아래에 이름을 적었다.
`.trim();

const ACTION_CHOREOGRAPHY_LOOP_PROSE = `
서연은 검을 휘둘렀다.
상대는 몸을 낮춰 피했다.
민준은 주먹을 날렸다.
괴물은 방패로 막았다.
서연은 다시 칼을 찔렀다.
상대는 뒤로 물러섰다.
민준은 발차기를 넣었다.
`.trim();

const GROUNDED_ACTION_CONSEQUENCE_PROSE = `
서연은 검을 휘둘렀고 칼날이 벽에 박히자 퇴로가 막혔다.
민준은 방패를 들어 막았지만 손목이 꺾여 검을 놓쳤다.
괴물이 달려들자 서연은 인질의 끈을 끊고 계단 쪽으로 밀어 올렸다.
상대가 뒤로 물러선 순간 경보가 울렸고 전세가 바뀌었다.
`.trim();

const COMMA_OVERLOAD_PROSE = `
서연은 문을 열고, 멈춰 서고, 숨을 삼키고, 손잡이를 놓고, 뒤를 돌아보고, 다시 앞으로 보고, 아무 말도 하지 않았다. 그는 봉투를 집고, 접힌 모서리를 펴고, 이름을 확인하고, 표정을 감추고, 잔을 내려놓고, 낮게 웃었다.
`.trim();

const NOMINALIZED_TRANSLATIONESE_PROSE = `
그것은 단순한 우연이 아니었다. 그가 본 것은 오래된 기록의 반복이었다. 남은 것은 더 큰 침묵뿐이었다. 이 문제는 경찰에 의해 확인되었고, 그 기록에 대하여 아무도 설명하지 않았다. 그는 답을 찾을 수 있었다고 생각했다. 그녀는 이 상황에 있어서 가장 위험한 선택지를 가지고 있었다.

그것은 결국 피할 수 없는 상태였다. 그 결정은 두 사람의 침묵으로 인하여 늦어졌고, 그가 할 수 있는 것은 기다리는 것뿐이었다. 그는 그녀를 위해 거짓말하지 않으면 안 된다는 결론을 알 수 있었다.
`.trim();

const CONNECTIVE_CRUTCH_PROSE = `
그리고 서연은 문 앞에 멈췄다. 그리고 봉투를 다시 접었다. 그리고 복도 불빛이 꺼졌다. 그리고 안쪽에서 컵이 밀리는 소리가 났다.

하지만 그는 대답하지 않았다. 하지만 손잡이는 조금 움직였다. 하지만 문틈의 그림자는 그대로였다. 하지만 그녀는 뒤로 물러나지 않았다.
`.trim();

const REPORTING_TAIL_PROSE = `
이서진은 지하보도 입구에서 멈췄다. 앱의 예고가 실제 사건과 맞아떨어진다는 사실이 보였다. 피해자 로그와 현장 시간이 같은 초에 멈췄다는 점이 드러났다. 남은 선택의 의미가 확인됐다.

그는 손에 든 화면을 내려다봤고, 경찰 신고 기록이 비어 있다는 상황이 정리됐다. 모든 단서가 다음 위험으로 이어진다는 결론이 보였다.
`.trim();

const OFFSCREEN_RESOLUTION_SUMMARY_PROSE = `
서연은 봉투를 들고 계단을 뛰어 내려갔다.

조사 끝에 피해자 로그가 조작됐다는 사실이 밝혀졌다. 결국 내부 공범은 체포됐고 사라진 아이도 구출됐다.

며칠 뒤 사건은 정리됐고 두 사람은 다시 평온을 되찾았다.
`.trim();

const ONPAGE_RESOLUTION_SCENE_PROSE = `
서연은 계단참에서 봉투를 찢어 로그 출력물을 꺼냈다.
붉은 줄 아래 시간은 신고 기록보다 7분 늦었다.
민준이 손전등을 낮추자 종이 가장자리의 계정명이 드러났다.
"내부자야."
그 말이 끝나기 전에 서연은 휴대폰을 켜고 서버실 출입 기록을 열었다.
문 안쪽에서 누군가 잠금장치를 돌렸고, 두 사람은 동시에 계단 난간 아래로 몸을 낮췄다.
`.trim();

const EMPHASIS_PUNCTUATION_PROSE = `
"말해!"
"지금 당장!!"
"왜 그래?!"
"여기 있는 거 맞지?!"
"싫어!!!"
서연은 문을 두드렸다…… 복도 끝의 불빛이 깜박였다…….
`.trim();

const GENERIC_TEASER_PROSE = `
서연은 봉투를 탁자 위에 내려놓았다. 그는 아직 몰랐다. 이것이 모든 비극의 시작이었다.

민준은 문밖의 발소리를 듣고도 고개를 돌리지 않았다. 그 침묵은 다가올 파국의 예고였다. 운명은 이미 조용히 움직이고 있었다.
`.trim();

const THIN_CLIFFHANGER_ENDING_PROSE = `
서연은 봉투를 접어 컵 아래에 밀어 넣었다. 민준은 대답하지 않고 복도 쪽 불빛을 봤다.

그러나 두 사람은 아직 몰랐다. 진짜 비밀은 이제 시작이었다.
`.trim();

const CONCRETE_CLIFFHANGER_ENDING_PROSE = `
서연은 봉투를 접어 컵 아래에 밀어 넣었다. 민준은 대답하지 않고 복도 쪽 불빛을 봤다.

휴대폰이 울렸다. 화면에는 죽은 오빠의 번호가 떠 있었다.
`.trim();

const DETACHED_CAMERA_PROSE = `
복도에는 낡은 액자가 걸려 있었다. 천장에는 꺼진 조명이 남아 있었다. 바닥에는 젖은 발자국이 이어져 있었다. 문 옆에는 우산 두 개가 세워져 있었다.

방 안에는 낮은 책상이 놓여 있었다. 창문은 닫혀 있었다. 벽에는 오래된 달력이 걸려 있었다. 서랍 위에는 빈 컵이 있었다. 구석에는 접힌 담요가 쌓여 있었다. 선반에는 먼지 쌓인 상자가 있었다. 침대 아래에는 작은 가방이 있었다. 문틈에는 검은 얼룩이 남아 있었다.
`.trim();

const POV_MIND_HOP_PROSE = `
서연은 봉투의 붉은 선이 자기 이름으로 이어진다고 생각했다. 민준은 그녀가 아직 거짓말을 믿고 있다고 확신했다. 서연은 컵 받침 아래 숫자가 함정이라는 걸 느꼈다.

민준은 문밖 발소리가 동료의 신호라고 믿었다. 도현은 두 사람이 아직 자기 계획을 모른다고 생각했다. 민준은 신고 기록을 숨겨야 한다고 결심했다.

서연은 계단 쪽 불빛을 보고 도망칠 수 없다고 깨달았다. 도현은 그 표정이 이미 무너졌다고 느꼈다.
`.trim();

const SEPARATED_POV_MIND_PROSE = `
서연은 봉투의 붉은 선이 자기 이름으로 이어진다고 생각했다. 컵 받침 아래 숫자를 접자 잉크가 손끝에 묻었다.

민준은 문밖 발소리가 동료의 신호라고 믿었다. 그는 의자를 문 앞으로 밀고 녹음기를 껐다.

도현은 두 사람이 아직 자기 계획을 모른다고 확신했다. 그는 계단 센서등을 끄고 휴대폰을 뒤집었다.
`.trim();

const EXPOSITORY_DIALOGUE_PROSE = `
민준은 파일을 탁자 위에 밀어 놓았다.

"설명하자면, 이 앱의 규칙은 살인이 일어나기 전 첫 수신자에게만 알림을 보내는 거야."
"핵심은 과거 미제 사건 번호와 가족 실종 파일이 같은 시스템으로 연결됐다는 뜻이야."
"정리하면 개발자는 다음 표적을 고르는 조건을 이미 알고 있었고, 우리는 그 원리를 찾아야 해."
"결론은 이 조직의 실험 목적이 피해자를 예측하는 능력을 검증하는 데 있다는 거야."

서연은 컵을 만지지 않았다.
`.trim();

const MONOLOGUE_DIALOGUE_PROSE = `
민준은 녹음기를 껐다.

"내가 어젯밤 네 이름을 본 건 우연이 아니야. 현관 앞에 떨어진 봉투가 먼저 있었고, 봉투 안쪽에는 네가 지운 주소와 같은 붉은 선이 있었어. 그래서 나는 신고 대신 여기로 왔어. 네가 문을 열기 전에 그 사람이 다시 전화를 걸 거라는 걸 알았고, 네가 한 번이라도 망설이면 복도 끝 카메라가 꺼진 틈으로 우리 둘 다 사라질 거야. 지금은 믿어 달라는 말보다 네가 컵 아래 숨긴 사진을 먼저 봐야 해. 그리고 네가 아니라고 부정해도 어제 통화 끝에 들린 엘리베이터 안내음은 이 건물에서만 나는 소리였어."

서연은 봉투를 접었다.
`.trim();

const SPLIT_DIALOGUE_TURN_PROSE = `
민준은 녹음기를 껐다.

"장난이 아니야."
"왜 그렇게 확신해?"
"봉투 안쪽 선이 네가 지운 주소와 같았어."
"그래서 신고도 안 하고 여기 왔다고?"
"네가 문을 열기 전에 다시 전화가 올 거야."
"증거부터 보여 줘."
"컵 아래 사진을 봐."

서연은 봉투를 접었다.
`.trim();

const TALKING_HEAD_DIALOGUE_PROSE = `
민준은 방 불을 끄고 문 앞에 섰다.

"계단 쪽 불은 꺼져 있었어?"
"네가 말한 봉투는 없었어."
"그럼 누가 먼저 올라왔다는 건데?"
"엘리베이터 기록은 비어 있었어."
"기록을 지운 사람이 안에 있겠네."
"아직 확정하면 안 돼."
"서연이 먼저 도착했다면?"
"그럼 우리가 본 문자는 가짜야."

전화 진동이 탁자 위에서 멎었다.
`.trim();

const GROUNDED_DIALOGUE_RUN_PROSE = `
민준은 방 불을 끄고 문 앞에 섰다.

"계단 쪽 불은 꺼져 있었어?"
서연은 젖은 소매를 비틀어 물을 떨어뜨렸다.
"네가 말한 봉투는 없었어."
"그럼 누가 먼저 올라왔다는 건데?"
민준은 컵 받침 아래의 번호를 손가락으로 가렸다.
"엘리베이터 기록은 비어 있었어."
"기록을 지운 사람이 안에 있겠네."
복도 끝 불빛이 한 번 꺼졌다가 다시 켜졌다.
"아직 확정하면 안 돼."
"서연이 먼저 도착했다면?"
서연은 휴대폰 화면의 시간을 민준 쪽으로 돌렸다.
"그럼 우리가 본 문자는 가짜야."

전화 진동이 탁자 위에서 멎었다.
`.trim();

const ROTE_DIALOGUE_REPLY_PROSE = `
민준은 파일을 탁자 위에 밀어 놓았다.

"네."
"그래."
"알겠어."
"맞아."
"그렇지."
"좋아."

서연은 컵을 만지지 않았다.
`.trim();

const MECHANICAL_DIALOGUE_TAG_PROSE = `
민준은 문 앞을 막아섰다.

"지금 문을 열면 그 사람이 네 이름을 부를 거야." 민준이 말했다.
"그 사람이 내 이름을 어떻게 알아?" 서연이 물었다.
"어제 네가 버린 봉투를 주웠으니까." 민준이 대답했다.
"그럼 네가 먼저 말했어야지." 서연이 말했다.
"말하면 네가 바로 나갔을 테니까." 민준이 말했다.
"그 판단까지 네가 대신하지 마." 서연이 대답했다.

문틈 아래로 젖은 종이 냄새가 밀려왔다.
`.trim();

const SILENCE_STALL_PROSE = `
민준은 봉투를 탁자 한가운데 밀어 놓았다.
서연은 아무 말도 하지 않았고, 접힌 모서리만 오래 눌렀다.
민준은 대답하지 않은 채 컵 받침을 조금 돌렸다.
서연은 입을 열지 않았고 복도 쪽 발소리만 세었다.
침묵이 이어졌지만 누구도 봉투를 집어 들지 않았다.
창밖의 빗물이 난간을 두드렸다.
`.trim();

const MELODRAMATIC_CAPTION_PROSE = `
서연은 봉투를 탁자 위에 내려놓았다.
민준은 믿을 수 없다는 얼굴로 접힌 모서리만 바라보았다.
이건 말도 안 되는 일이라는 문장이 머릿속에서만 돌았다.
모든 것이 무너진 것 같았지만 그는 아무것도 묻지 않았다.
세상이 멈춘 듯했고 컵 받침의 물자국만 커졌다.
끝났다는 생각이 들자 그는 의자 등받이를 조금 밀었다.
문밖의 발소리는 가까워졌다.
`.trim();

const STOCK_REACTION_BEAT_PROSE = `
서연은 숨을 삼켰다.
민준은 입술을 깨물었다.
서연은 시선을 피했다.
민준은 고개를 숙였다.
서연의 손이 떨렸다.
민준은 주먹을 쥐었다.
`.trim();

const FACIAL_EXPRESSION_CRUTCH_PROSE = `
서연의 얼굴이 굳었다.
민준의 표정이 일그러졌다.
서연은 미간을 찌푸렸다.
민준의 입꼬리가 내려갔다.
서연의 낯빛이 창백해졌다.
민준은 표정을 감추었다.
`.trim();

const GROUNDED_FACIAL_EXPRESSION_PROSE = `
서연의 얼굴이 잠깐 굳었다.
그녀는 컵 아래 숨겨 둔 사진을 꺼내 민준 앞에 밀었다.
민준은 웃지 않고 사진 뒷면의 번호를 휴대폰 기록과 맞췄다.
번호가 일치하자 그는 문 앞으로 의자를 끌어다 놓고 녹음기를 켰다.
`.trim();

const PROP_FIDGET_LOOP_PROSE = `
서연은 컵을 만졌다.
민준은 봉투를 접었다.
서연은 휴대폰을 만졌다.
민준은 펜을 굴렸다.
서연은 열쇠를 쥐었다.
민준은 카드를 문질렀다.
`.trim();

const GROUNDED_PROP_ACTION_PROSE = `
서연은 봉투를 집었다.
봉투 안쪽에서 피가 번진 사진 한 장이 떨어졌다.
민준은 사진 뒷면의 번호를 휴대폰 기록과 맞췄다.
번호가 일치하자 그는 녹음기를 켜고 문 앞을 막았다.
`.trim();

const GAZE_CHOREOGRAPHY_PROSE = `
서연은 민준을 바라보았다.
민준은 시선을 피했다.
서연의 눈길이 빈 컵 위에 머물렀다.
민준은 고개를 돌렸다.
서연은 다시 눈을 깜빡였다.
민준의 눈빛이 흔들렸다.
두 사람은 서로를 바라보기만 했다.
`.trim();

const GROUNDED_GAZE_PROSE = `
서연은 컵 받침 아래의 사건 번호를 내려다보았다.
민준의 시선이 같은 번호에서 멈추자, 그는 녹음기를 끄고 문 앞으로 의자를 밀었다.
서연은 화면의 계정명을 확인하고 봉투를 민준 쪽으로 밀었다.
그 선택 때문에 복도 안쪽의 잠금장치가 한 번 더 돌아갔다.
`.trim();

const EMOTION_LABEL_CAROUSEL_PROSE = `
서연은 불안했다.
민준은 후회했다.
서연은 당황했다.
민준은 분노했다.
두 사람은 절망했다.
방 안의 공기는 어색했고 누구도 선택을 바꾸지 않았다.
`.trim();

const GROUNDED_EMOTION_TURN_PROSE = `
서연은 불안했다.
그래서 봉투를 접는 대신 민준 앞에 펼쳐 놓았다.
민준은 후회했다.
그는 신고 기록을 지운 이름을 가리지 않고 화면째 내밀었다.
서연은 당황했다.
하지만 문밖의 발소리가 멎기 전에 잠금장치를 먼저 걸었다.
`.trim();

const SENSORY_WALLPAPER_PROSE = `
차가운 빛이 복도 바닥에 번졌다.
비릿한 냄새가 창문 근처에 머물렀다.
축축한 바람이 피부를 스쳤다.
희미한 그림자가 벽에 흔들렸다.
귓가에는 낮은 울림만 남았다.
서연은 아무것도 선택하지 않았다.
`.trim();

const GROUNDED_SENSORY_TURN_PROSE = `
차가운 빛이 화면의 새 번호를 드러냈다.
그래서 서연은 봉투를 찢었다.
비릿한 냄새가 문틈에서 새어 나오자 민준은 문을 막았다.
축축한 바람이 꺼진 알림음을 덮었지만, 서연은 발신자를 확인했다.
`.trim();

const BODY_REACTION_SUBJECT_PROSE = `
심장이 빠르게 뛰었다.
숨이 목 안에서 막혔다.
목구멍이 바싹 말랐다.
손끝이 저릿하게 굳었다.
가슴이 차갑게 내려앉았다.
`.trim();

const CLICHE_EMOTION_IMAGE_PROSE = `
눈물이 뺨을 타고 흘렀다.
시간은 멈춘 듯했다.
세상이 무너진 듯했다.
머릿속이 하얘졌다.
칼날처럼 날카로운 침묵이 두 사람 사이에 내려앉았다.
모든 것이 끝났다.
`.trim();

const SYMBOLIC_ABSTRACTION_STACK_PROSE = `
운명은 진실과 기억의 의미 위에 검은 그림자를 남겼다.
상실과 구원은 침묵의 심연 속에서 서로를 부르고 있었다.
죄책감과 희망은 공허한 관계의 균열을 따라 비극처럼 번졌다.
선택과 대가는 끝없는 상징의 어둠으로 가라앉았다.
`.trim();

const EMBODIED_REACTION_WITH_AGENCY_PROSE = `
서연은 책상 모서리를 잡고 봉투의 접힌 부분을 폈다.
숨을 고르려던 순간 목 안쪽이 잠깐 막혔지만, 그녀는 주소 아래 날짜에 동그라미를 쳤다.
민준의 질문이 끝나기 전에 서연은 녹음기를 끄고 의자 하나를 문 앞으로 밀었다.
젖은 종이에서 번진 잉크가 손끝에 묻자, 그녀는 대답 대신 사진 한 장을 뒤집었다.
`.trim();

const GROUNDED_SYMBOLIC_PROSE = `
서연은 봉투 안쪽에서 찢긴 사진을 꺼냈다.
사진 뒷면의 사건 번호가 휴대폰 화면의 알림 번호와 겹치자, 오래된 상실은 새 단서가 됐다.
그는 열쇠를 손바닥에 눌러 쥐고 신고 버튼 대신 서버실 문을 열었다.
그 선택의 대가는 복도 끝 카메라가 꺼지는 소리로 돌아왔다.
`.trim();

const SPECIFIC_EMOTION_IMAGE_PROSE = `
서연은 봉투 가장자리에 묻은 파란 잉크를 엄지로 문질렀다.
민준이 대답을 미루자 그녀는 날짜 아래 접힌 선을 다시 눌렀다.
컵 받침의 물자국이 주소 끝을 번졌고, 서연은 그 부분만 찢어 주머니에 넣었다.
문밖에서 발소리가 멎자 그녀는 남은 종이를 민준 앞으로 밀었다.
`.trim();

const UNIFORM_SENTENCE_LENGTH_PROSE = `
서연은 낡은 지도를 접어 탁자 가장자리에 조심스럽게 올려두었다.
민준은 꺼진 녹음기를 확인하고 손바닥으로 먼지를 한 번 밀어냈다.
도현은 창가의 가방을 열어 젖은 사진 네 장을 차례로 펼쳤다.
혜린은 벽시계 아래에 붙은 주소를 노트 첫 줄에 그대로 옮겼다.
서연은 붉은 표시 옆에 남은 숫자를 펜끝으로 천천히 눌렀다.
민준은 복도 쪽 발소리를 듣고도 의자 등받이를 다시 세웠다.
도현은 마지막 사진을 뒤집어 봉투 안쪽의 얼룩과 나란히 맞췄다.
혜린은 열린 문틈을 바라보다가 지도 위의 세 번째 원을 가렸다.
`.trim();

const VARIED_SENTENCE_LENGTH_PROSE = `
서연은 지도를 접었다.
민준이 꺼진 녹음기를 열어 배터리 칸 안쪽의 붉은 실금을 보여 주자, 방 안의 시선이 한꺼번에 그 작은 균열로 모였다.
도현은 사진을 뒤집었다.
봉투 안쪽에 묻은 얼룩은 지도 위 세 번째 원과 같은 모양이었고, 혜린은 그제야 노트 첫 줄의 주소를 지웠다.
문밖 발소리가 멎었다.
서연은 아무 설명도 붙이지 않고 남은 종이를 반으로 찢어 민준의 빈 컵 아래에 눌러 두었다.
`.trim();

const SAME_ENDING_PROSE = `
서연이 접은 봉투를 컵 아래에 밀어놓았다.
오래된 녹음기 옆으로 젖은 사진을 하나 더 내려놓았다.
민준이 지운 주소 위에 붉은 선을 천천히 그어놓았다.
창가의 가방 안에는 번호가 다른 열쇠를 숨겨놓았다.
도현이 마지막 통화 시간을 노트 여백에 적어놓았다.
`.trim();

const FOUR_SAME_ENDING_PROSE = `
서연이 접은 봉투를 컵 아래에 밀어놓았다.
오래된 녹음기 옆으로 젖은 사진을 하나 더 내려놓았다.
민준이 지운 주소 위에 붉은 선을 천천히 그어놓았다.
창가의 가방 안에는 번호가 다른 열쇠를 숨겨놓았다.
`.trim();

const DOMINANT_ENDING_CADENCE_PROSE = `
서연은 봉투의 접힌 선을 다시 눌러 접었다.
민준은 녹음기 옆에 흘린 잉크를 손끝에 묻었다.
도현은 녹음기 안쪽의 번호를 확인했다.
혜린은 젖은 사진을 봉투 아래에 넣었다.
서연은 지도 가장자리의 얼룩을 손바닥으로 덮었다.
민준의 손목시계 초침은 문 앞에서 멈춘다.
도현은 컵 받침 밑의 열쇠를 조용히 들었다.
혜린은 복도 쪽으로 새어 나오는 빛을 가방으로 막았다.
`.trim();

const DIALOGUE_ENDING_CADENCE_PROSE = `
민준은 녹음기를 끄고 봉투를 탁자 중앙에 밀었다.
"그 번호는 오늘 밤 또 바뀔 거야."
서연은 봉투 가장자리에 묻은 잉크를 엄지로 문질렀다.
"경비 기록도 곧 사라질 거야."
복도 끝 센서등이 한 번 켜졌다가 꺼졌다.
"네가 문을 열면 그쪽이 먼저 알 거야."
민준은 컵 받침 아래의 사진을 반쯤 빼냈다.
"그래도 나는 서버실로 갈 거야."
서연은 사진 뒷면의 시간을 보고 잠금장치를 걸었다.
"그 사람은 여기로 다시 올 거야."
문밖의 발소리가 계단 아래에서 멎었다.
"대신 넌 여기서 시간을 벌어."
`.trim();

const DIALOGUE_STARTER_CADENCE_PROSE = `
민준은 녹음기를 끄고 봉투를 탁자 중앙에 밀었다.
"아니, 그 번호는 오늘 밤 다시 바뀌어."
서연은 봉투 가장자리에 묻은 잉크를 엄지로 문질렀다.
"아니, 경비 기록부터 확인해야 해."
복도 끝 센서등이 한 번 켜졌다가 꺼졌다.
"아니, 문을 열면 그쪽이 먼저 알아."
민준은 컵 받침 아래의 사진을 반쯤 빼냈다.
"그래도 서버실 열쇠는 여기 있어."
서연은 사진 뒷면의 시간을 보고 잠금장치를 걸었다.
"아니, 그 사람은 엘리베이터로 올라오지 않았어."
문밖의 발소리가 계단 아래에서 멎었다.
"대신 넌 여기서 시간을 벌어."
`.trim();

const DIALOGUE_QUESTION_CASCADE_PROSE = `
민준은 녹음기를 끄고 봉투를 탁자 중앙에 밀었다.
"네가 먼저 문자를 받았어?"
서연은 봉투 가장자리에 묻은 잉크를 엄지로 문질렀다.
"그걸 왜 지금 말해?"
복도 끝 센서등이 한 번 켜졌다가 꺼졌다.
"그럼 봉투는 누가 놓고 갔어?"
민준은 컵 받침 아래의 사진을 반쯤 빼냈다.
"엘리베이터 기록은 확인했어?"
서연은 사진 뒷면의 시간을 보고 잠금장치를 걸었다.
"그 사람이 아직 위층에 있어?"
문밖의 발소리가 계단 아래에서 멎었다.
"대신 넌 여기서 시간을 벌어."
`.trim();

const DIALOGUE_VOCATIVE_CADENCE_PROSE = `
민준은 녹음기를 끄고 봉투를 탁자 중앙에 밀었다.
"서연아, 그 봉투는 네가 먼저 봤지."
서연은 봉투 가장자리에 묻은 잉크를 엄지로 문질렀다.
"민준 씨, 지금 이름 부를 때가 아니에요."
복도 끝 센서등이 한 번 켜졌다가 꺼졌다.
"서연아, 경비 기록부터 확인해."
민준은 컵 받침 아래의 사진을 반쯤 빼냈다.
"민준 씨, 문밖에 누가 있어요."
서연은 사진 뒷면의 시간을 보고 잠금장치를 걸었다.
"서연아, 그 사진을 컵 아래에 숨겨."
문밖의 발소리가 계단 아래에서 멎었다.
"대신 넌 여기서 시간을 벌어."
`.trim();

const DIALOGUE_LEXICAL_ECHO_PROSE = `
민준은 녹음기를 끄고 탁자 중앙에 종이를 밀었다.
"봉투 안쪽의 얼룩부터 봐."
서연은 종이 가장자리에 묻은 잉크를 엄지로 문질렀다.
"그 봉투 때문에 문이 잠겼어."
복도 끝 센서등이 한 번 켜졌다가 꺼졌다.
"봉투를 들고 나가면 경비가 움직여."
민준은 컵 받침 아래의 사진을 반쯤 빼냈다.
"봉투는 네 손에 있던 게 아니었어."
서연은 사진 뒷면의 시간을 보고 잠금장치를 걸었다.
"봉투를 찢으면 번호가 사라져."
문밖의 발소리가 계단 아래에서 멎었다.
"대신 넌 여기서 시간을 벌어."
`.trim();

const DIALOGUE_PARAPHRASE_CONFIRMATION_PROSE = `
민준은 녹음기를 끄고 탁자 중앙에 종이를 밀었다.
"그러니까 네 말은 알림이 피해자보다 먼저 왔다는 거야."
서연은 화면 밝기를 낮추고 시간 표시를 가렸다.
"즉, 경비 로그가 조작됐다는 뜻이네."
복도 끝 센서등이 한 번 켜졌다가 꺼졌다.
"다시 말해서 신고 시간은 가짜라는 거지."
민준은 컵 받침 아래의 출입 카드를 반쯤 빼냈다.
"결국 서버실 안에 내부자가 있었다는 말이야."
서연은 카드 뒷면의 흠집을 보고 잠금장치를 걸었다.
"그 말은 네가 처음부터 알고 있었다는 거네."
문밖의 발소리가 계단 아래에서 멎었다.
"대신 지금은 카드를 먼저 빼."
`.trim();

const VAGUE_ATMOSPHERE_PROSE = `
복도에는 묘한 공기가 감돌았다.
서연은 알 수 없는 감각을 느꼈다.
민준의 침묵은 무거운 기분을 남겼다.
두 사람 사이에는 낯선 긴장이 흘렀다.
문틈의 어둠은 불길한 예감처럼 가라앉았다.
아무도 무엇이 달라졌는지 말하지 않았다.
`.trim();

const EVALUATIVE_MODIFIER_STACK_PROSE = `
복도는 차갑고 서늘하고 낯설었다.
민준의 목소리는 거칠고 불길하고 위태로웠다.
서연의 침묵은 무겁고 공허하고 이상했다.
문틈의 어둠은 깊고 선명하고 위험했다.
손잡이는 싸늘하고 낯설고 불편했다.
누가 무엇을 바꿨는지는 보이지 않았다.
`.trim();

const FILLER_ADVERB_PROSE = `
서연은 천천히 문 앞에 섰다.
민준은 조용히 컵을 내려놓았다.
서연은 가만히 봉투를 바라보았다.
민준은 살짝 고개를 돌렸다.
서연은 잠시 대답을 미뤘다.
민준은 그대로 손잡이를 잡고 있었다.
결국 아무 선택도 장면을 바꾸지 않았다.
`.trim();

const SIMULTANEOUS_ACTION_PROSE = `
서연은 문손잡이를 움켜쥐며 복도 안쪽을 살폈다.
민준은 컵 받침을 밀면서 봉투의 붉은 선을 가렸다.
도현은 휴대폰 화면을 켜 놓은 채 계단 아래를 내려다보았다.
서연은 숨을 고르며 손등에 묻은 잉크를 닦았다.
민준은 녹음기를 끄면서 파일 이름을 확인했다.
도현은 난간에 몸을 붙인 채 닫힌 문틈을 세었다.
`.trim();

const CONTROLLED_SIMULTANEOUS_ACTION_PROSE = `
서연은 문손잡이를 움켜쥐며 복도 안쪽을 살폈다.
안쪽에서 유리컵이 밀리는 소리가 났다.
민준은 봉투를 펼쳤고, 붉은 선 아래의 날짜를 손끝으로 가렸다.
그 순간 계단 아래 센서등이 켜졌다.
서연은 휴대폰 화면을 민준 쪽으로 돌렸다.
`.trim();

const STATUS_QUO_ACTION_PROSE = `
서연은 문 앞에 멈춰 섰다.
민준은 컵을 내려놓았다.
서연은 봉투를 만졌다.
민준은 고개를 돌렸다.
서연은 복도 끝을 바라보았다.
민준은 손잡이를 잡았다.
서연은 대답을 기다렸다.
빗소리만 창문을 두드렸다.
`.trim();

const TOPIC_MARKER_CADENCE_PROSE = `
서연은 낡은 수첩을 펼쳐 접힌 페이지의 얼룩을 손끝으로 눌렀다.
민준은 붉은 줄 아래 적힌 날짜를 읽고 녹음기의 버튼을 한 번 눌렀다.
도현은 창가에 세워 둔 가방에서 현장 사진 네 장을 꺼냈다.
혜린은 탁자 위 지도를 밀어 세 번째 주소가 보이도록 돌렸다.
서연은 마지막 좌표에 손톱을 세우고 화면의 알림 시간을 확인했다.
민준은 입구 쪽 그림자를 확인한 뒤 아무도 앉지 않은 의자를 가리켰다.
`.trim();

const VARIED_TOPIC_CADENCE_PROSE = `
낡은 수첩을 펼치자 접힌 페이지의 얼룩이 손끝 아래서 번졌다.
붉은 줄 아래 적힌 날짜를 읽은 민준은 녹음기의 버튼을 한 번 눌렀다.
창가에 세워 둔 가방에서는 현장 사진 네 장이 차례로 나왔다.
탁자 위 지도가 돌아가며 세 번째 주소를 드러냈다.
마지막 좌표에 손톱을 세운 서연은 화면의 알림 시간을 확인했다.
입구 쪽 그림자를 확인한 뒤에야 민준은 아무도 앉지 않은 의자를 가리켰다.
`.trim();

const RHETORICAL_QUESTION_PROSE = `
왜 하필 지금일까?
서연은 어떻게 해야 할까?
문 너머의 남자는 정말 민준일까?
지금 나가면 모든 게 끝나는 걸까?
그렇다면 도망쳐야 할까?
아무도 손잡이를 잡지 않았다.
`.trim();

const SUBTEXT_OVEREXPLAINED_PROSE = `
민준은 컵을 내려놓았다.
그 침묵은 거절이라는 뜻이었다.
서연의 시선은 아직 믿지 못하겠다는 의미였다.
민준의 짧은 웃음은 더는 설명하지 않겠다는 경고였다.
문 앞에 멈춘 발은 도망치고 싶다는 마음을 보여 주었다.
아무도 손잡이를 잡지 않았다.
`.trim();

const AMBIGUOUS_REFERENCE_PROSE = `
민준은 서연에게 봉투를 내밀었다. 도현은 문 앞에서 휴대폰을 들고 있었다.
그는 그것을 바라보았다.
그녀는 그 말을 믿지 않았다.
그는 그에게 그것을 넘겼다.
그것은 그 사실을 더 흐리게 만들었다.
그는 다시 그녀를 보았다.
서연은 봉투를 접었다.
`.trim();

const ABRUPT_SCENE_TRANSITION_PROSE = `
서연은 지하보도 입구에서 봉투를 놓쳤다. 알림음은 한 번만 울렸고, 화면에는 모르는 이름이 떠 있었다.

***

민준은 병원 복도에서 눈을 떴다. 흰 조명은 천장에 붙어 있었고 간호사는 대답하지 않았다.

***

도현은 폐공장 사무실에 앉아 있었다. 책상 위 지도에는 붉은 원이 세 개 그려져 있었다.

***

서연은 새벽 강변에 서 있었다. 휴대폰 배터리는 이미 꺼져 있었고 주변에는 아무도 없었다.
`.trim();

const GROUNDED_SCENE_TRANSITION_PROSE = `
서연은 지하보도 입구에서 봉투를 놓쳤다. 알림음은 한 번만 울렸고, 화면에는 모르는 이름이 떠 있었다.

***

같은 시각, 민준은 병원 복도에서 눈을 떴다. 흰 조명은 천장에 붙어 있었고 간호사는 대답하지 않았다.

***

몇 시간 뒤 도현은 폐공장 사무실에 앉아 있었다. 책상 위 지도에는 붉은 원이 세 개 그려져 있었다.

***

그 알림 때문에 서연은 새벽 강변까지 돌아왔다. 휴대폰 배터리는 이미 꺼져 있었고 주변에는 아무도 없었다.
`.trim();

describe('evaluateProseTaste', () => {
  it('passes clean prose that has controlled texture and no design jargon', () => {
    const result = evaluateProseTaste(CLEAN_PROSE);

    expect(result.passed).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(88);
    expect(result.issues).toHaveLength(0);
  });

  it('fails prose with functional report phrasing and leaked design jargon', () => {
    const result = evaluateProseTaste(IRRITATING_AI_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(88);
    expect(codes).toContain('functional-ai-report');
    expect(codes).toContain('design-jargon-in-prose');
  });

  it('fails prose with a monotone run of short narration sentences', () => {
    const result = evaluateProseTaste(CHOPPY_AI_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(88);
    expect(result.metrics.longestShortSentenceRun).toBeGreaterThan(5);
    expect(codes).toContain('monotone-short-sentence-run');
  });

  it('localizes rhythm failures to a revision target sentence', () => {
    const result = evaluateProseTaste(CHOPPY_AI_PROSE);
    const issue = result.issues.find(item => item.code === 'monotone-short-sentence-run');

    expect(issue).toBeDefined();
    expect(issue?.position).toBe(0);
    expect(issue?.lineNumber).toBe(1);
    expect(issue?.paragraphNumber).toBe(1);
    expect(issue?.sentenceNumber).toBe(1);
    expect(issue?.targetText).toContain('도현은 골목에 섰다.');
    expect(issue?.localizationConfidence).toBe('evidence');
  });

  it('allows faster webnovel prose to tune the short sentence run threshold', () => {
    const result = evaluateProseTaste(CHOPPY_AI_PROSE, {
      profile: {
        preferredMode: 'webnovel-fast',
        maxShortSentenceRun: 8,
      },
    });

    expect(result.issues.map(issue => issue.code)).not.toContain('monotone-short-sentence-run');
  });

  it('fails prose that leans on hedged perception instead of concrete scene judgment', () => {
    const result = evaluateProseTaste(HEDGED_PERCEPTION_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(88);
    expect(result.metrics.hedgedPerceptionDensityPer1000).toBeGreaterThan(6);
    expect(codes).toContain('hedged-perception-haze');
  });

  it('allows projects to loosen hedged perception density for a more uncertain voice', () => {
    const result = evaluateProseTaste(HEDGED_PERCEPTION_PROSE, {
      profile: {
        preferredMode: 'lyrical',
        maxHedgedPerceptionDensityPer1000: 30,
      },
    });

    expect(result.issues.map(issue => issue.code)).not.toContain('hedged-perception-haze');
  });

  it('fails prose that relies on abstract exposition, cognitive filters, and repeated subject rhythm', () => {
    const result = evaluateProseTaste(ABSTRACT_FILTERED_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(88);
    expect(result.metrics.abstractNounDensityPer1000).toBeGreaterThan(12);
    expect(result.metrics.cognitiveFilterDensityPer1000).toBeGreaterThan(6);
    expect(result.metrics.longestRepeatedSubjectRun).toBeGreaterThan(4);
    expect(codes).toEqual(expect.arrayContaining([
      'abstract-exposition-drift',
      'cognitive-filtering-overload',
      'repeated-subject-rhythm',
    ]));
  });

  it('allows projects to loosen repeated subject rhythm for intentionally patterned prose', () => {
    const result = evaluateProseTaste(ABSTRACT_FILTERED_PROSE, {
      profile: {
        maxRepeatedSubjectRun: 12,
      },
    });

    expect(result.issues.map(issue => issue.code)).not.toContain('repeated-subject-rhythm');
  });

  it('flags comma rhythm overload as a separate Korean prose friction metric', () => {
    const result = evaluateProseTaste(COMMA_OVERLOAD_PROSE, {
      threshold: 95,
      profile: {
        maxCommaDensityPer1000: 8,
      },
    });

    expect(result.passed).toBe(false);
    expect(result.metrics.commaDensityPer1000).toBeGreaterThan(8);
    expect(result.issues.map(issue => issue.code)).toContain('comma-rhythm-overload');
  });

  it('fails prose that repeats nominalized explanations and translationese formulas', () => {
    const result = evaluateProseTaste(NOMINALIZED_TRANSLATIONESE_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(88);
    expect(result.metrics.nominalizedExplanationDensityPer1000).toBeGreaterThan(7);
    expect(result.metrics.translationeseFormulaDensityPer1000).toBeGreaterThan(4);
    expect(codes).toEqual(expect.arrayContaining([
      'nominalized-explanation-chain',
      'translationese-formula-drift',
    ]));
  });

  it('allows projects to loosen nominalized explanation density when the voice intentionally uses it', () => {
    const result = evaluateProseTaste(NOMINALIZED_TRANSLATIONESE_PROSE, {
      threshold: 70,
      profile: {
        maxNominalizedExplanationDensityPer1000: 40,
        maxTranslationeseFormulaDensityPer1000: 40,
      },
    });

    expect(result.issues.map(issue => issue.code)).not.toContain('nominalized-explanation-chain');
    expect(result.issues.map(issue => issue.code)).not.toContain('translationese-formula-drift');
  });

  it('fails prose that leans on repeated connective starters as paragraph glue', () => {
    const result = evaluateProseTaste(CONNECTIVE_CRUTCH_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.connectiveStarterDensityPer1000).toBeGreaterThan(6);
    expect(result.metrics.longestRepeatedConnectiveStarterRun).toBeGreaterThan(3);
    expect(codes).toContain('connective-crutch-rhythm');
  });

  it('fails prose that turns character interiority into therapy-speak self-analysis', () => {
    const result = evaluateProseTaste(THERAPY_SPEAK_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.therapySpeakDensityPer1000).toBeGreaterThanOrEqual(4);
    expect(result.metrics.longestTherapySpeakRun).toBeGreaterThan(2);
    expect(codes).toContain('therapy-speak-self-analysis');
  });

  it('allows a single psychological term when interiority is grounded in action and evidence', () => {
    const result = evaluateProseTaste(GROUNDED_INNER_WOUND_PROSE, { threshold: 70 });

    expect(result.metrics.longestTherapySpeakRun).toBeLessThanOrEqual(1);
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'therapy-speak-self-analysis'
    );
  });

  it('allows projects to loosen therapy-speak self-analysis for deliberately clinical narration', () => {
    const result = evaluateProseTaste(THERAPY_SPEAK_PROSE, {
      profile: {
        maxTherapySpeakDensityPer1000: 80,
        maxTherapySpeakRun: 6,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'therapy-speak-self-analysis'
    );
  });

  it('fails prose that reports scene conclusions with repeated tail summaries', () => {
    const result = evaluateProseTaste(REPORTING_TAIL_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.reportingTailDensityPer1000).toBeGreaterThan(4);
    expect(codes).toContain('reporting-tail-summary');
  });

  it('fails prose that resolves decisive story turns offscreen in summary', () => {
    const result = evaluateProseTaste(OFFSCREEN_RESOLUTION_SUMMARY_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(codes).toContain('offscreen-resolution-summary');
  });

  it('does not flag on-page reveal scenes as offscreen resolution summaries', () => {
    const result = evaluateProseTaste(ONPAGE_RESOLUTION_SCENE_PROSE, { threshold: 70 });

    expect(result.issues.map(issue => issue.code)).not.toContain(
      'offscreen-resolution-summary'
    );
  });

  it('fails generic omniscient teaser lines that announce fate instead of staging evidence', () => {
    const result = evaluateProseTaste(GENERIC_TEASER_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.genericTeaserDensityPer1000).toBeGreaterThan(2);
    expect(codes).toContain('generic-omniscient-teaser');
  });

  it('allows projects to loosen generic teaser density for an intentionally serial narrator voice', () => {
    const result = evaluateProseTaste(GENERIC_TEASER_PROSE, {
      threshold: 70,
      profile: {
        maxGenericTeaserDensityPer1000: 50,
      },
    });

    expect(result.issues.map(issue => issue.code)).not.toContain('generic-omniscient-teaser');
  });

  it('fails chapter endings that tease suspense without concrete story change', () => {
    const result = evaluateProseTaste(THIN_CLIFFHANGER_ENDING_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.thinCliffhangerEndingCount).toBe(1);
    expect(result.metrics.endingCliffhangerSignalCount).toBeGreaterThanOrEqual(2);
    expect(result.metrics.endingConcreteTriggerCount).toBe(0);
    expect(codes).toContain('thin-cliffhanger-ending');
  });

  it('allows concrete cliffhanger endings anchored to a visible trigger', () => {
    const result = evaluateProseTaste(CONCRETE_CLIFFHANGER_ENDING_PROSE, {
      threshold: 70,
    });

    expect(result.metrics.thinCliffhangerEndingCount).toBe(0);
    expect(result.metrics.endingConcreteTriggerCount).toBeGreaterThan(0);
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'thin-cliffhanger-ending'
    );
  });

  it('allows projects to loosen thin cliffhanger ending limits for experimental endings', () => {
    const result = evaluateProseTaste(THIN_CLIFFHANGER_ENDING_PROSE, {
      profile: {
        maxThinCliffhangerEndingCount: 1,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'thin-cliffhanger-ending'
    );
  });

  it('allows projects to loosen reporting tail density for deliberately report-like prose', () => {
    const result = evaluateProseTaste(REPORTING_TAIL_PROSE, {
      threshold: 70,
      profile: {
        maxReportingTailDensityPer1000: 80,
      },
    });

    expect(result.issues.map(issue => issue.code)).not.toContain('reporting-tail-summary');
  });

  it('fails static inventory description that lacks a viewpoint anchor', () => {
    const result = evaluateProseTaste(DETACHED_CAMERA_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.staticDescriptionDensityPer1000).toBeGreaterThan(10);
    expect(result.metrics.viewpointAnchorDensityPer1000).toBeLessThan(2.5);
    expect(codes).toContain('detached-camera-description');
  });

  it('allows projects to tune detached camera description thresholds', () => {
    const result = evaluateProseTaste(DETACHED_CAMERA_PROSE, {
      profile: {
        maxStaticDescriptionDensityPer1000: 80,
        minViewpointAnchorDensityPer1000: 0,
      },
    });

    expect(result.issues.map(issue => issue.code)).not.toContain('detached-camera-description');
  });

  it('fails prose that opens multiple characters private thoughts inside the same paragraph', () => {
    const result = evaluateProseTaste(POV_MIND_HOP_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.povMindJumpParagraphCount).toBe(3);
    expect(result.metrics.povMindJumpParagraphDensityPer1000).toBeGreaterThan(1.6);
    expect(result.metrics.longestPovMindJumpRun).toBe(3);
    expect(codes).toContain('pov-mind-hop-chain');
    expect(
      result.issues.find(issue => issue.code === 'pov-mind-hop-chain')?.evidence
    ).toContain('[내면 주체: 서연, 민준]');
  });

  it('allows multiple POV private states when paragraph breaks separate viewpoint access', () => {
    const result = evaluateProseTaste(SEPARATED_POV_MIND_PROSE, { threshold: 70 });

    expect(result.metrics.povMindJumpParagraphCount).toBe(0);
    expect(result.metrics.longestPovMindJumpRun).toBe(0);
    expect(result.issues.map(issue => issue.code)).not.toContain('pov-mind-hop-chain');
  });

  it('allows projects to loosen POV mind-hop limits for deliberate omniscient narration', () => {
    const result = evaluateProseTaste(POV_MIND_HOP_PROSE, {
      profile: {
        maxPovMindJumpDensityPer1000: 100,
        maxPovMindJumpRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('pov-mind-hop-chain');
  });

  it('fails dialogue that dumps story rules instead of staging conflict or subtext', () => {
    const result = evaluateProseTaste(EXPOSITORY_DIALOGUE_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.dialogueCount).toBe(4);
    expect(result.metrics.expositoryDialogueCount).toBe(4);
    expect(result.metrics.expositoryDialogueRatio).toBe(1);
    expect(codes).toContain('expository-dialogue-dump');
  });

  it('allows projects to loosen expository dialogue ratio for deliberately didactic scenes', () => {
    const result = evaluateProseTaste(EXPOSITORY_DIALOGUE_PROSE, {
      profile: {
        maxExpositoryDialogueRatio: 1,
      },
    });

    expect(result.issues.map(issue => issue.code)).not.toContain('expository-dialogue-dump');
  });

  it('fails dialogue that turns a scene into one long monologue dump', () => {
    const result = evaluateProseTaste(MONOLOGUE_DIALOGUE_PROSE, { threshold: 95 });
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.dialogueCount).toBe(1);
    expect(result.metrics.longestDialogueTurnLength).toBeGreaterThan(170);
    expect(result.metrics.averageDialogueTurnLength).toBe(result.metrics.longestDialogueTurnLength);
    expect(codes).toContain('monologue-dialogue-dump');
  });

  it('does not fail dialogue turn length when the same pressure is split into reactive exchanges', () => {
    const result = evaluateProseTaste(SPLIT_DIALOGUE_TURN_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.metrics.dialogueCount).toBe(7);
    expect(result.metrics.longestDialogueTurnLength).toBeLessThanOrEqual(170);
    expect(codes).not.toContain('monologue-dialogue-dump');
  });

  it('allows projects to loosen dialogue turn length for deliberate testimony scenes', () => {
    const result = evaluateProseTaste(MONOLOGUE_DIALOGUE_PROSE, {
      profile: {
        maxDialogueTurnLength: 400,
        maxAverageDialogueTurnLength: 300,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('monologue-dialogue-dump');
  });

  it('fails dialogue that runs as talking heads without grounding beats', () => {
    const result = evaluateProseTaste(TALKING_HEAD_DIALOGUE_PROSE, { threshold: 95 });
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.dialogueCount).toBe(8);
    expect(result.metrics.longestDialogueGroundingGapRun).toBeGreaterThan(6);
    expect(codes).toContain('talking-head-dialogue-run');
  });

  it('does not fail dialogue runs that are regularly grounded in action and setting', () => {
    const result = evaluateProseTaste(GROUNDED_DIALOGUE_RUN_PROSE, { threshold: 70 });
    const codes = result.issues.map(issue => issue.code);

    expect(result.metrics.dialogueCount).toBe(8);
    expect(result.metrics.longestDialogueGroundingGapRun).toBeLessThanOrEqual(3);
    expect(codes).not.toContain('talking-head-dialogue-run');
  });

  it('allows projects to loosen dialogue grounding run limits for fast banter', () => {
    const result = evaluateProseTaste(TALKING_HEAD_DIALOGUE_PROSE, {
      profile: {
        maxDialogueGroundingGapRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('talking-head-dialogue-run');
  });

  it('fails dialogue that chains rote acknowledgements instead of subtext or conflict', () => {
    const result = evaluateProseTaste(ROTE_DIALOGUE_REPLY_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.dialogueCount).toBe(6);
    expect(result.metrics.roteDialogueReplyCount).toBe(6);
    expect(result.metrics.roteDialogueReplyRatio).toBe(1);
    expect(result.metrics.longestRoteDialogueReplyRun).toBe(6);
    expect(codes).toContain('rote-dialogue-response-chain');
  });

  it('allows projects to loosen rote dialogue reply limits for deliberately clipped banter', () => {
    const result = evaluateProseTaste(ROTE_DIALOGUE_REPLY_PROSE, {
      profile: {
        maxRoteDialogueReplyRatio: 1,
        maxRoteDialogueReplyRun: 10,
      },
    });

    expect(result.issues.map(issue => issue.code)).not.toContain('rote-dialogue-response-chain');
  });

  it('fails dialogue that mechanically tags every turn with neutral speech verbs', () => {
    const result = evaluateProseTaste(MECHANICAL_DIALOGUE_TAG_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.dialogueCount).toBe(6);
    expect(result.metrics.neutralDialogueTagCount).toBe(6);
    expect(result.metrics.neutralDialogueTagRatio).toBe(1);
    expect(result.metrics.longestNeutralDialogueTagRun).toBe(6);
    expect(codes).toContain('mechanical-dialogue-tag-chain');
  });

  it('allows projects to loosen neutral dialogue tag limits for intentionally tagged dialogue', () => {
    const result = evaluateProseTaste(MECHANICAL_DIALOGUE_TAG_PROSE, {
      profile: {
        maxNeutralDialogueTagRatio: 1,
        maxNeutralDialogueTagRun: 10,
      },
    });

    expect(result.issues.map(issue => issue.code)).not.toContain('mechanical-dialogue-tag-chain');
  });

  it('fails prose that chains silence or non-answer beats instead of changing the dialogue state', () => {
    const result = evaluateProseTaste(SILENCE_STALL_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.silenceStallDensityPer1000).toBe(4);
    expect(result.metrics.longestSilenceStallRun).toBe(4);
    expect(codes).toContain('dialogue-silence-stall-chain');
  });

  it('allows projects to loosen silence stall limits for deliberately withheld dialogue', () => {
    const result = evaluateProseTaste(SILENCE_STALL_PROSE, {
      profile: {
        maxSilenceStallDensityPer1000: 100,
        maxSilenceStallRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('dialogue-silence-stall-chain');
  });

  it('fails prose that chains melodramatic emotion captions instead of staging consequences', () => {
    const result = evaluateProseTaste(MELODRAMATIC_CAPTION_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.melodramaticCaptionDensityPer1000).toBe(5);
    expect(result.metrics.longestMelodramaticCaptionRun).toBe(5);
    expect(codes).toContain('melodramatic-emotion-caption-chain');
  });

  it('allows projects to loosen melodramatic caption limits for deliberately heightened narration', () => {
    const result = evaluateProseTaste(MELODRAMATIC_CAPTION_PROSE, {
      profile: {
        maxMelodramaticCaptionDensityPer1000: 100,
        maxMelodramaticCaptionRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('melodramatic-emotion-caption-chain');
  });

  it('fails prose that chains stock reaction beats instead of staging choices or consequences', () => {
    const result = evaluateProseTaste(STOCK_REACTION_BEAT_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.stockReactionBeatDensityPer1000).toBe(6);
    expect(result.metrics.longestStockReactionBeatRun).toBe(6);
    expect(codes).toContain('stock-reaction-beat-chain');
  });

  it('allows projects to loosen stock reaction beat limits for intentionally gesture-heavy prose', () => {
    const result = evaluateProseTaste(STOCK_REACTION_BEAT_PROSE, {
      profile: {
        maxStockReactionBeatDensityPer1000: 100,
        maxStockReactionBeatRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('stock-reaction-beat-chain');
  });

  it('fails prose that uses facial expression beats as the main emotional engine', () => {
    const result = evaluateProseTaste(FACIAL_EXPRESSION_CRUTCH_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.facialExpressionBeatDensityPer1000).toBe(6);
    expect(result.metrics.longestFacialExpressionBeatRun).toBe(6);
    expect(codes).toContain('facial-expression-crutch-chain');
  });

  it('allows isolated facial expression beats when action and consequence carry the scene', () => {
    const result = evaluateProseTaste(GROUNDED_FACIAL_EXPRESSION_PROSE);

    expect(result.issues.map(issue => issue.code)).not.toContain(
      'facial-expression-crutch-chain'
    );
  });

  it('allows projects to loosen facial expression beat limits for expression-heavy narration', () => {
    const result = evaluateProseTaste(FACIAL_EXPRESSION_CRUTCH_PROSE, {
      profile: {
        maxFacialExpressionBeatDensityPer1000: 100,
        maxFacialExpressionBeatRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'facial-expression-crutch-chain'
    );
  });

  it('fails prose that chains prop fidget beats instead of staging clues or consequences', () => {
    const result = evaluateProseTaste(PROP_FIDGET_LOOP_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.propFidgetBeatDensityPer1000).toBe(6);
    expect(result.metrics.longestPropFidgetBeatRun).toBe(6);
    expect(codes).toContain('prop-fidget-loop');
  });

  it('allows prop actions when the object changes evidence or scene state', () => {
    const result = evaluateProseTaste(GROUNDED_PROP_ACTION_PROSE, {
      threshold: 70,
    });

    expect(result.metrics.longestPropFidgetBeatRun).toBeLessThanOrEqual(1);
    expect(result.issues.map(issue => issue.code)).not.toContain('prop-fidget-loop');
  });

  it('allows projects to loosen prop fidget limits for object-heavy staging', () => {
    const result = evaluateProseTaste(PROP_FIDGET_LOOP_PROSE, {
      profile: {
        maxPropFidgetBeatDensityPer1000: 100,
        maxPropFidgetBeatRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('prop-fidget-loop');
  });

  it('fails prose that pauses the present scene with a backstory info dump', () => {
    const result = evaluateProseTaste(BACKSTORY_INFO_DUMP_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.backstoryExpositionDensityPer1000).toBe(6);
    expect(result.metrics.longestBackstoryExpositionRun).toBe(6);
    expect(codes).toContain('backstory-info-dump-block');
  });

  it('allows brief backstory when a current clue immediately drives action', () => {
    const result = evaluateProseTaste(GROUNDED_BACKSTORY_TRIGGER_PROSE, {
      threshold: 70,
    });

    expect(result.metrics.longestBackstoryExpositionRun).toBeLessThanOrEqual(1);
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'backstory-info-dump-block'
    );
  });

  it('allows projects to loosen backstory exposition limits for framed flashbacks', () => {
    const result = evaluateProseTaste(BACKSTORY_INFO_DUMP_PROSE, {
      profile: {
        maxBackstoryExpositionDensityPer1000: 100,
        maxBackstoryExpositionRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'backstory-info-dump-block'
    );
  });

  it('fails prose that summarizes relationship development as montage', () => {
    const result = evaluateProseTaste(RELATIONSHIP_MONTAGE_SUMMARY_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.relationshipMontageSummaryDensityPer1000).toBe(6);
    expect(result.metrics.longestRelationshipMontageSummaryRun).toBe(6);
    expect(codes).toContain('relationship-montage-summary');
  });

  it('allows time skips when relationship turns are grounded in choices and evidence', () => {
    const result = evaluateProseTaste(GROUNDED_RELATIONSHIP_TURN_PROSE, {
      threshold: 70,
    });

    expect(result.metrics.longestRelationshipMontageSummaryRun).toBe(0);
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'relationship-montage-summary'
    );
  });

  it('allows projects to loosen relationship montage limits for deliberate summary passages', () => {
    const result = evaluateProseTaste(RELATIONSHIP_MONTAGE_SUMMARY_PROSE, {
      profile: {
        maxRelationshipMontageSummaryDensityPer1000: 100,
        maxRelationshipMontageSummaryRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'relationship-montage-summary'
    );
  });

  it('fails prose that skips preparation and status change through summary chains', () => {
    const result = evaluateProseTaste(TIME_SKIP_SUMMARY_CHAIN_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.timeSkipSummaryDensityPer1000).toBeGreaterThanOrEqual(5);
    expect(result.metrics.longestTimeSkipSummaryRun).toBeGreaterThan(2);
    expect(codes).toContain('time-skip-summary-chain');
  });

  it('allows time skips when the skipped interval lands on evidence, cost, and changed action', () => {
    const result = evaluateProseTaste(GROUNDED_TIME_SKIP_PROSE, {
      threshold: 70,
    });

    expect(result.metrics.longestTimeSkipSummaryRun).toBe(0);
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'time-skip-summary-chain'
    );
  });

  it('allows projects to loosen time skip summary limits for deliberate compression', () => {
    const result = evaluateProseTaste(TIME_SKIP_SUMMARY_CHAIN_PROSE, {
      profile: {
        maxTimeSkipSummaryDensityPer1000: 100,
        maxTimeSkipSummaryRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'time-skip-summary-chain'
    );
  });

  it('fails prose that repeats contrastive reframe aphorisms instead of staging evidence', () => {
    const result = evaluateProseTaste(CONTRASTIVE_REFRAME_CADENCE_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.contrastiveReframeDensityPer1000).toBeGreaterThanOrEqual(6);
    expect(result.metrics.longestContrastiveReframeRun).toBeGreaterThan(2);
    expect(codes).toContain('contrastive-reframe-cadence');
  });

  it('allows contrast when the sentence is grounded in concrete action and evidence', () => {
    const result = evaluateProseTaste(GROUNDED_CONTRASTIVE_REFRAME_PROSE, {
      threshold: 70,
    });

    expect(result.metrics.longestContrastiveReframeRun).toBe(0);
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'contrastive-reframe-cadence'
    );
  });

  it('allows projects to loosen contrastive reframe limits for deliberate rhetoric', () => {
    const result = evaluateProseTaste(CONTRASTIVE_REFRAME_CADENCE_PROSE, {
      profile: {
        maxContrastiveReframeDensityPer1000: 100,
        maxContrastiveReframeRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'contrastive-reframe-cadence'
    );
  });

  it('fails prose that dumps lore names and setting terms before scene grounding', () => {
    const result = evaluateProseTaste(LORE_NAME_OVERLOAD_PROSE, {
      profile: {
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });
    const codes = result.issues.map(issue => issue.code);
    const issue = result.issues.find(item => item.code === 'lore-name-overload');

    expect(result.passed).toBe(false);
    expect(result.metrics.loreTermOverloadSentenceCount).toBeGreaterThanOrEqual(4);
    expect(result.metrics.longestLoreTermRun).toBeGreaterThan(3);
    expect(codes).toContain('lore-name-overload');
    expect(issue?.evidence).toContain('[설정어:');
  });

  it('allows gradual lore introduction when terms are tied to props and choices', () => {
    const result = evaluateProseTaste(GROUNDED_LORE_INTRO_PROSE, {
      threshold: 70,
    });

    expect(result.metrics.longestLoreTermRun).toBeLessThanOrEqual(1);
    expect(result.issues.map(issue => issue.code)).not.toContain('lore-name-overload');
  });

  it('allows projects to loosen lore term limits for terminology-heavy genres', () => {
    const result = evaluateProseTaste(LORE_NAME_OVERLOAD_PROSE, {
      profile: {
        maxLoreTermDensityPer1000: 100,
        maxLoreTermRun: 10,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('lore-name-overload');
  });

  it('fails prose that lists status window stats without choices or costs', () => {
    const result = evaluateProseTaste(SYSTEM_STAT_BLOCK_DUMP_PROSE, {
      profile: {
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });
    const codes = result.issues.map(issue => issue.code);
    const issue = result.issues.find(item => item.code === 'system-stat-block-dump');

    expect(result.passed).toBe(false);
    expect(result.metrics.systemStatBlockDensityPer1000).toBeGreaterThanOrEqual(5);
    expect(result.metrics.longestSystemStatBlockRun).toBeGreaterThan(2);
    expect(codes).toContain('system-stat-block-dump');
    expect(issue?.evidence).toContain('[시스템 수치:');
  });

  it('allows system stats when they change costs, constraints, or next choices', () => {
    const result = evaluateProseTaste(GROUNDED_SYSTEM_COST_PROSE, {
      threshold: 70,
      profile: {
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });

    expect(result.metrics.longestSystemStatBlockRun).toBeLessThanOrEqual(1);
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'system-stat-block-dump'
    );
  });

  it('allows projects to loosen status window limits for deliberately crunchy system fiction', () => {
    const result = evaluateProseTaste(SYSTEM_STAT_BLOCK_DUMP_PROSE, {
      profile: {
        maxSystemStatBlockDensityPer1000: 100,
        maxSystemStatBlockRun: 20,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'system-stat-block-dump'
    );
  });

  it('fails prose that declares resolve without enacting choices or costs', () => {
    const result = evaluateProseTaste(DECLARED_RESOLVE_LOOP_PROSE, {
      profile: {
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.declaredResolveDensityPer1000).toBeGreaterThanOrEqual(5);
    expect(result.metrics.longestDeclaredResolveRun).toBeGreaterThan(3);
    expect(codes).toContain('declared-resolve-loop');
  });

  it('allows resolve when the decision immediately changes action and cost', () => {
    const result = evaluateProseTaste(GROUNDED_RESOLVE_ACTION_PROSE, {
      threshold: 70,
    });

    expect(result.metrics.longestDeclaredResolveRun).toBeLessThanOrEqual(1);
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'declared-resolve-loop'
    );
  });

  it('allows projects to loosen declared resolve limits for deliberately declarative prose', () => {
    const result = evaluateProseTaste(DECLARED_RESOLVE_LOOP_PROSE, {
      profile: {
        maxDeclaredResolveDensityPer1000: 100,
        maxDeclaredResolveRun: 10,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'declared-resolve-loop'
    );
  });

  it('fails prose that summarizes clue revelation without showing deduction', () => {
    const result = evaluateProseTaste(REVELATION_SUMMARY_LEAP_PROSE, {
      profile: {
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.revelationSummaryDensityPer1000).toBeGreaterThanOrEqual(4);
    expect(result.metrics.longestRevelationSummaryRun).toBeGreaterThan(2);
    expect(codes).toContain('revelation-summary-leap');
  });

  it('allows revelation when clues are compared and acted on in-scene', () => {
    const result = evaluateProseTaste(GROUNDED_REVELATION_DEDUCTION_PROSE, {
      threshold: 70,
      profile: {
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });

    expect(result.metrics.longestRevelationSummaryRun).toBeLessThanOrEqual(1);
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'revelation-summary-leap'
    );
  });

  it('allows projects to loosen revelation summary limits for deliberately summary-heavy forms', () => {
    const result = evaluateProseTaste(REVELATION_SUMMARY_LEAP_PROSE, {
      profile: {
        maxRevelationSummaryDensityPer1000: 100,
        maxRevelationSummaryRun: 10,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'revelation-summary-leap'
    );
  });

  it('fails prose that lists investigation procedures without changing the scene state', () => {
    const result = evaluateProseTaste(PROCEDURAL_CHECKLIST_CADENCE_PROSE, {
      profile: {
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.proceduralChecklistDensityPer1000).toBeGreaterThanOrEqual(5);
    expect(result.metrics.longestProceduralChecklistRun).toBeGreaterThan(3);
    expect(codes).toContain('procedural-checklist-cadence');
  });

  it('allows procedural investigation when checks change hypotheses or next actions', () => {
    const result = evaluateProseTaste(GROUNDED_PROCEDURAL_DEDUCTION_PROSE, {
      threshold: 70,
      profile: {
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });

    expect(result.metrics.longestProceduralChecklistRun).toBeLessThanOrEqual(1);
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'procedural-checklist-cadence'
    );
  });

  it('fails object-action log cadence that hides AI-like procedural rhythm behind omitted subjects', () => {
    const result = evaluateProseTaste(OBJECT_ACTION_LOG_CADENCE_PROSE, {
      threshold: 95,
    });
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(95);
    expect(result.metrics.proceduralChecklistDensityPer1000).toBeGreaterThan(5);
    expect(result.metrics.longestProceduralChecklistRun).toBeGreaterThan(3);
    expect(codes).toContain('procedural-checklist-cadence');
  });

  it('allows projects to loosen procedural checklist limits for deliberately documentary forms', () => {
    const result = evaluateProseTaste(PROCEDURAL_CHECKLIST_CADENCE_PROSE, {
      profile: {
        maxProceduralChecklistDensityPer1000: 100,
        maxProceduralChecklistRun: 10,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'procedural-checklist-cadence'
    );
  });

  it('fails prose that lists fight choreography without injuries or state changes', () => {
    const result = evaluateProseTaste(ACTION_CHOREOGRAPHY_LOOP_PROSE, {
      profile: {
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.actionChoreographyDensityPer1000).toBeGreaterThanOrEqual(5);
    expect(result.metrics.longestActionChoreographyRun).toBeGreaterThan(3);
    expect(codes).toContain('action-choreography-loop');
  });

  it('allows action scenes when beats change injuries, position, or objective state', () => {
    const result = evaluateProseTaste(GROUNDED_ACTION_CONSEQUENCE_PROSE, {
      threshold: 70,
      profile: {
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });

    expect(result.metrics.longestActionChoreographyRun).toBeLessThanOrEqual(1);
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'action-choreography-loop'
    );
  });

  it('allows projects to loosen action choreography limits for deliberately blow-by-blow forms', () => {
    const result = evaluateProseTaste(ACTION_CHOREOGRAPHY_LOOP_PROSE, {
      profile: {
        maxActionChoreographyDensityPer1000: 100,
        maxActionChoreographyRun: 10,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'action-choreography-loop'
    );
  });

  it('fails prose that rotates emotion labels without staging choices or consequences', () => {
    const result = evaluateProseTaste(EMOTION_LABEL_CAROUSEL_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.longestEmotionLabelRun).toBe(5);
    expect(codes).toContain('emotion-label-carousel');
  });

  it('allows projects to loosen emotion label run limits for deliberately direct narration', () => {
    const result = evaluateProseTaste(EMOTION_LABEL_CAROUSEL_PROSE, {
      profile: {
        maxEmotionLabelRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('emotion-label-carousel');
  });

  it('allows emotion labels when choices and consequences break the carousel', () => {
    const result = evaluateProseTaste(GROUNDED_EMOTION_TURN_PROSE, {
      threshold: 70,
    });

    expect(result.metrics.longestEmotionLabelRun).toBe(1);
    expect(result.issues.map(issue => issue.code)).not.toContain('emotion-label-carousel');
  });

  it('fails prose that chains sensory wallpaper instead of clues or consequences', () => {
    const result = evaluateProseTaste(SENSORY_WALLPAPER_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.longestSensoryWallpaperRun).toBe(5);
    expect(codes).toContain('sensory-wallpaper-run');
  });

  it('allows projects to loosen sensory wallpaper limits for deliberately descriptive prose', () => {
    const result = evaluateProseTaste(SENSORY_WALLPAPER_PROSE, {
      profile: {
        maxSensoryWallpaperRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('sensory-wallpaper-run');
  });

  it('allows sensory details when they expose clues or change scene state', () => {
    const result = evaluateProseTaste(GROUNDED_SENSORY_TURN_PROSE, {
      threshold: 70,
    });

    expect(result.metrics.longestSensoryWallpaperRun).toBe(0);
    expect(result.issues.map(issue => issue.code)).not.toContain('sensory-wallpaper-run');
  });

  it('fails prose that chains gaze and head choreography instead of staging choices or consequences', () => {
    const result = evaluateProseTaste(GAZE_CHOREOGRAPHY_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.gazeChoreographyDensityPer1000).toBeGreaterThanOrEqual(5);
    expect(result.metrics.longestGazeChoreographyRun).toBeGreaterThan(3);
    expect(codes).toContain('gaze-choreography-loop');
  });

  it('allows projects to loosen gaze choreography limits for intentionally gesture-heavy prose', () => {
    const result = evaluateProseTaste(GAZE_CHOREOGRAPHY_PROSE, {
      profile: {
        maxGazeChoreographyDensityPer1000: 100,
        maxGazeChoreographyRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('gaze-choreography-loop');
  });

  it('allows gaze beats when they are grounded in clues and consequential choices', () => {
    const result = evaluateProseTaste(GROUNDED_GAZE_PROSE, {
      threshold: 70,
    });

    expect(result.metrics.longestGazeChoreographyRun).toBe(0);
    expect(result.issues.map(issue => issue.code)).not.toContain('gaze-choreography-loop');
  });

  it('fails prose that chains autonomous body reactions as sentence subjects', () => {
    const result = evaluateProseTaste(BODY_REACTION_SUBJECT_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.bodyReactionSubjectDensityPer1000).toBe(5);
    expect(result.metrics.longestBodyReactionSubjectRun).toBe(5);
    expect(codes).toContain('body-reaction-subject-chain');
  });

  it('allows embodied reactions when they are subordinated to choices and scene action', () => {
    const result = evaluateProseTaste(EMBODIED_REACTION_WITH_AGENCY_PROSE);

    expect(result.metrics.longestBodyReactionSubjectRun).toBe(0);
    expect(result.issues.map(issue => issue.code)).not.toContain('body-reaction-subject-chain');
  });

  it('allows projects to loosen body reaction subject limits for deliberately somatic prose', () => {
    const result = evaluateProseTaste(BODY_REACTION_SUBJECT_PROSE, {
      profile: {
        maxBodyReactionSubjectDensityPer1000: 100,
        maxBodyReactionSubjectRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('body-reaction-subject-chain');
  });

  it('fails prose that chains cliche emotion images instead of scene-specific pressure', () => {
    const result = evaluateProseTaste(CLICHE_EMOTION_IMAGE_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.clicheEmotionImageDensityPer1000).toBe(6);
    expect(result.metrics.longestClicheEmotionImageRun).toBe(6);
    expect(codes).toContain('cliche-emotion-image-chain');
  });

  it('allows specific emotional pressure when it is tied to objects and choices', () => {
    const result = evaluateProseTaste(SPECIFIC_EMOTION_IMAGE_PROSE);

    expect(result.metrics.clicheEmotionImageDensityPer1000).toBe(0);
    expect(result.metrics.longestClicheEmotionImageRun).toBe(0);
    expect(result.issues.map(issue => issue.code)).not.toContain('cliche-emotion-image-chain');
  });

  it('allows projects to loosen cliche emotion image limits for deliberately heightened narration', () => {
    const result = evaluateProseTaste(CLICHE_EMOTION_IMAGE_PROSE, {
      profile: {
        maxClicheEmotionImageDensityPer1000: 100,
        maxClicheEmotionImageRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('cliche-emotion-image-chain');
  });

  it('fails prose that stacks symbolic abstractions without concrete anchors', () => {
    const result = evaluateProseTaste(SYMBOLIC_ABSTRACTION_STACK_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.symbolicAbstractionDensityPer1000).toBe(4);
    expect(result.metrics.longestSymbolicAbstractionRun).toBe(4);
    expect(codes).toContain('symbolic-abstraction-stack');
  });

  it('allows symbolic language when scene objects and choices carry the meaning', () => {
    const result = evaluateProseTaste(GROUNDED_SYMBOLIC_PROSE);

    expect(result.metrics.longestSymbolicAbstractionRun).toBe(0);
    expect(result.issues.map(issue => issue.code)).not.toContain('symbolic-abstraction-stack');
  });

  it('allows projects to loosen symbolic abstraction limits for deliberately allegorical prose', () => {
    const result = evaluateProseTaste(SYMBOLIC_ABSTRACTION_STACK_PROSE, {
      profile: {
        maxSymbolicAbstractionDensityPer1000: 100,
        maxSymbolicAbstractionRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('symbolic-abstraction-stack');
  });

  it('fails prose that leans on vague atmosphere modifiers instead of concrete scene evidence', () => {
    const result = evaluateProseTaste(VAGUE_ATMOSPHERE_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.vagueAtmosphereModifierDensityPer1000).toBe(5);
    expect(result.metrics.longestVagueAtmosphereModifierRun).toBe(5);
    expect(codes).toContain('vague-atmosphere-modifier-chain');
  });

  it('allows projects to loosen vague atmosphere limits for intentionally uncanny prose', () => {
    const result = evaluateProseTaste(VAGUE_ATMOSPHERE_PROSE, {
      profile: {
        maxVagueAtmosphereModifierDensityPer1000: 100,
        maxVagueAtmosphereModifierRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('vague-atmosphere-modifier-chain');
  });

  it('fails prose that stacks evaluative modifiers instead of staging concrete changes', () => {
    const result = evaluateProseTaste(EVALUATIVE_MODIFIER_STACK_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.evaluativeModifierDensityPer1000).toBeGreaterThan(8);
    expect(result.metrics.longestEvaluativeModifierRun).toBe(5);
    expect(codes).toContain('evaluative-modifier-stack');
  });

  it('allows projects to loosen evaluative modifier limits for deliberately ornate narration', () => {
    const result = evaluateProseTaste(EVALUATIVE_MODIFIER_STACK_PROSE, {
      profile: {
        maxEvaluativeModifierDensityPer1000: 100,
        maxEvaluativeModifierRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('evaluative-modifier-stack');
  });

  it('fails prose that repeats filler adverbs instead of choosing precise action verbs', () => {
    const result = evaluateProseTaste(FILLER_ADVERB_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.fillerAdverbDensityPer1000).toBe(7);
    expect(result.metrics.longestFillerAdverbRun).toBe(7);
    expect(codes).toContain('filler-adverb-cadence');
  });

  it('allows projects to loosen filler adverb cadence for a deliberately hushed voice', () => {
    const result = evaluateProseTaste(FILLER_ADVERB_PROSE, {
      profile: {
        maxFillerAdverbDensityPer1000: 100,
        maxFillerAdverbRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('filler-adverb-cadence');
  });

  it('fails prose that chains simultaneous action constructions into a stage-direction rhythm', () => {
    const result = evaluateProseTaste(SIMULTANEOUS_ACTION_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.simultaneousActionDensityPer1000).toBeGreaterThanOrEqual(6);
    expect(result.metrics.longestSimultaneousActionRun).toBe(6);
    expect(codes).toContain('simultaneous-action-cadence');
  });

  it('allows occasional simultaneous action constructions when the scene keeps causal turns', () => {
    const result = evaluateProseTaste(CONTROLLED_SIMULTANEOUS_ACTION_PROSE, {
      threshold: 70,
    });

    expect(result.passed).toBe(true);
    expect(result.metrics.longestSimultaneousActionRun).toBe(1);
    expect(result.issues.map(issue => issue.code)).not.toContain('simultaneous-action-cadence');
  });

  it('allows projects to loosen simultaneous action cadence for deliberately flowing prose', () => {
    const result = evaluateProseTaste(SIMULTANEOUS_ACTION_PROSE, {
      profile: {
        maxSimultaneousActionDensityPer1000: 100,
        maxSimultaneousActionRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('simultaneous-action-cadence');
  });

  it('fails prose that lets emphasis punctuation carry emotion instead of action beats', () => {
    const result = evaluateProseTaste(EMPHASIS_PUNCTUATION_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.emphasisPunctuationDensityPer1000).toBeGreaterThan(6);
    expect(result.metrics.longestEmphasisPunctuationRun).toBeGreaterThan(3);
    expect(codes).toContain('punctuation-emphasis-overload');
  });

  it('allows projects to loosen emphasis punctuation limits for fast platform dialogue', () => {
    const result = evaluateProseTaste(EMPHASIS_PUNCTUATION_PROSE, {
      profile: {
        maxEmphasisPunctuationDensityPer1000: 100,
        maxEmphasisPunctuationRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('punctuation-emphasis-overload');
  });

  it('fails prose that loops low-impact actions without a causal turn', () => {
    const result = evaluateProseTaste(STATUS_QUO_ACTION_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.statusQuoActionDensityPer1000).toBe(7);
    expect(result.metrics.longestStatusQuoActionRun).toBe(7);
    expect(result.metrics.causalTurnDensityPer1000).toBe(0);
    expect(codes).toContain('status-quo-action-loop');
  });

  it('allows projects to loosen status quo action loops for intentionally suspended prose', () => {
    const result = evaluateProseTaste(STATUS_QUO_ACTION_PROSE, {
      profile: {
        maxStatusQuoActionDensityPer1000: 100,
        maxStatusQuoActionRun: 10,
        minCausalTurnDensityPer1000: 0,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('status-quo-action-loop');
  });

  it('fails prose that chains rhetorical self-questions instead of choices or new evidence', () => {
    const result = evaluateProseTaste(RHETORICAL_QUESTION_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.rhetoricalQuestionDensityPer1000).toBe(5);
    expect(result.metrics.longestRhetoricalQuestionRun).toBe(5);
    expect(codes).toContain('rhetorical-question-drift');
  });

  it('allows projects to loosen rhetorical question limits for intentionally interrogative prose', () => {
    const result = evaluateProseTaste(RHETORICAL_QUESTION_PROSE, {
      profile: {
        maxRhetoricalQuestionDensityPer1000: 100,
        maxRhetoricalQuestionRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('rhetorical-question-drift');
  });

  it('fails prose that explains subtext instead of letting readers infer it from action', () => {
    const result = evaluateProseTaste(SUBTEXT_OVEREXPLAINED_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.subtextExplanationDensityPer1000).toBe(4);
    expect(result.metrics.longestSubtextExplanationRun).toBe(4);
    expect(codes).toContain('subtext-overexplanation-chain');
  });

  it('allows projects to loosen subtext explanation limits for deliberately interpretive narration', () => {
    const result = evaluateProseTaste(SUBTEXT_OVEREXPLAINED_PROSE, {
      profile: {
        maxSubtextExplanationDensityPer1000: 100,
        maxSubtextExplanationRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('subtext-overexplanation-chain');
  });

  it('fails prose that chains ambiguous references without naming the actor or object', () => {
    const result = evaluateProseTaste(AMBIGUOUS_REFERENCE_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.ambiguousReferenceDensityPer1000).toBeGreaterThanOrEqual(5);
    expect(result.metrics.longestAmbiguousReferenceRun).toBeGreaterThan(3);
    expect(codes).toContain('ambiguous-reference-chain');
  });

  it('allows projects to loosen ambiguous reference limits for deliberately withheld perspective', () => {
    const result = evaluateProseTaste(AMBIGUOUS_REFERENCE_PROSE, {
      profile: {
        maxAmbiguousReferenceDensityPer1000: 100,
        maxAmbiguousReferenceRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('ambiguous-reference-chain');
  });

  it('fails scene breaks that restart without time, space, causality, or POV grounding', () => {
    const result = evaluateProseTaste(ABRUPT_SCENE_TRANSITION_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.sceneTransitionGroundingGapDensityPer1000).toBeGreaterThanOrEqual(3);
    expect(result.metrics.longestSceneTransitionGroundingGapRun).toBeGreaterThan(2);
    expect(codes).toContain('scene-transition-grounding-gap');
  });

  it('allows scene breaks when the next scene opens with explicit continuity grounding', () => {
    const result = evaluateProseTaste(GROUNDED_SCENE_TRANSITION_PROSE);

    expect(result.metrics.sceneTransitionGroundingGapDensityPer1000).toBe(0);
    expect(result.metrics.longestSceneTransitionGroundingGapRun).toBe(0);
    expect(result.issues.map(issue => issue.code)).not.toContain('scene-transition-grounding-gap');
  });

  it('allows projects to loosen scene transition limits for deliberate montage pacing', () => {
    const result = evaluateProseTaste(ABRUPT_SCENE_TRANSITION_PROSE, {
      profile: {
        maxSceneTransitionGroundingGapDensityPer1000: 100,
        maxSceneTransitionGroundingGapRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('scene-transition-grounding-gap');
  });

  it('fails prose that locks consecutive sentences into the same topic-marker cadence', () => {
    const result = evaluateProseTaste(TOPIC_MARKER_CADENCE_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.topicMarkerStarterDensityPer1000).toBeGreaterThanOrEqual(6);
    expect(result.metrics.longestTopicMarkerStarterRun).toBeGreaterThan(4);
    expect(codes).toContain('topic-marker-cadence-lock');
  });

  it('allows the same scene material when sentence openings vary', () => {
    const result = evaluateProseTaste(VARIED_TOPIC_CADENCE_PROSE);

    expect(result.metrics.longestTopicMarkerStarterRun).toBeLessThanOrEqual(2);
    expect(result.issues.map(issue => issue.code)).not.toContain('topic-marker-cadence-lock');
  });

  it('allows projects to loosen topic-marker cadence limits for deliberate parallelism', () => {
    const result = evaluateProseTaste(TOPIC_MARKER_CADENCE_PROSE, {
      profile: {
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 10,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain('topic-marker-cadence-lock');
  });

  it('fails prose whose mid-length narration keeps nearly the same sentence length cadence', () => {
    const result = evaluateProseTaste(UNIFORM_SENTENCE_LENGTH_PROSE, {
      profile: {
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        maxStatusQuoActionDensityPer1000: 100,
        maxStatusQuoActionRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.sentenceLengthVariationCoefficient).toBeLessThan(0.24);
    expect(result.metrics.longestUniformSentenceLengthRun).toBeGreaterThan(6);
    expect(codes).toContain('uniform-sentence-length-cadence');
  });

  it('allows the same scene material when sentence lengths vary inside the paragraph', () => {
    const result = evaluateProseTaste(VARIED_SENTENCE_LENGTH_PROSE);

    expect(result.metrics.sentenceLengthVariationCoefficient).toBeGreaterThanOrEqual(0.24);
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'uniform-sentence-length-cadence'
    );
  });

  it('allows projects to loosen uniform sentence cadence limits for deliberate parallelism', () => {
    const result = evaluateProseTaste(UNIFORM_SENTENCE_LENGTH_PROSE, {
      profile: {
        minSentenceLengthVariationCoefficient: 0,
        maxUniformSentenceLengthRun: 20,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        maxStatusQuoActionDensityPer1000: 100,
        maxStatusQuoActionRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'uniform-sentence-length-cadence'
    );
  });

  it('fails prose whose explanatory paragraph loses immersive rhythm anchors', () => {
    const result = evaluateProseTaste(IMMERSIVE_RHYTHM_FLATLINE_PROSE);
    const codes = result.issues.map(issue => issue.code);

    expect(result.passed).toBe(false);
    expect(result.metrics.longestImmersiveRhythmFlatlineRun).toBeGreaterThan(5);
    expect(result.metrics.immersiveRhythmAnchorDensityPer1000).toBe(0);
    expect(codes).toContain('immersive-rhythm-flatline');
  });

  it('allows scene-grounded rhythm when concrete anchors break explanatory cadence', () => {
    const result = evaluateProseTaste(GROUNDED_IMMERSIVE_RHYTHM_PROSE);

    expect(result.metrics.immersiveRhythmAnchorDensityPer1000).toBeGreaterThan(2.4);
    expect(result.metrics.longestImmersiveRhythmFlatlineRun).toBe(0);
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'immersive-rhythm-flatline'
    );
  });

  it('allows projects to loosen immersive rhythm flatline limits for deliberate essay-like narration', () => {
    const result = evaluateProseTaste(IMMERSIVE_RHYTHM_FLATLINE_PROSE, {
      profile: {
        minImmersiveRhythmAnchorDensityPer1000: 0,
        maxImmersiveRhythmFlatlineRun: 20,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'immersive-rhythm-flatline'
    );
  });

  it('fails prose whose sentence-final endings lock into the same cadence', () => {
    const result = evaluateProseTaste(SAME_ENDING_PROSE, {
      threshold: 95,
      profile: {
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        maxStatusQuoActionDensityPer1000: 100,
        maxStatusQuoActionRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });
    const sameEndingIssue = result.issues.find(issue => issue.code === 'same-ending-run');

    expect(result.passed).toBe(false);
    expect(result.metrics.longestSameEndingRun).toBeGreaterThan(4);
    expect(sameEndingIssue?.message).toContain('허용치 4문장');
  });

  it('allows projects to loosen sentence-final ending cadence limits', () => {
    const result = evaluateProseTaste(SAME_ENDING_PROSE, {
      profile: {
        maxSameEndingRun: 5,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        maxStatusQuoActionDensityPer1000: 100,
        maxStatusQuoActionRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.metrics.longestSameEndingRun).toBe(5);
    expect(result.issues.map(issue => issue.code)).not.toContain('same-ending-run');
  });

  it('allows projects to tighten sentence-final ending cadence limits', () => {
    const result = evaluateProseTaste(FOUR_SAME_ENDING_PROSE, {
      profile: {
        maxSameEndingRun: 3,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        maxStatusQuoActionDensityPer1000: 100,
        maxStatusQuoActionRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });
    const codes = result.issues.map(issue => issue.code);

    expect(result.metrics.longestSameEndingRun).toBe(4);
    expect(codes).toContain('same-ending-run');
  });

  it('catches dominant sentence-final ending cadence without requiring consecutive repetition', () => {
    const result = evaluateProseTaste(DOMINANT_ENDING_CADENCE_PROSE, {
      profile: {
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        maxStatusQuoActionDensityPer1000: 100,
        maxStatusQuoActionRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });
    const codes = result.issues.map(issue => issue.code);
    const issue = result.issues.find(item => item.code === 'dominant-ending-cadence-lock');

    expect(result.passed).toBe(false);
    expect(result.metrics.longestSameEndingRun).toBe(2);
    expect(result.metrics.sentenceEndingCadenceSampleSize).toBe(8);
    expect(result.metrics.dominantSentenceEndingCount).toBe(6);
    expect(result.metrics.dominantSentenceEndingShare).toBe(0.75);
    expect(codes).not.toContain('same-ending-run');
    expect(codes).toContain('dominant-ending-cadence-lock');
    expect(issue?.message).toContain('6/8문장(75%)');
  });

  it('allows projects to loosen dominant sentence-final ending share for deliberate plain rhythm', () => {
    const result = evaluateProseTaste(DOMINANT_ENDING_CADENCE_PROSE, {
      profile: {
        maxDominantSentenceEndingShare: 0.8,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        maxStatusQuoActionDensityPer1000: 100,
        maxStatusQuoActionRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.metrics.dominantSentenceEndingShare).toBe(0.75);
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'dominant-ending-cadence-lock'
    );
  });

  it('catches dominant dialogue ending cadence across grounded dialogue turns', () => {
    const result = evaluateProseTaste(DIALOGUE_ENDING_CADENCE_PROSE, {
      profile: {
        maxDialogueGroundingGapRun: 8,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        maxStatusQuoActionDensityPer1000: 100,
        maxStatusQuoActionRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });
    const codes = result.issues.map(issue => issue.code);
    const issue = result.issues.find(item => item.code === 'dialogue-ending-cadence-lock');

    expect(result.passed).toBe(false);
    expect(result.metrics.dialogueEndingCadenceSampleSize).toBe(6);
    expect(result.metrics.dominantDialogueEndingCount).toBe(5);
    expect(result.metrics.dominantDialogueEndingShare).toBe(0.83);
    expect(codes).toContain('dialogue-ending-cadence-lock');
    expect(codes).not.toContain('talking-head-dialogue-run');
    expect(issue?.message).toContain('5/6턴(83%)');
  });

  it('allows projects to loosen dialogue ending cadence for deliberate shared register', () => {
    const result = evaluateProseTaste(DIALOGUE_ENDING_CADENCE_PROSE, {
      profile: {
        maxDominantDialogueEndingShare: 0.9,
        maxDialogueGroundingGapRun: 8,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        maxStatusQuoActionDensityPer1000: 100,
        maxStatusQuoActionRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.metrics.dominantDialogueEndingShare).toBe(0.83);
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'dialogue-ending-cadence-lock'
    );
  });

  it('catches dominant dialogue starter cadence across grounded dialogue turns', () => {
    const result = evaluateProseTaste(DIALOGUE_STARTER_CADENCE_PROSE, {
      profile: {
        maxDialogueGroundingGapRun: 8,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        maxStatusQuoActionDensityPer1000: 100,
        maxStatusQuoActionRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });
    const codes = result.issues.map(issue => issue.code);
    const issue = result.issues.find(item => item.code === 'dialogue-starter-cadence-lock');

    expect(result.passed).toBe(false);
    expect(result.metrics.dialogueStarterCadenceSampleSize).toBe(6);
    expect(result.metrics.dominantDialogueStarterCount).toBe(4);
    expect(result.metrics.dominantDialogueStarterShare).toBe(0.67);
    expect(codes).toContain('dialogue-starter-cadence-lock');
    expect(codes).not.toContain('talking-head-dialogue-run');
    expect(codes).not.toContain('dialogue-ending-cadence-lock');
    expect(issue?.message).toContain('4/6턴(67%)');
  });

  it('allows projects to loosen dialogue starter cadence for deliberate shared stance', () => {
    const result = evaluateProseTaste(DIALOGUE_STARTER_CADENCE_PROSE, {
      profile: {
        maxDominantDialogueStarterShare: 0.8,
        maxDialogueGroundingGapRun: 8,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        maxStatusQuoActionDensityPer1000: 100,
        maxStatusQuoActionRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.metrics.dominantDialogueStarterShare).toBe(0.67);
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'dialogue-starter-cadence-lock'
    );
  });

  it('catches dialogue scenes that cascade into interrogative turns without answers', () => {
    const result = evaluateProseTaste(DIALOGUE_QUESTION_CASCADE_PROSE, {
      profile: {
        maxDialogueGroundingGapRun: 8,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        maxStatusQuoActionDensityPer1000: 100,
        maxStatusQuoActionRun: 20,
        maxRhetoricalQuestionDensityPer1000: 100,
        maxRhetoricalQuestionRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });
    const codes = result.issues.map(issue => issue.code);
    const issue = result.issues.find(item => item.code === 'dialogue-question-cascade');

    expect(result.passed).toBe(false);
    expect(result.metrics.dialogueQuestionTurnCount).toBe(5);
    expect(result.metrics.dialogueQuestionRatio).toBe(0.83);
    expect(result.metrics.longestDialogueQuestionRun).toBe(5);
    expect(codes).toContain('dialogue-question-cascade');
    expect(codes).not.toContain('talking-head-dialogue-run');
    expect(codes).not.toContain('dialogue-ending-cadence-lock');
    expect(issue?.message).toContain('5/6턴(83%)');
  });

  it('allows projects to loosen dialogue question cascade for interrogation-heavy scenes', () => {
    const result = evaluateProseTaste(DIALOGUE_QUESTION_CASCADE_PROSE, {
      profile: {
        maxDialogueQuestionRatio: 0.9,
        maxDialogueQuestionRun: 6,
        maxDialogueGroundingGapRun: 8,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        maxStatusQuoActionDensityPer1000: 100,
        maxStatusQuoActionRun: 20,
        maxRhetoricalQuestionDensityPer1000: 100,
        maxRhetoricalQuestionRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.metrics.dialogueQuestionRatio).toBe(0.83);
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'dialogue-question-cascade'
    );
  });

  it('catches dialogue scenes that overuse names and titles as direct address', () => {
    const result = evaluateProseTaste(DIALOGUE_VOCATIVE_CADENCE_PROSE, {
      profile: {
        maxDialogueGroundingGapRun: 8,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        maxStatusQuoActionDensityPer1000: 100,
        maxStatusQuoActionRun: 20,
        maxRhetoricalQuestionDensityPer1000: 100,
        maxRhetoricalQuestionRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });
    const codes = result.issues.map(issue => issue.code);
    const issue = result.issues.find(item => item.code === 'dialogue-vocative-cadence-lock');

    expect(result.passed).toBe(false);
    expect(result.metrics.dialogueVocativeTurnCount).toBe(5);
    expect(result.metrics.dialogueVocativeRatio).toBe(0.83);
    expect(result.metrics.longestDialogueVocativeRun).toBe(5);
    expect(codes).toContain('dialogue-vocative-cadence-lock');
    expect(codes).not.toContain('talking-head-dialogue-run');
    expect(codes).not.toContain('dialogue-starter-cadence-lock');
    expect(codes).not.toContain('dialogue-question-cascade');
    expect(issue?.message).toContain('5/6턴(83%)');
  });

  it('allows projects to loosen dialogue vocative cadence for ritualized or formal scenes', () => {
    const result = evaluateProseTaste(DIALOGUE_VOCATIVE_CADENCE_PROSE, {
      profile: {
        maxDialogueVocativeRatio: 0.9,
        maxDialogueVocativeRun: 6,
        maxDialogueGroundingGapRun: 8,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        maxStatusQuoActionDensityPer1000: 100,
        maxStatusQuoActionRun: 20,
        maxRhetoricalQuestionDensityPer1000: 100,
        maxRhetoricalQuestionRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.metrics.dialogueVocativeRatio).toBe(0.83);
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'dialogue-vocative-cadence-lock'
    );
  });

  it('catches dialogue scenes that echo the same content word across turns', () => {
    const result = evaluateProseTaste(DIALOGUE_LEXICAL_ECHO_PROSE, {
      profile: {
        maxDialogueGroundingGapRun: 8,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        maxStatusQuoActionDensityPer1000: 100,
        maxStatusQuoActionRun: 20,
        maxRhetoricalQuestionDensityPer1000: 100,
        maxRhetoricalQuestionRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });
    const codes = result.issues.map(issue => issue.code);
    const issue = result.issues.find(item => item.code === 'dialogue-lexical-echo-chain');

    expect(result.passed).toBe(false);
    expect(result.metrics.dialogueLexicalEchoTurnCount).toBe(4);
    expect(result.metrics.dialogueLexicalEchoRatio).toBe(0.67);
    expect(result.metrics.longestDialogueLexicalEchoRun).toBe(5);
    expect(codes).toContain('dialogue-lexical-echo-chain');
    expect(codes).not.toContain('talking-head-dialogue-run');
    expect(codes).not.toContain('dialogue-starter-cadence-lock');
    expect(codes).not.toContain('dialogue-question-cascade');
    expect(codes).not.toContain('dialogue-vocative-cadence-lock');
    expect(issue?.message).toContain('4/6턴(67%)');
    expect(issue?.evidence).toContain('[echo: 봉투]');
  });

  it('allows projects to loosen dialogue lexical echo limits for repeated-object scenes', () => {
    const result = evaluateProseTaste(DIALOGUE_LEXICAL_ECHO_PROSE, {
      profile: {
        maxDialogueLexicalEchoRatio: 0.9,
        maxDialogueLexicalEchoRun: 6,
        maxDialogueGroundingGapRun: 8,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        maxStatusQuoActionDensityPer1000: 100,
        maxStatusQuoActionRun: 20,
        maxRhetoricalQuestionDensityPer1000: 100,
        maxRhetoricalQuestionRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.metrics.dialogueLexicalEchoRatio).toBe(0.67);
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'dialogue-lexical-echo-chain'
    );
  });

  it('catches dialogue scenes that keep paraphrasing and confirming information', () => {
    const result = evaluateProseTaste(DIALOGUE_PARAPHRASE_CONFIRMATION_PROSE, {
      profile: {
        maxDialogueGroundingGapRun: 8,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        maxStatusQuoActionDensityPer1000: 100,
        maxStatusQuoActionRun: 20,
        maxRhetoricalQuestionDensityPer1000: 100,
        maxRhetoricalQuestionRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });
    const codes = result.issues.map(issue => issue.code);
    const issue = result.issues.find(
      item => item.code === 'dialogue-paraphrase-confirmation-chain'
    );

    expect(result.passed).toBe(false);
    expect(result.metrics.dialogueParaphraseConfirmationTurnCount).toBe(5);
    expect(result.metrics.dialogueParaphraseConfirmationRatio).toBe(0.83);
    expect(result.metrics.longestDialogueParaphraseConfirmationRun).toBe(5);
    expect(codes).toContain('dialogue-paraphrase-confirmation-chain');
    expect(codes).not.toContain('talking-head-dialogue-run');
    expect(codes).not.toContain('dialogue-question-cascade');
    expect(codes).not.toContain('dialogue-vocative-cadence-lock');
    expect(codes).not.toContain('dialogue-lexical-echo-chain');
    expect(issue?.message).toContain('5/6턴(83%)');
    expect(issue?.evidence).toContain('[재진술: 그러니까]');
  });

  it('allows projects to loosen dialogue paraphrase confirmation limits for procedural scenes', () => {
    const result = evaluateProseTaste(DIALOGUE_PARAPHRASE_CONFIRMATION_PROSE, {
      profile: {
        maxDialogueParaphraseConfirmationRatio: 0.9,
        maxDialogueParaphraseConfirmationRun: 6,
        maxDialogueGroundingGapRun: 8,
        maxTopicMarkerStarterDensityPer1000: 100,
        maxTopicMarkerStarterRun: 20,
        maxStatusQuoActionDensityPer1000: 100,
        maxStatusQuoActionRun: 20,
        maxRhetoricalQuestionDensityPer1000: 100,
        maxRhetoricalQuestionRun: 20,
        minCausalTurnDensityPer1000: 0,
      },
    });

    expect(result.calibration).toBe('profiled');
    expect(result.metrics.dialogueParaphraseConfirmationRatio).toBe(0.83);
    expect(result.issues.map(issue => issue.code)).not.toContain(
      'dialogue-paraphrase-confirmation-chain'
    );
  });

  it('treats explicit user-disliked phrases as critical failures', () => {
    const result = evaluateProseTaste('손끝에서 감각이 왔다. 그는 곧 답을 알 수 있었다.', {
      profile: {
        dislikedPhrases: ['감각이 왔다'],
      },
    });

    expect(result.passed).toBe(false);
    expect(result.calibration).toBe('profiled');
    expect(result.issues[0].code).toBe('explicit-disliked-phrase');
    expect(result.issues[0].severity).toBe('critical');
  });

  it('exposes metrics for calibration against preferred style samples', () => {
    const metrics = analyzeProseTasteMetrics(IRRITATING_AI_PROSE);

    expect(metrics.functionalReportCount).toBeGreaterThanOrEqual(3);
    expect(metrics.bodyReactionSubjectDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.longestBodyReactionSubjectRun).toBeGreaterThanOrEqual(0);
    expect(metrics.symbolicAbstractionDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.longestSymbolicAbstractionRun).toBeGreaterThanOrEqual(0);
    expect(metrics.longestSensoryWallpaperRun).toBeGreaterThanOrEqual(0);
    expect(metrics.emotionLabelDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.longestEmotionLabelRun).toBeGreaterThanOrEqual(0);
    expect(metrics.listMarkerCount).toBeGreaterThanOrEqual(3);
    expect(metrics.designJargonCount).toBeGreaterThan(0);
    expect(metrics.hedgedPerceptionDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.abstractNounDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.cognitiveFilterDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.loreTermDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.loreTermOverloadSentenceCount).toBeGreaterThanOrEqual(0);
    expect(metrics.longestLoreTermRun).toBeGreaterThanOrEqual(0);
    expect(metrics.nominalizedExplanationDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.translationeseFormulaDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.connectiveStarterDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.statusQuoActionDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.longestStatusQuoActionRun).toBeGreaterThanOrEqual(0);
    expect(metrics.gazeChoreographyDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.longestGazeChoreographyRun).toBeGreaterThanOrEqual(0);
    expect(metrics.causalTurnDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.commaDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.reportingTailDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.staticDescriptionDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.genericTeaserDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.thinCliffhangerEndingCount).toBeGreaterThanOrEqual(0);
    expect(metrics.endingCliffhangerSignalCount).toBeGreaterThanOrEqual(0);
    expect(metrics.endingConcreteTriggerCount).toBeGreaterThanOrEqual(0);
    expect(metrics.povMindJumpParagraphDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.povMindJumpParagraphCount).toBeGreaterThanOrEqual(0);
    expect(metrics.longestPovMindJumpRun).toBeGreaterThanOrEqual(0);
    expect(metrics.roteDialogueReplyCount).toBeGreaterThanOrEqual(0);
    expect(metrics.roteDialogueReplyRatio).toBeGreaterThanOrEqual(0);
    expect(metrics.longestRoteDialogueReplyRun).toBeGreaterThanOrEqual(0);
    expect(metrics.dialogueQuestionTurnCount).toBeGreaterThanOrEqual(0);
    expect(metrics.dialogueQuestionRatio).toBeGreaterThanOrEqual(0);
    expect(metrics.longestDialogueQuestionRun).toBeGreaterThanOrEqual(0);
    expect(metrics.dialogueVocativeTurnCount).toBeGreaterThanOrEqual(0);
    expect(metrics.dialogueVocativeRatio).toBeGreaterThanOrEqual(0);
    expect(metrics.longestDialogueVocativeRun).toBeGreaterThanOrEqual(0);
    expect(metrics.dialogueLexicalEchoTurnCount).toBeGreaterThanOrEqual(0);
    expect(metrics.dialogueLexicalEchoRatio).toBeGreaterThanOrEqual(0);
    expect(metrics.longestDialogueLexicalEchoRun).toBeGreaterThanOrEqual(0);
    expect(metrics.dialogueParaphraseConfirmationTurnCount).toBeGreaterThanOrEqual(0);
    expect(metrics.dialogueParaphraseConfirmationRatio).toBeGreaterThanOrEqual(0);
    expect(metrics.longestDialogueParaphraseConfirmationRun).toBeGreaterThanOrEqual(0);
    expect(metrics.neutralDialogueTagCount).toBeGreaterThanOrEqual(0);
    expect(metrics.neutralDialogueTagRatio).toBeGreaterThanOrEqual(0);
    expect(metrics.longestNeutralDialogueTagRun).toBeGreaterThanOrEqual(0);
    expect(metrics.silenceStallDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.longestSilenceStallRun).toBeGreaterThanOrEqual(0);
    expect(metrics.melodramaticCaptionDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.longestMelodramaticCaptionRun).toBeGreaterThanOrEqual(0);
    expect(metrics.stockReactionBeatDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.longestStockReactionBeatRun).toBeGreaterThanOrEqual(0);
    expect(metrics.vagueAtmosphereModifierDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.longestVagueAtmosphereModifierRun).toBeGreaterThanOrEqual(0);
    expect(metrics.evaluativeModifierDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.longestEvaluativeModifierRun).toBeGreaterThanOrEqual(0);
    expect(metrics.rhetoricalQuestionDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.longestRhetoricalQuestionRun).toBeGreaterThanOrEqual(0);
    expect(metrics.subtextExplanationDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.longestSubtextExplanationRun).toBeGreaterThanOrEqual(0);
    expect(metrics.ambiguousReferenceDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.longestAmbiguousReferenceRun).toBeGreaterThanOrEqual(0);
    expect(metrics.sceneTransitionGroundingGapDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.longestSceneTransitionGroundingGapRun).toBeGreaterThanOrEqual(0);
    expect(metrics.topicMarkerStarterDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.longestTopicMarkerStarterRun).toBeGreaterThanOrEqual(0);
    expect(metrics.sentenceLengthVariationCoefficient).toBeGreaterThanOrEqual(0);
    expect(metrics.longestUniformSentenceLengthRun).toBeGreaterThanOrEqual(0);
    expect(metrics.viewpointAnchorDensityPer1000).toBeGreaterThanOrEqual(0);
    expect(metrics.longestShortSentenceRun).toBeGreaterThanOrEqual(0);
    expect(metrics.longestRepeatedSubjectRun).toBeGreaterThanOrEqual(0);
    expect(metrics.longestRepeatedConnectiveStarterRun).toBeGreaterThanOrEqual(0);
  });
});

describe('StyleStageEvaluator prose taste integration', () => {
  it('scores irritating prose lower than controlled prose', async () => {
    const cleanScore = await StyleStageEvaluator.score(CLEAN_PROSE);
    const irritatingScore = await StyleStageEvaluator.score(IRRITATING_AI_PROSE);

    expect(cleanScore).toBeGreaterThan(irritatingScore);
  });

  it('emits style-alignment directives for prose taste failures', async () => {
    const directives = await StyleStageEvaluator.generateDirectives(IRRITATING_AI_PROSE);
    const proseTasteDirective = directives.find(directive =>
      directive.type === 'style-alignment' &&
      directive.issue.includes('문체 취향 게이트 실패')
    );

    expect(proseTasteDirective).toBeDefined();
    expect(proseTasteDirective?.issue).toMatch(/문단 \d+/);
    expect(proseTasteDirective?.issue).toMatch(/문장 \d+/);
    expect(proseTasteDirective?.currentText.length).toBeGreaterThan(0);
  });

  it('turns immersive rhythm flatlines into scene-anchored rewrite directives', async () => {
    const directives = await StyleStageEvaluator.generateDirectives(IMMERSIVE_RHYTHM_FLATLINE_PROSE);
    const directive = directives.find(item =>
      item.type === 'style-alignment' &&
      item.issue.includes('문단 리듬이 평평합니다')
    );

    expect(directive).toBeDefined();
    expect(directive?.currentText).toContain('단순한 오해가 아니라고 생각했다');
    expect(directive?.instruction).toContain('장면 진행');
    expect(directive?.instruction).toContain('물증');
    expect(directive?.instruction).toContain('선택 비용');
    expect(directive?.instruction).toContain('단문 나열로 해결하지 마세요');
    expect(directive?.maxScope).toBe(3);
    expect(validateScopeCompliance(directive!).valid).toBe(true);
  });
});
