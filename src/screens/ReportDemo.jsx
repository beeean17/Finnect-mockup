import React, { useState } from "react";
import { reportDemo } from "../data/demoScenarios";
import { Badge, DemoNotice, InfoCard, KeyValueList, PrimaryButton, Screen, TopBar } from "../components/DemoLayout";

export default function ReportDemo({ onNavigate }) {
  const [saved, setSaved] = useState(false);

  return (
    <Screen>
      <TopBar title="신고기록 자동정리" step="신고용 기록 묶음" onHome={() => onNavigate("home")} />
      <InfoCard title="신고용 기록이 생성되었습니다" tone="safe">
        <Badge tone={saved ? "safe" : "primary"}>{saved ? "저장됨" : "가상 데이터 기반 데모"}</Badge>
        <p>{reportDemo.result}</p>
      </InfoCard>

      <InfoCard title="사건 요약">
        <p>{reportDemo.summary}</p>
        <p>{reportDemo.userChoice}</p>
      </InfoCard>

      <InfoCard title="위험 신호">
        <ul className="clean-list">
          {reportDemo.riskSignals.map((signal) => <li key={signal}>{signal}</li>)}
        </ul>
      </InfoCard>

      <InfoCard title="거래 정보">
        <KeyValueList items={reportDemo.transaction} />
      </InfoCard>

      <InfoCard title="시간순 기록">
        <ol className="number-list timeline-list">
          {reportDemo.timeline.map((item) => <li key={item}>{item}</li>)}
        </ol>
      </InfoCard>

      <div className="button-stack">
        <PrimaryButton onClick={() => setSaved(true)}>신고용 기록 저장</PrimaryButton>
        <PrimaryButton tone="ghost" onClick={() => onNavigate("home")}>홈으로 돌아가기</PrimaryButton>
      </div>
      <DemoNotice />
    </Screen>
  );
}