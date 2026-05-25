import React, { useState } from "react";
import { easyExplainDemo } from "../data/demoScenarios";
import { ActionResult, Badge, DemoNotice, InfoCard, KeyValueList, PrimaryButton, ScenarioSwitch, Screen, TopBar } from "../components/DemoLayout";

export default function EasyExplainDemo({ onNavigate }) {
  const [scenarioKey, setScenarioKey] = useState("normal");
  const [selectedAction, setSelectedAction] = useState("");
  const scenario = easyExplainDemo[scenarioKey];
  const options = Object.entries(easyExplainDemo).map(([id, item]) => ({ id, label: item.label }));
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
    if (scenarioKey === "normal") return "필요한 비용과 책임을 이해한 상태로 발급을 이어갈 수 있습니다.";
    if (selectedAction.includes("정책")) return "대부업 전체 동의 대신 대안 상품을 먼저 비교하는 흐름으로 전환했습니다.";
    if (selectedAction.includes("항목별")) return "필수 동의와 선택 동의, 숨은 비용을 따로 확인하는 상태입니다.";
    if (selectedAction.includes("그래도")) return "위험을 확인했다는 기록만 남기는 목업 상태입니다. 실제 동의 기능은 없습니다.";
    return "약관의 숨은 비용을 확인하고 결정을 보류했습니다.";
  }

  return (
    <Screen>
      <TopBar title="쉬운말 핵심설명" step="약관을 일상 언어로" onHome={() => onNavigate("home")} />
      <ScenarioSwitch options={options} active={scenarioKey} onChange={changeScenario} />

      <InfoCard title={scenario.title} tone={scenarioKey === "abnormal" ? "danger" : "safe"}>
        <div className="document-meta">{scenario.documentMeta.map((item) => <span key={item}>{item}</span>)}</div>
        <p>{scenario.user}</p>
      </InfoCard>

      {scenario.costRows && <InfoCard title="실제로 내야 할 돈" tone="warn"><KeyValueList items={scenario.costRows} /><p className="sample-text">{scenario.effectiveRate}</p></InfoCard>}

      <InfoCard title="쉬운말 핵심설명">
        <div className="explain-list">
          {scenario.summary.map((item) => <article className={`explain-item ${item.tone}`} key={item.title}><Badge tone={item.tone}>{item.tone === "safe" ? "정보" : item.tone === "warn" ? "주의" : "위험"}</Badge><strong>{item.title}</strong><p>{item.text}</p></article>)}
        </div>
      </InfoCard>

      <InfoCard title="결과"><p>{scenario.result}</p></InfoCard>

      <div className="button-stack">
        {scenario.ctas.map((cta, index) => <PrimaryButton key={cta} tone={scenarioKey === "abnormal" && index === 0 ? "danger" : index === 0 ? "primary" : "ghost"} onClick={() => handleAction(cta)}>{cta}</PrimaryButton>)}
      </div>
      <ActionResult action={selectedAction} tone={resultTone}>{resultMessage()}</ActionResult>
      <DemoNotice />
    </Screen>
  );
}