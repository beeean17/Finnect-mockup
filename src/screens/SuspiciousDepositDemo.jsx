import React, { useState } from "react";
import { depositDemo } from "../data/demoScenarios";
import { ActionResult, Badge, DemoNotice, InfoCard, KeyValueList, PrimaryButton, ScenarioSwitch, Screen, TopBar } from "../components/DemoLayout";

export default function SuspiciousDepositDemo({ onNavigate }) {
  const [scenarioKey, setScenarioKey] = useState("normal");
  const [selectedAction, setSelectedAction] = useState("");
  const scenario = depositDemo[scenarioKey];
  const options = Object.entries(depositDemo).map(([id, item]) => ({ id, label: item.label }));
  const isDanger = scenarioKey !== "normal";

  function changeScenario(next) {
    setScenarioKey(next);
    setSelectedAction("");
  }

  function handleAction(cta) {
    if (cta.includes("신고")) {
      onNavigate("report");
      return;
    }
    setSelectedAction(cta);
  }

  function resultMessage() {
    if (!selectedAction) return "";
    if (scenarioKey === "normal") return "소액 정상 거래로 판단되어 추가 마찰 없이 수락할 수 있습니다.";
    if (selectedAction.includes("콜센터")) return "앱에 뜬 번호가 아니라 은행 공식 콜센터로 확인하는 흐름입니다.";
    if (selectedAction.includes("112")) return "보이스피싱 의심 상황으로 신고와 계좌 보류에 필요한 기록을 남깁니다.";
    if (selectedAction.includes("취소")) return "제3의 계좌로 보내려던 송금을 멈추고 입금액을 사용하지 않도록 안내합니다.";
    if (selectedAction.includes("보류")) return "물건 발송 또는 환불을 보류하고 상대방 본인 확인을 먼저 요청합니다.";
    if (selectedAction.includes("환불")) return "임의의 다른 계좌가 아니라 원송금 계좌 기준으로만 처리해야 한다는 안내를 남깁니다.";
    return "선택을 기록했습니다. 실제 송금·수락·신고 접수 기능은 없는 목업입니다.";
  }

  return (
    <Screen>
      <TopBar title="의심입금 안전판단" step="수락/보류/신고 선택" onHome={() => onNavigate("home")} />
      <ScenarioSwitch options={options} active={scenarioKey} onChange={changeScenario} />

      <InfoCard title={scenario.title} tone={scenario.tone}>
        <Badge tone={scenario.tone}>{scenario.riskLevel}</Badge>
        <p>{scenario.user}</p>
        <p>{scenario.message}</p>
      </InfoCard>

      <InfoCard title="입금 정보">
        <KeyValueList items={scenario.input} />
      </InfoCard>

      <InfoCard title="AI 판단 근거">
        <div className="score-card"><span>위험 점수</span><strong>{scenario.score}</strong></div>
        <ul className="clean-list">{scenario.signals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
      </InfoCard>

      <div className="button-stack">
        {scenario.ctas.map((cta, index) => <PrimaryButton key={cta} tone={isDanger && (cta.includes("신고") || cta.includes("취소") || index === 0) ? "danger" : index === 0 ? "primary" : "ghost"} onClick={() => handleAction(cta)}>{cta}</PrimaryButton>)}
      </div>
      <ActionResult action={selectedAction} tone={isDanger ? "warn" : "safe"}>{resultMessage()}</ActionResult>
      <DemoNotice />
    </Screen>
  );
}