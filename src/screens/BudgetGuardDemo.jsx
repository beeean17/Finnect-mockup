import React, { useMemo, useState } from "react";
import { budgetDemo } from "../data/demoScenarios";
import { ActionResult, Badge, DemoNotice, InfoCard, KeyValueList, MetricCard, PrimaryButton, ScenarioSwitch, Screen, TopBar } from "../components/DemoLayout";

export default function BudgetGuardDemo({ onNavigate }) {
  const [scenarioKey, setScenarioKey] = useState("normal");
  const [subscriptionsLinked, setSubscriptionsLinked] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const scenario = budgetDemo[scenarioKey];
  const options = ["normal", "abnormal"].map((id) => ({ id, label: budgetDemo[id].label }));
  const subscriptionDays = useMemo(() => new Map(budgetDemo.subscriptions.items.map((item) => [item.day, item])), []);
  const calendarDays = Array.from({ length: 31 }, (_, index) => index + 1);
  const resultTone = scenarioKey === "abnormal" ? "warn" : "safe";

  function changeScenario(next) {
    setScenarioKey(next);
    setSelectedAction("");
  }

  function resultMessage() {
    if (!selectedAction) return "";
    if (scenarioKey === "normal") return "실제 사용 가능 금액을 확인한 뒤 예산 관리 행동을 기록했습니다.";
    if (selectedAction.includes("다음 달")) return "통장 잔액을 전부 내 돈처럼 쓰지 않고, 큰 결제를 다음 월급 이후로 미뤘습니다.";
    if (selectedAction.includes("할부")) return "일시불 위험을 낮추기 위해 월 부담으로 나눠 다시 계산하는 흐름입니다.";
    if (selectedAction.includes("예산")) return "자동차 보험, 환갑, 결혼식 같은 미래 지출을 다시 확인합니다.";
    return "위험을 확인했지만 강행 선택은 기록만 남기는 목업 상태입니다. 실제 결제 기능은 없습니다.";
  }

  return (
    <Screen>
      <TopBar title="생활비 보호모드" step="잔액이 아니라 사용 가능 금액" onHome={() => onNavigate("home")} />
      <ScenarioSwitch options={options} active={scenarioKey} onChange={changeScenario} />

      <InfoCard title={scenario.title} tone={scenarioKey === "abnormal" ? "danger" : "safe"}>
        <Badge tone={scenarioKey === "abnormal" ? "danger" : "safe"}>{scenarioKey === "abnormal" ? "즉시 확인 권장" : "정상"}</Badge>
        <p>{scenario.user}</p>
        <p>{scenario.message}</p>
        <div className="stat-grid two compact">
          <MetricCard label="현재 잔액" value={scenario.currentBalance} tone="primary" />
          <MetricCard label="실제 사용 가능" value={scenario.available} tone={scenarioKey === "abnormal" ? "danger" : "safe"} />
          <MetricCard label="하루 권장 사용액" value={scenario.dailyBudget} tone={scenarioKey === "abnormal" ? "danger" : "safe"} />
        </div>
        <KeyValueList items={scenario.essentials} />
      </InfoCard>

      <InfoCard title="구독 지출 관리" tone={subscriptionsLinked ? "warn" : "default"}>
        <div className="subscription-head">
          <div><Badge tone={subscriptionsLinked ? "warn" : "primary"}>{subscriptionsLinked ? "가상 연동 완료" : "간단 연동"}</Badge><p>정기결제일과 월 구독 총액을 생활비 계산에 함께 반영해요.</p></div>
          {!subscriptionsLinked && <button className="guide-button" onClick={() => setSubscriptionsLinked(true)}>구독 정보 불러오기</button>}
        </div>
        {subscriptionsLinked ? (
          <div className="subscription-panel">
            <div className="stat-grid two compact"><MetricCard label="이번 달 구독 총액" value={budgetDemo.subscriptions.total} tone="warn" /><MetricCard label="구독 예정" value={budgetDemo.subscriptions.count} tone="primary" /></div>
            <div className="next-payment"><span>다음 결제</span><strong>{budgetDemo.subscriptions.nextPayment}</strong></div>
            <div className="subscription-calendar" aria-label="5월 구독 캘린더"><div className="calendar-header"><strong>{budgetDemo.subscriptions.month} 구독 캘린더</strong><span>결제일 표시</span></div><div className="calendar-weekdays">{["일", "월", "화", "수", "목", "금", "토"].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{calendarDays.map((day) => { const subscription = subscriptionDays.get(day); return <div className={subscription ? "calendar-day has-subscription" : "calendar-day"} key={day}><span>{day}</span>{subscription && <b>{subscription.name}</b>}</div>; })}</div></div>
            <div className="subscription-list">{budgetDemo.subscriptions.items.map((item) => <article key={item.name}><div><strong>{item.day}일</strong><span>{item.name}</span></div><b>{item.amount}</b></article>)}</div>
          </div>
        ) : <p className="muted-note">목업에서는 실제 계정 연결 없이 샘플 구독 데이터로 보여줍니다.</p>}
      </InfoCard>

      <div className="button-stack">
        {scenario.ctas.map((cta, index) => <PrimaryButton key={cta} tone={scenarioKey === "abnormal" && index === 1 ? "danger" : index === 0 ? "primary" : "ghost"} onClick={() => setSelectedAction(cta)}>{cta}</PrimaryButton>)}
      </div>
      <ActionResult action={selectedAction} tone={resultTone}>{resultMessage()}</ActionResult>
      <DemoNotice />
    </Screen>
  );
}