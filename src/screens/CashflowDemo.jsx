import React, { useState } from "react";
import { cashflowDemo } from "../data/demoScenarios";
import { ActionResult, Badge, DemoNotice, InfoCard, KeyValueList, PrimaryButton, ScenarioSwitch, Screen, TopBar } from "../components/DemoLayout";

export default function CashflowDemo({ onNavigate }) {
  const [scenarioKey, setScenarioKey] = useState("normal");
  const [selectedAction, setSelectedAction] = useState("");
  const scenario = cashflowDemo[scenarioKey];
  const options = Object.entries(cashflowDemo).map(([id, item]) => ({ id, label: item.label }));
  const resultTone = scenarioKey === "abnormal" ? "warn" : "safe";

  function changeScenario(next) {
    setScenarioKey(next);
    setSelectedAction("");
  }

  function resultMessage() {
    if (!selectedAction) return "";
    if (scenarioKey === "normal") return "미래 부담이 안전 범위라 결제를 진행할 수 있는 목업 상태입니다.";
    if (selectedAction.includes("3개월")) return "지금 사지 않아도 늦지 않다는 선택을 만들고, 3개월 뒤 다시 판단하도록 보류했습니다.";
    if (selectedAction.includes("대안")) return "비슷한 만족을 주는 더 낮은 가격의 선택지를 비교하는 흐름입니다.";
    if (selectedAction.includes("24개월")) return "월 부담은 낮아지지만 갚는 기간이 길어진다는 점을 다시 확인해야 합니다.";
    return "돈흐름을 확인한 뒤 선택을 기록했습니다. 실제 결제 기능은 없습니다.";
  }

  return (
    <Screen>
      <TopBar title="돈흐름 미리보기" step="1개월/3개월/최악" onHome={() => onNavigate("home")} />
      <ScenarioSwitch options={options} active={scenarioKey} onChange={changeScenario} />

      <InfoCard title={scenario.title} tone={scenarioKey === "abnormal" ? "danger" : "safe"}>
        <p>{scenario.user}</p>
        <KeyValueList items={scenario.input} />
      </InfoCard>

      <div className="timeline-cards scenario-timeline">
        {scenario.timeline.map((item) => <InfoCard key={item.title} title={item.title} tone={item.tone}><Badge tone={item.tone}>{item.level}</Badge><p>{item.text}</p></InfoCard>)}
      </div>

      <InfoCard title="비교"><p>{scenario.comparison}</p></InfoCard>

      <div className="button-stack">
        {scenario.ctas.map((cta, index) => <PrimaryButton key={cta} tone={scenarioKey === "abnormal" && index === 1 ? "danger" : index === 0 ? "primary" : "ghost"} onClick={() => setSelectedAction(cta)}>{cta}</PrimaryButton>)}
      </div>
      <ActionResult action={selectedAction} tone={resultTone}>{resultMessage()}</ActionResult>
      <DemoNotice />
    </Screen>
  );
}