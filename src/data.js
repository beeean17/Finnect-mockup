export const personas = [
  {
    id: "starter",
    label: "사회초년생",
    mode: "첫 금융 보호모드",
    copy: "카드, 대출, 리볼빙, 연체 설명을 더 자세히 보여줘요.",
    categories: ["카드", "대출", "약관"]
  },
  {
    id: "trade",
    label: "중고거래",
    mode: "거래 안전모드",
    copy: "송금, 입금, 명의 불일치, 삼자사기 신호를 먼저 보여줘요.",
    categories: ["송금", "입금"]
  },
  {
    id: "freelancer",
    label: "프리랜서",
    mode: "사업자 입금 보호모드",
    copy: "거래처명, 정산, 고객 입금, 자동이체 위험을 강조해요.",
    categories: ["입금", "자동이체", "대출"]
  },
  {
    id: "senior",
    label: "고령층",
    mode: "천천히 확인 모드",
    copy: "큰 글씨, 넓은 버튼, 반복 확인으로 급한 송금을 막아요.",
    categories: ["송금", "입금", "대출"]
  },
  {
    id: "foreigner",
    label: "외국인",
    mode: "쉬운 한국어 모드",
    copy: "쉬운 한국어와 영어 보조 라벨로 금융 용어를 풀어줘요.",
    categories: ["약관", "카드", "대출"]
  }
];

export const glossary = {
  리볼빙: {
    plain: "이번 달 카드값 일부를 다음 달로 미루는 기능입니다.",
    risk: "미룬 금액에 높은 이자가 붙고 빚이 반복될 수 있어요.",
    english: "Revolving payment can carry card debt into next month."
  },
  연체이자: {
    plain: "돈을 늦게 냈을 때 추가로 내는 이자입니다.",
    risk: "신용점수에 불이익이 생기고 다음 금융 거래가 어려워질 수 있어요.",
    english: "Late interest is an extra cost when a payment is overdue."
  },
  중도상환수수료: {
    plain: "대출을 일찍 갚을 때 내는 수수료입니다.",
    risk: "빨리 갚아도 예상 못 한 비용이 생길 수 있어요.",
    english: "Early repayment can still have a fee."
  },
  자동갱신: {
    plain: "기간이 끝나도 자동으로 다시 계약되는 것입니다.",
    risk: "원하지 않는 결제가 이어질 수 있어요.",
    english: "Auto renewal can continue payments after a trial."
  },
  "제3자 제공": {
    plain: "내 정보가 다른 회사에도 전달되는 것입니다.",
    risk: "마케팅, 심사, 제휴 서비스에 정보가 쓰일 수 있어요.",
    english: "Third-party sharing sends your data to another company."
  },
  원금손실: {
    plain: "내가 넣은 돈보다 적게 돌려받을 수 있다는 뜻입니다.",
    risk: "투자상품에서 가장 먼저 확인해야 해요.",
    english: "Principal loss means you may get back less than invested."
  },
  "환매 제한": {
    plain: "투자한 돈을 바로 빼기 어려운 조건입니다.",
    risk: "급히 돈이 필요할 때 불리할 수 있어요.",
    english: "Redemption limits can block quick withdrawals."
  },
  "실적 조건": {
    plain: "혜택을 받기 위해 매월 써야 하는 금액입니다.",
    risk: "혜택 때문에 필요 없는 소비가 늘 수 있어요.",
    english: "Spending requirements can push unnecessary purchases."
  },
  "계좌 명의 불일치": {
    plain: "거래 상대 이름과 계좌 주인 이름이 다른 상황입니다.",
    risk: "사기 가능성이 크게 올라갑니다.",
    english: "Account name mismatch is a strong fraud signal."
  },
  "원입금 반환": {
    plain: "돈이 들어온 경로로 되돌려 보내는 방식입니다.",
    risk: "다른 계좌로 보내면 분쟁에 휘말릴 수 있어요.",
    english: "Send suspicious money back only through the original route."
  },
  보류: {
    plain: "지금 바로 처리하지 않고 멈춰두는 선택입니다.",
    risk: "실수와 충동적인 결정을 줄여줍니다.",
    english: "Pause before taking action."
  }
};

function scenario(id, category, title, description, riskLevel, riskScore, summary, risks, checks, timeline, recommendedAction, metrics = {}) {
  return {
    id,
    category,
    title,
    description,
    riskLevel,
    riskScore,
    summary,
    risks,
    checks,
    timeline: {
      today: timeline[0],
      month1: timeline[1],
      month3: timeline[2],
      worst: timeline[3]
    },
    recommendedAction,
    confidence: Math.max(76, Math.min(94, 98 - Math.round(riskScore / 5))),
    metrics
  };
}

export const scenarios = [
  scenario("loan_safe", "대출", "대출 신청: 안전", "월소득 대비 상환 부담이 낮은 대출", "낮음", 28, "월소득 대비 상환 부담이 낮아요.", ["중도상환수수료", "금리 변동"], ["실제 적용 금리", "상환 일정"], ["대출금이 들어오지만 상환 계획이 명확해요.", "상환액이 생활비를 크게 압박하지 않아요.", "고정지출과 겹쳐도 잔액 여유가 있어요.", "중도상환수수료만 확인하면 큰 위험은 낮아요."], "진행 가능", { monthly: "82,000원", total: "984,000원", buffer: "충분" }),
  scenario("loan_caution", "대출", "대출 신청: 주의", "상환 부담이 조금 높은 대출", "확인 필요", 58, "매달 고정 상환액이 생활비를 압박할 수 있어요.", ["월 상환액", "총 이자", "생활비 부족"], ["월 상환 가능 금액", "총 이자", "중도상환수수료"], ["대출금은 들어오지만 매달 상환 의무가 생겨요.", "생활비 여유가 눈에 띄게 줄어요.", "예상치 못한 지출이 생기면 부담이 커져요.", "연체 시 추가 이자와 신용 불이익이 생길 수 있어요."], "금액 축소 검토", { monthly: "184,000원", total: "2,208,000원", buffer: "주의" }),
  scenario("loan_high", "대출", "소액대출 300만 원 신청", "월소득 대비 상환 부담이 높고 연체 위험이 큰 대출", "높음", 78, "월 상환액이 현재 월소득 대비 부담스러워요.", ["월 상환 부담", "연체이자", "신용점수 하락", "중도상환수수료"], ["실제 적용 금리", "월 상환 가능 금액", "연체이자율", "중도상환수수료"], ["대출금 300만 원이 들어오지만 매달 상환 의무가 생겨요.", "약 261,000원이 빠져나가 생활비 여유가 줄어들어요.", "고정지출과 상환액이 겹치면 잔액 부족 가능성이 커져요.", "연체 시 추가 이자와 신용 불이익이 생길 수 있어요."], "10분 뒤 다시 확인", { monthly: "261,000원", total: "3,132,000원", buffer: "부족 가능" }),
  scenario("card_safe", "카드", "카드 발급: 안전", "연회비 낮고 실적 조건 단순", "낮음", 32, "연회비와 실적 조건이 비교적 단순해요.", ["연회비", "결제일"], ["연회비", "전월 실적", "결제일"], ["카드 발급이 가능하고 조건이 단순해요.", "연회비 외 추가 부담은 낮아 보여요.", "평소 소비 안에서 실적을 채울 수 있어요.", "결제일 잔액만 확인하면 큰 위험은 낮아요."], "진행 가능", { monthly: "30,000원", total: "연회비 중심", buffer: "여유" }),
  scenario("card_caution", "카드", "카드 발급: 주의", "실적 조건을 못 채우면 혜택이 줄어드는 카드", "확인 필요", 54, "혜택을 받으려면 매월 일정 금액을 써야 해요.", ["실적 조건", "과소비 유도", "연회비"], ["전월 실적", "월 평균 소비", "결제일"], ["카드 발급은 가능하지만 실적 조건이 있어요.", "연회비가 청구될 수 있어요.", "실적 조건을 못 채우면 혜택이 줄어들어요.", "혜택 때문에 필요 없는 소비가 늘 수 있어요."], "3개월 지출 확인", { monthly: "400,000원 실적", total: "소비 증가 가능", buffer: "주의" }),
  scenario("card_high_revolving", "카드", "카드 발급: 리볼빙 위험", "리볼빙 자동 신청 또는 고금리 결제 이월 위험", "높음", 81, "리볼빙 또는 결제 이월 위험이 있어요.", ["리볼빙", "연체이자", "신용 영향"], ["리볼빙 신청 여부", "결제일 잔액", "이월 이자율"], ["카드 발급은 가능하지만 리볼빙 설정 확인이 필요해요.", "일부 금액이 다음 달로 밀리면 이자가 붙어요.", "반복되면 갚아야 할 금액이 빠르게 커져요.", "결제 실패와 신용 불이익이 이어질 수 있어요."], "리볼빙 해제 확인", { monthly: "결제액 변동", total: "이자 누적", buffer: "부족 가능" }),
  scenario("terms_privacy", "약관", "개인정보 동의", "제3자 제공, 마케팅 수신, 보관 기간 위험", "높음", 70, "선택 동의가 많고 제3자 제공 범위가 넓어요.", ["제3자 제공", "마케팅 수신", "보관 기간"], ["필수 동의", "선택 동의", "철회 방법"], ["동의하면 여러 회사가 정보를 받을 수 있어요.", "제휴사 광고나 상품 추천이 늘 수 있어요.", "여러 회사가 내 정보를 활용할 수 있어요.", "원하지 않는 정보 활용을 뒤늦게 철회해야 할 수 있어요."], "선택 동의 해제", { monthly: "-", total: "정보 활용 증가", buffer: "확인 필요" }),
  scenario("terms_auto_renewal", "약관", "자동갱신 약관", "무료 체험 후 자동결제 발생 가능", "확인 필요", 60, "무료 체험 뒤 자동결제가 이어질 수 있어요.", ["자동갱신", "해지 기한", "결제일"], ["무료 기간 종료일", "해지 방법", "알림 설정"], ["무료로 시작하지만 결제 예약이 생길 수 있어요.", "해지하지 않으면 첫 결제가 발생할 수 있어요.", "여러 달 누적되면 예상보다 큰 비용이 돼요.", "해지 경로를 찾지 못해 원치 않는 결제가 이어질 수 있어요."], "캘린더 알림 설정", { monthly: "월 14,900원", total: "44,700원", buffer: "주의" }),
  scenario("transfer_safe", "송금", "송금: 안전", "기존 거래 상대, 계좌명 일치", "낮음", 18, "기존 거래 상대이고 계좌명도 일치해요.", ["큰 위험 없음"], ["금액", "받는 사람", "계좌명"], ["거래 상대와 계좌명이 일치해요.", "기존 거래 이력과 맞아요.", "분쟁 가능성은 낮아 보여요.", "그래도 금액과 이름을 한 번 더 확인하세요."], "진행 가능", { monthly: "-", total: "350,000원", buffer: "정상" }),
  scenario("transfer_caution", "송금", "송금: 확인 필요", "처음 보내는 계좌, 중고거래 맥락", "확인 필요", 62, "처음 보내는 계좌예요.", ["착오송금", "거래 이력 없음", "대화 내역 부족"], ["상대 이름", "계좌 명의", "거래 물품"], ["처음 보내는 계좌라 기록이 없어요.", "송금하면 회수에 시간이 걸릴 수 있어요.", "분쟁 시 대화 내역이 필요해요.", "상대 확인 없이 보내면 착오송금이나 사기 위험이 있어요."], "상대 확인 후 진행", { monthly: "-", total: "350,000원", buffer: "회수 지연" }),
  scenario("transfer_high_mismatch", "송금", "송금: 명의 불일치", "거래 상대와 계좌 명의가 다름", "높음", 82, "거래 상대와 계좌 명의가 달라요.", ["계좌 명의 불일치", "사기", "회수 어려움"], ["받는 사람", "계좌 주인", "대화 내역"], ["거래 상대와 계좌명이 달라요.", "돈을 보내면 회수하기 어려울 수 있어요.", "분쟁이 생기면 대화와 송금 기록이 필요해요.", "물건을 받지 못하고 신고 절차를 진행해야 할 수 있어요."], "보류 권장", { monthly: "-", total: "350,000원", buffer: "회수 어려움" }),
  scenario("transfer_high_urgent", "송금", "송금: 급박한 요구", "택배, 환불, 예약금을 급하게 요구", "긴급", 91, "급하게 돈을 보내라고 요구하고 있어요.", ["피싱", "사기", "압박 메시지"], ["상대 신원", "계좌명", "요구 사유"], ["상대가 시간을 압박하고 있어요.", "송금 직후 연락이 끊길 수 있어요.", "증거가 부족하면 회수가 어려워요.", "사기 가능성이 높아 지금 멈추는 것을 권장해요."], "신고자료 정리하기", { monthly: "-", total: "예약금 손실 가능", buffer: "긴급" }),
  scenario("receive_safe", "입금", "입금: 안전", "등록된 거래처 또는 기존 거래 상대 입금", "낮음", 20, "등록된 거래와 일치하는 입금이에요.", ["큰 위험 없음"], ["입금자명", "거래명", "금액"], ["등록한 거래와 입금자명이 맞아요.", "정상 입금으로 볼 수 있어요.", "거래 기록과도 일치해요.", "정상 입금으로 받은 기록을 남길 수 있어요."], "정상 입금으로 받기", { monthly: "-", total: "500,000원", buffer: "정상" }),
  scenario("receive_unknown", "입금", "입금: 확인 필요", "모르는 사람의 입금", "확인 필요", 55, "모르는 사람의 입금이에요.", ["착오입금", "분쟁", "반환 요청"], ["입금자", "금액", "거래 맥락"], ["모르는 입금이 들어왔어요.", "바로 사용하지 않는 것이 좋아요.", "반환 요청이 오면 원입금 기준을 확인해야 해요.", "다른 계좌로 보내면 분쟁에 휘말릴 수 있어요."], "보류", { monthly: "-", total: "500,000원", buffer: "보류 권장" }),
  scenario("receive_high_thirdparty", "입금", "입금: 삼자사기 의심", "거래 상대와 입금자명이 다르고 반환 요구", "높음", 84, "거래 상대와 입금자명이 달라요.", ["삼자사기", "통장협박", "원입금 반환"], ["등록 거래 상대", "입금자명", "반환 요청 계좌"], ["등록한 거래 상대와 입금자명이 달라요.", "바로 사용하지 않는 것이 안전해요.", "다른 계좌로 돌려달라는 요구가 위험 신호예요.", "삼자사기 또는 통장협박 문제로 계좌가 불편해질 수 있어요."], "신고자료 정리하기", { monthly: "-", total: "500,000원", buffer: "분쟁 가능" }),
  scenario("receive_high_blackmail", "입금", "입금: 통장협박 의심", "소액 입금 후 계좌 정지 위협 또는 신고 언급", "긴급", 94, "입금 직후 계좌 정지 위협이 있어요.", ["통장협박", "계좌 정지 위협", "신고 언급"], ["입금자", "협박 메시지", "반환 요구"], ["소액 입금 후 위협 메시지가 왔어요.", "돈을 옮기지 말고 기록을 남겨야 해요.", "상대 요구대로 보내면 분쟁에 휘말릴 수 있어요.", "즉시 상담 또는 신고자료 정리가 필요해요."], "신고자료 정리하기", { monthly: "-", total: "소액 입금", buffer: "긴급" }),
  scenario("autopay_safe", "자동이체", "자동이체: 안전", "월 고정비가 낮고 잔액 여유 있음", "낮음", 30, "월 고정 지출 증가가 크지 않아요.", ["고정비 증가"], ["결제일", "월 금액", "평균 잔액"], ["매월 고정적으로 돈이 빠져나가요.", "잔액 여유가 충분해 보여요.", "3개월 누적 비용도 부담이 낮아요.", "사용하지 않는 서비스인지 주기적으로 확인하세요."], "진행 가능", { monthly: "월 19,900원", total: "59,700원", buffer: "충분" }),
  scenario("autopay_caution", "자동이체", "자동이체: 주의", "매월 고정지출이 증가", "확인 필요", 57, "매월 빠져나가는 돈이 늘어나요.", ["잔액 부족", "고정비 증가", "해지 누락"], ["결제일", "해지 방법", "월 예산"], ["매월 89,000원이 빠져나가요.", "잔액 여유가 줄어들 수 있어요.", "사용하지 않는 구독이면 누적 비용이 커져요.", "잔액 부족으로 결제 실패가 생길 수 있어요."], "다음 월 예산 확인", { monthly: "월 89,000원", total: "267,000원", buffer: "주의" }),
  scenario("autopay_high", "자동이체", "자동이체: 고위험", "결제일 잔액 부족 가능성이 큼", "높음", 76, "결제일에 잔액 부족 가능성이 높아요.", ["연체", "수수료", "신용 영향"], ["결제일 잔액", "고정지출", "해지 방법"], ["새 자동이체가 고정지출에 추가돼요.", "결제일에 잔액 부족 가능성이 있어요.", "3개월 누적되면 예산을 압박할 수 있어요.", "결제 실패 또는 연체가 생길 수 있어요."], "보류", { monthly: "월 89,000원", total: "267,000원", buffer: "부족 가능" }),
  scenario("spending_delivery_high", "소비", "배달 결제: 식비 예산 초과", "이번 주 식비 잔액보다 큰 심야 배달 결제", "높음", 74, "이 결제를 하면 이번 주 식비 예산을 넘어요.", ["생활비 침범", "심야 결제", "반복 소비"], ["이번 주 식비 잔액", "내일 대체 식사", "이번 달 지켜낸 금액"], ["지금 28,000원을 결제하면 식비 잔액을 초과해요.", "내일 점심 예산이 12,000원 아래로 줄어들어요.", "반복되면 이번 달 생활비 보호 금액을 깨야 할 수 있어요.", "월말에 교통비나 통신비 납부가 부담될 수 있어요."], "10분 뒤 다시 확인", { monthly: "-", total: "28,000원", buffer: "식비 초과" }),
  scenario("business_deposit_mismatch", "사업자입금", "사업자 입금: 거래처명 불일치", "등록 거래처와 입금자명이 다른 정산 입금", "확인 필요", 63, "등록된 거래처명과 입금자명이 달라요.", ["거래처명 불일치", "정산 오류", "제3계좌 반환 요구"], ["세금계산서 금액", "계약서 지급일", "입금자명"], ["입금은 들어왔지만 등록 거래처명과 달라요.", "정산 담당자에게 확인이 필요해요.", "계약서·견적서 금액과 맞지 않으면 분쟁 기록이 필요해요.", "다른 계좌 반환 요구가 있으면 의심입금으로 보류해야 해요."], "거래처에 확인 요청", { monthly: "-", total: "1,200,000원", buffer: "확인 필요" }),
  scenario("saving_safe", "적금", "적금 가입", "원금 보장, 중도해지 이율만 주의", "낮음", 26, "원금 보장형 상품으로 보여요.", ["중도해지 이율"], ["납입 기간", "중도해지 이율", "월 납입액"], ["월 납입 계획이 생겨요.", "중도해지만 피하면 안정적이에요.", "3개월 뒤에도 납입 부담이 낮아 보여요.", "급전이 필요하면 중도해지 이율이 낮을 수 있어요."], "진행 가능", { monthly: "월 100,000원", total: "300,000원", buffer: "안정" }),
  scenario("investment_high", "투자", "투자상품 가입", "원금손실 가능성, 환매 제한", "높음", 86, "원금손실 가능성이 있어요.", ["원금손실", "환매 제한", "수수료"], ["투자 위험 등급", "환매 가능일", "손실 가능 범위"], ["투자를 시작하면 원금이 변동될 수 있어요.", "시장 상황에 따라 손실이 생길 수 있어요.", "환매 제한이 있으면 바로 돈을 빼기 어려워요.", "급히 돈이 필요할 때 손실을 보고 팔아야 할 수 있어요."], "잠시 멈추기", { monthly: "-", total: "손실 가능", buffer: "제한" })
];

export const categories = ["전체", "약관", "대출", "카드", "송금", "입금", "자동이체", "소비", "사업자입금", "적금", "투자"];

export const quickActions = [
  { category: "약관", title: "약관 분석", copy: "제3자 제공과 자동갱신 확인" },
  { category: "대출", title: "대출 돈흐름 미리보기", copy: "상환 부담과 연체 위험 보기" },
  { category: "송금", title: "송금 체크", copy: "명의 불일치와 급박 요구 감지" },
  { category: "입금", title: "이 입금 확인하기", copy: "받기, 보류, 돌려주기, 신고자료 정리" },
  { category: "자동이체", title: "자동이체 체크", copy: "결제일 잔액 부족 예측" },
  { category: "소비", title: "생활비 침범 확인", copy: "충동소비와 지켜낸 금액 보기" },
  { category: "투자", title: "투자상품 체크", copy: "원금손실과 환매 제한 확인" }
];

export const workflowGroups = [
  { id: "all", label: "전체", summary: "모든 앱 흐름" },
  { id: "setup", label: "시작·설정", summary: "온보딩, 보호수준, 사용자 유형" },
  { id: "risk", label: "위험진단", summary: "약관·대출·카드·송금 입력과 위험도 카드" },
  { id: "money", label: "돈흐름", summary: "1개월 뒤, 3개월 뒤, 최악 상황 예측" },
  { id: "living", label: "생활비", summary: "필수 생활비 보호, 충동소비 잠시멈춤, 절약 기록" },
  { id: "trade", label: "거래안전", summary: "송금, 의심입금, 사업자 입금, 고위험 거래 멈춤" },
  { id: "records", label: "기록·신고", summary: "신고용 기록 묶음과 과거 이력" }
];

export const workflows = [
  {
    id: "WF-00",
    group: "setup",
    title: "온보딩 및 보호 설정",
    purpose: "사용자의 금융 취약 지점과 보호 수준을 설정합니다.",
    primaryAction: "보호모드 켜기",
    screen: "onboarding",
    steps: ["사용자 유형 선택", "보호목표 선택", "생활비 입력", "보호모드 설정", "홈 화면 진입"]
  },
  {
    id: "WF-01",
    group: "risk",
    title: "금융행동 위험진단 기본",
    purpose: "하려는 금융 행동을 인식하고 위험도를 카드로 보여줍니다.",
    primaryAction: "위험 확인하기",
    screen: "input",
    category: "전체",
    steps: ["입력 방식 선택", "샘플 시나리오 선택", "AI 분석", "위험도 카드 생성"]
  },
  {
    id: "WF-02",
    group: "risk",
    title: "약관 위험진단",
    purpose: "긴 약관에서 꼭 봐야 할 위험 조항만 뽑아 쉬운 말로 설명합니다.",
    primaryAction: "핵심 위험 보기",
    screen: "input",
    category: "약관",
    scenarioId: "terms_privacy",
    steps: ["약관 업로드", "위험 조항 추출", "쉬운말 핵심설명", "가입 보류 또는 이해 완료"]
  },
  {
    id: "WF-03",
    group: "money",
    title: "대출 돈흐름 미리보기",
    purpose: "대출 실행 전 월 상환 부담과 최악의 상황을 보여줍니다.",
    primaryAction: "돈흐름 미리보기",
    screen: "dryrun",
    category: "대출",
    scenarioId: "loan_high",
    steps: ["대출 정보 입력", "월 상환액 계산", "1개월 뒤", "3개월 뒤", "최악의 상황"]
  },
  {
    id: "WF-04",
    group: "money",
    title: "카드 발급 및 리볼빙 위험",
    purpose: "카드 발급, 리볼빙, 실적 조건, 연회비의 위험을 보여줍니다.",
    primaryAction: "리볼빙 없이 확인",
    screen: "dryrun",
    category: "카드",
    scenarioId: "card_high_revolving",
    steps: ["연회비·실적 조건 분석", "리볼빙 여부 확인", "월 예상 결제액 예측", "발급 보류"]
  },
  {
    id: "WF-05",
    group: "money",
    title: "자동이체·구독 결제 점검",
    purpose: "자동이체와 구독이 월 고정지출을 늘리는지 확인합니다.",
    primaryAction: "구독 목록 확인",
    screen: "dryrun",
    category: "자동이체",
    scenarioId: "autopay_caution",
    steps: ["자동이체 등록", "월 고정지출 반영", "구독 누적 경고", "등록 보류"]
  },
  {
    id: "WF-06",
    group: "living",
    title: "생활비 보호모드 설정",
    purpose: "필수 생활비를 먼저 보호하고 실제로 써도 되는 금액만 보여줍니다.",
    primaryAction: "생활비 보호 시작",
    screen: "living",
    steps: ["월수입 입력", "필수 지출 입력", "보호 금액 계산", "남은돈 숨김"]
  },
  {
    id: "WF-07",
    group: "living",
    title: "충동소비 잠시멈춤",
    purpose: "배달, 쇼핑, 게임결제, 구독 등 비필수 소비 전 대기 시간을 제공합니다.",
    primaryAction: "잠시 멈추기",
    screen: "guard",
    category: "소비",
    scenarioId: "spending_delivery_high",
    steps: ["소비 발생", "생활비 영향 계산", "사유 입력", "10분 뒤 다시 확인", "결제 취소"]
  },
  {
    id: "WF-08",
    group: "living",
    title: "절약 성공 기록",
    purpose: "잠시멈춤으로 보류·취소한 금액을 성과로 보여줍니다.",
    primaryAction: "지켜낸 금액 보기",
    screen: "living",
    steps: ["소비 보류", "절약 금액 계산", "이번 달 지켜낸 금액 업데이트", "생활비 홈 반영"]
  },
  {
    id: "WF-09",
    group: "trade",
    title: "송금 전 위험확인",
    purpose: "송금 버튼 전 사기 가능성과 계좌 명의 불일치를 점검합니다.",
    primaryAction: "위험 확인하기",
    screen: "input",
    category: "송금",
    scenarioId: "transfer_high_mismatch",
    steps: ["수취인명 확인", "거래 상대와 계좌 명의 비교", "거래 목적 확인", "잠시멈춤"]
  },
  {
    id: "WF-10",
    group: "trade",
    title: "의심입금 안전확인",
    purpose: "모르는 입금을 바로 사용하지 않고 받기·보류·반환·신고 중 선택하게 합니다.",
    primaryAction: "이 입금 안전확인",
    screen: "receive",
    category: "입금",
    scenarioId: "receive_high_thirdparty",
    steps: ["입금자명 분석", "거래 등록 내역 매칭", "위험 키워드 확인", "신고자료 정리"]
  },
  {
    id: "WF-11",
    group: "trade",
    title: "프리랜서·소상공인 입금 점검",
    purpose: "거래처 사칭, 정산 오류, 의심입금으로 인한 계좌 리스크를 줄입니다.",
    primaryAction: "거래처 확인하기",
    screen: "input",
    category: "사업자입금",
    scenarioId: "business_deposit_mismatch",
    steps: ["거래처명 비교", "세금계산서 금액 비교", "계약서 매칭", "의심입금 보류"]
  },
  {
    id: "WF-12",
    group: "trade",
    title: "위험거래 잠시멈춤 공통",
    purpose: "위험도가 높은 행동을 즉시 실행하지 않고 한 번 더 생각하게 합니다.",
    primaryAction: "잠시 멈추기",
    screen: "guard",
    category: "송금",
    scenarioId: "transfer_high_urgent",
    steps: ["위험도 높음", "핵심 위험 표시", "사유 입력", "10분 뒤 다시 확인", "신고자료 정리"]
  },
  {
    id: "WF-13",
    group: "records",
    title: "신고기록 자동정리",
    purpose: "위험 경고와 선택을 상담·신고·분쟁 대응용 기록으로 정리합니다.",
    primaryAction: "신고자료 정리하기",
    screen: "evidence",
    category: "입금",
    scenarioId: "receive_high_blackmail",
    steps: ["거래 정보 수집", "위험 경고 이력 수집", "대화 캡처 첨부", "신고용 기록 묶음 생성"]
  },
  {
    id: "WF-14",
    group: "records",
    title: "기록 탭 조회",
    purpose: "과거 위험진단, 잠시멈춤, 신고기록, 절약기록을 확인합니다.",
    primaryAction: "기록 보기",
    screen: "history",
    steps: ["전체 기록", "보류한 거래", "신고용 기록", "절약 성공 기록", "상세 보기"]
  },
  {
    id: "WF-15",
    group: "setup",
    title: "설정 및 보호수준 조정",
    purpose: "상황에 맞게 경고 강도와 설명 방식을 조절합니다.",
    primaryAction: "설정 바꾸기",
    screen: "settings",
    steps: ["쉬운말 단계", "보호모드", "쿨링오프 시간", "입금 경고 기준", "알림 방식"]
  }
];

export const testSuites = [
  {
    id: "core",
    title: "6대 핵심 기능",
    copy: "위험진단, 쉬운말 설명, 돈흐름, 생활비, 잠시멈춤, 신고기록을 빠르게 확인합니다.",
    workflowIds: ["WF-01", "WF-02", "WF-03", "WF-06", "WF-12", "WF-13"]
  },
  {
    id: "money",
    title: "돈흐름 시나리오",
    copy: "대출, 카드, 자동이체, 소비가 생활비에 미치는 영향을 확인합니다.",
    workflowIds: ["WF-03", "WF-04", "WF-05", "WF-07"],
    scenarioIds: ["loan_high", "card_high_revolving", "autopay_caution", "spending_delivery_high"]
  },
  {
    id: "trade",
    title: "거래 안전 시나리오",
    copy: "송금 명의 불일치, 의심입금, 사업자 입금, 긴급 송금을 확인합니다.",
    workflowIds: ["WF-09", "WF-10", "WF-11", "WF-12"],
    scenarioIds: ["transfer_high_mismatch", "receive_high_thirdparty", "business_deposit_mismatch", "transfer_high_urgent"]
  },
  {
    id: "records",
    title: "기록·신고 시나리오",
    copy: "보류, 취소, 신고용 기록 묶음, 기록 탭 조회를 확인합니다.",
    workflowIds: ["WF-13", "WF-14"],
    scenarioIds: ["receive_high_blackmail", "transfer_high_urgent"]
  }
];
