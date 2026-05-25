import React from "react";

export function PhoneFrame({ children, activeScreen, onNavigate }) {
  const tabs = [
    ["home", "홈", "Home"],
    ["diagnosis", "진단", "Check"],
    ["cashflow", "돈흐름", "Flow"],
    ["budget", "생활비", "Budget"],
    ["report", "기록", "Record"]
  ];

  const normalized = ["deposit", "explain"].includes(activeScreen) ? "diagnosis" : activeScreen;

  return (
    <div className="app-stage">
      <div className="phone-shell">
        <div className="phone">
          <div className="status-bar">
            <strong>9:41</strong>
            <span>LTE 87%</span>
          </div>
          <main className="viewport">{children}</main>
          <nav className="bottom-nav compact-nav" aria-label="하단 내비게이션">
            {tabs.map(([screen, label, icon]) => (
              <button
                className={normalized === screen ? "active" : ""}
                key={screen}
                onClick={() => onNavigate(screen)}
                data-testid={`nav-${screen}`}
              >
                <b aria-hidden="true">{icon}</b>
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

export function Screen({ children }) {
  return <section className="screen with-nav demo-screen">{children}</section>;
}

export function TopBar({ title, step, onHome }) {
  return (
    <header className="demo-topbar">
      <div>
        {step && <span className="step-label">{step}</span>}
        <h1>{title}</h1>
      </div>
      {onHome && (
        <button className="text-button" onClick={onHome}>
          홈으로
        </button>
      )}
    </header>
  );
}

export function ScenarioSwitch({ options, active, onChange }) {
  return (
    <div className="scenario-switch" role="tablist" aria-label="시나리오 선택">
      {options.map((option) => (
        <button
          key={option.id}
          className={active === option.id ? "active" : ""}
          onClick={() => onChange(option.id)}
          role="tab"
          aria-selected={active === option.id}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function ActionResult({ action, children, tone = "safe" }) {
  if (!action) return null;
  return (
    <article className={`action-result ${tone}`}>
      <Badge tone={tone}>선택 완료</Badge>
      <strong>{action}</strong>
      <p>{children}</p>
    </article>
  );
}

export function Badge({ tone = "primary", children }) {
  return <span className={`demo-badge ${tone}`}>{children}</span>;
}

export function MetricCard({ label, value, tone = "default" }) {
  return (
    <article className={`demo-metric ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

export function InfoCard({ title, children, tone = "default" }) {
  return (
    <article className={`demo-card ${tone}`}>
      <h2>{title}</h2>
      {children}
    </article>
  );
}

export function PrimaryButton({ children, onClick, tone = "primary", testId }) {
  return (
    <button className={`demo-button ${tone}`} onClick={onClick} data-testid={testId}>
      {children}
    </button>
  );
}

export function DemoNotice() {
  return (
    <p className="demo-notice">
      목업 시뮬레이션 · 가상 데이터 기반 데모입니다. 최종 판단은 사용자에게 있으며, 본 화면은 위험 이해를 돕는 안내입니다.
    </p>
  );
}

export function KeyValueList({ items }) {
  return (
    <dl className="key-value-list">
      {items.map(([key, value]) => (
        <div key={key}>
          <dt>{key}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}