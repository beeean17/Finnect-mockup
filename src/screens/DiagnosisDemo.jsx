import React, { useState } from "react";
import { actionRiskDemo } from "../data/demoScenarios";
import { ActionResult, Badge, DemoNotice, InfoCard, KeyValueList, MetricCard, PrimaryButton, ScenarioSwitch, Screen, TopBar } from "../components/DemoLayout";

export default function DiagnosisDemo({ onNavigate }) {
  const [scenarioKey, setScenarioKey] = useState("normal");
  const [selectedAction, setSelectedAction] = useState("");
  const scenario = actionRiskDemo[scenarioKey];
  const options = Object.entries(actionRiskDemo).map(([id, item]) => ({ id, label: item.label }));
  const resultTone = scenarioKey === "abnormal" ? "warn" : "safe";

  function changeScenario(next) {
    setScenarioKey(next);
    setSelectedAction("");
  }

  function handleAction(cta) {
    if (cta.includes("돈흐름")) {
      onNavigate("cashflow");
      return;
    }
    setSelectedAction(cta);
  }

  function resultMessage() {
    if (!selectedAction) return "";
    if (scenarioKey === "normal") return "안전한 행동으로 판단되어 추가 경고 없이 진행할 수 있습니다.";
    if (selectedAction.includes("3일")) return "카드론 실행을 즉시 진행하지 않고, 다시 생각할 시간을 확보했습니다.";
    if (selectedAction.includes("쉬운말")) return "리볼빙과 카드론이 겹치면 매달 갚을 돈이 커진다는 설명을 먼저 확인합니다.";
    if (selectedAction.includes("그래도")) return "위험을 이해했다는 확인을 남기고 진행하는 목업 상태입니다. 실제 실행 기능은 없습니다.";
    return "위험한 금융 행동을 바로 실행하지 않도록 선택을 기록했습니다.";
  }

  return (
    <Screen>
      <TopBar title="금융행동 위험진단" step="정상/위험 비교" onHome={() => onNavigate("home")} />
      <ScenarioSwitch options={options} active={scenarioKey} onChange={changeScenario} />

      <InfoCard title={scenario.title} tone={scenario.tone}>
        <Badge tone={scenario.tone}>{scenario.riskLevel}</Badge>
        <p>{scenario.user}</p>
        <p>{scenario.message}</p>
      </InfoCard>

      <InfoCard title="입력 정보">
        <KeyValueList items={scenario.input} />
      </InfoCard>

      <div className="stat-grid three compact">
        {scenario.metrics.map((item) => <MetricCard key={item.label} label={item.label} value={item.value} tone={item.tone} />)}
      </div>

      <InfoCard title="AI가 본 신호">
        <ul className="clean-list">{scenario.signals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
      </InfoCard>

      <InfoCard title="결과">
        <p>{scenario.result}</p>
      </InfoCard>

      <div className="button-stack">
        {scenario.ctas.map((cta, index) => (
          <PrimaryButton key={cta} tone={scenarioKey === "abnormal" && index === 0 ? "danger" : index === 0 ? "primary" : "ghost"} onClick={() => handleAction(cta)}>{cta}</PrimaryButton>
        ))}
      </div>
      <ActionResult action={selectedAction} tone={resultTone}>{resultMessage()}</ActionResult>
      <DemoNotice />
    </Screen>
  );
}