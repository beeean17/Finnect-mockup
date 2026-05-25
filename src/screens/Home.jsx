import React from "react";
import { demoCards, homeStats } from "../data/demoScenarios";
import { Badge, DemoNotice, MetricCard, Screen } from "../components/DemoLayout";

export default function Home({ onNavigate }) {
  return (
    <Screen>
      <header className="hero-block">
        <Badge>공모전 심사용 데모</Badge>
        <h1>Finnect Guard</h1>
        <p>금융 버튼을 누르기 전, 위험을 먼저 보여주는 AI 금융 안전벨트</p>
      </header>

      <section className="stat-grid" aria-label="오늘의 상태">
        {homeStats.map((item) => (
          <MetricCard key={item.label} label={item.label} value={item.value} tone={item.tone} />
        ))}
      </section>

      <section className="demo-section">
        <div className="section-heading">
          <h2>바로 체험하기</h2>
          <span>1분 안에 핵심 가치 확인</span>
        </div>
        <div className="demo-card-list">
          {demoCards.map((card) => (
            <button className="scenario-entry" key={card.id} onClick={() => onNavigate(card.id)} data-testid={`demo-${card.id}`}>
              <div>
                <strong>{card.title}</strong>
                <p>{card.description}</p>
              </div>
              <span>{card.cta}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="value-card">
        <strong>누르기 전에 보여주고, 위험하면 멈추고, 문제 생기면 기록까지 남깁니다.</strong>
      </section>
      <DemoNotice />
    </Screen>
  );
}