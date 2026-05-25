import React, { useEffect, useMemo, useState } from "react";
import { categories, glossary, personas, quickActions, scenarios, testSuites, workflowGroups, workflows } from "./data";

const screenTitles = {
  splash: "Finnect Guard",
  onboarding: "보호모드 선택",
  home: "홈",
  input: "분석",
  analyzing: "분석 중",
  risk: "위험 확인 결과",
  explain: "쉬운 설명",
  dryrun: "돈흐름 미리보기",
  guard: "잠시 멈추기",
  receive: "이 입금 확인하기",
  evidence: "신고용 기록 묶음",
  money: "돈흐름",
  living: "생활비",
  test: "테스트 허브",
  history: "기록함",
  settings: "설정"
};

const riskMeta = {
  낮음: { tone: "safe", message: "지금 진행해도 큰 위험은 낮아 보여요", symbol: "✓", label: "안전 확인" },
  "확인 필요": { tone: "warn", message: "몇 가지 확인 후 진행하는 게 좋아요", symbol: "!", label: "확인 필요" },
  높음: { tone: "danger", message: "지금 바로 진행하면 손해나 분쟁이 생길 수 있어요", symbol: "!", label: "위험 신호 있음" },
  긴급: { tone: "critical", message: "사기·연체·분쟁 위험이 큽니다. 지금 멈추는 걸 권장해요", symbol: "!!", label: "즉시 중단 권장" }
};

const tabs = [
  { screen: "home", label: "홈", icon: "⌂" },
  { screen: "input", label: "위험진단", icon: "⌕" },
  { screen: "money", label: "돈흐름", icon: "↗" },
  { screen: "living", label: "생활비", icon: "₩" },
  { screen: "history", label: "기록", icon: "□" },
  { screen: "settings", label: "설정", icon: "⚙" }
];

function App() {
  const [screen, setScreen] = useState("splash");
  const [selectedPersona, setSelectedPersona] = useState(personas[0]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedWorkflowGroup, setSelectedWorkflowGroup] = useState("all");
  const [currentScenario, setCurrentScenario] = useState(scenarios.find((item) => item.id === "loan_high"));
  const [history, setHistory] = useState([]);
  const [evidencePackages, setEvidencePackages] = useState([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetTab, setSheetTab] = useState("summary");
  const [modal, setModal] = useState("disclaimer");
  const [toast, setToast] = useState("");
  const [settings, setSettings] = useState({
    protectionMode: true,
    seniorMode: false,
    easyKoreanMode: false,
    highTransferLimit: 500000
  });
  const [reason, setReason] = useState("");

  useEffect(() => {
    document.body.classList.toggle("senior-mode", settings.seniorMode);
    document.body.classList.toggle("easy-mode", settings.easyKoreanMode);
  }, [settings]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredScenarios = useMemo(() => {
    if (selectedCategory === "전체") return scenarios;
    return scenarios.filter((scenario) => scenario.category === selectedCategory);
  }, [selectedCategory]);

  const filteredWorkflows = useMemo(() => {
    if (selectedWorkflowGroup === "all") return workflows;
    return workflows.filter((workflow) => workflow.group === selectedWorkflowGroup);
  }, [selectedWorkflowGroup]);

  function go(nextScreen) {
    setScreen(nextScreen);
  }

  function notify(message) {
    setToast(message);
  }

  function saveHistory(status, scenario = currentScenario) {
    if (!scenario) return;
    setHistory((items) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        status,
        scenarioId: scenario.id,
        title: scenario.title,
        category: scenario.category,
        riskLevel: scenario.riskLevel,
        riskScore: scenario.riskScore,
        time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
      },
      ...items
    ].slice(0, 18));
  }

  function selectScenario(id) {
    const scenario = scenarios.find((item) => item.id === id);
    setCurrentScenario(scenario);
    setScreen("analyzing");
    window.setTimeout(() => {
      saveHistory("위험 확인 완료", scenario);
      notify("AI가 금융 행동을 분석했어요");
      setScreen(scenario.category === "입금" ? "receive" : "risk");
    }, 720);
  }

  function openCategory(category) {
    setSelectedCategory(category);
    setScreen("input");
  }

  function runWorkflow(workflow) {
    if (workflow.category) {
      setSelectedCategory(workflow.category);
    }
    if (workflow.scenarioId) {
      const scenario = scenarios.find((item) => item.id === workflow.scenarioId);
      setCurrentScenario(scenario);
      if (workflow.screen === "receive") {
        saveHistory(`${workflow.id} ${workflow.title}`, scenario);
        setScreen("receive");
        return;
      }
      if (workflow.screen === "input") {
        setScreen("analyzing");
        window.setTimeout(() => {
          saveHistory(`${workflow.id} ${workflow.title}`, scenario);
          notify("워크플로우에 맞춰 위험을 확인했어요");
          setScreen(scenario.category === "입금" ? "receive" : "risk");
        }, 720);
        return;
      }
      if (workflow.screen === "dryrun") {
        saveHistory(`${workflow.id} ${workflow.title}`, scenario);
        setScreen("dryrun");
        return;
      }
      if (workflow.screen === "guard") {
        saveHistory(`${workflow.id} ${workflow.title}`, scenario);
        setScreen("guard");
        return;
      }
      if (workflow.screen === "evidence") {
        setEvidencePackages((items) => [{
          id: `${Date.now()}`,
          status: "신고자료 정리하기",
          scenarioId: scenario.id,
          createdAt: new Date().toLocaleString("ko-KR")
        }, ...items]);
        saveHistory(`${workflow.id} 신고용 기록 묶음`, scenario);
        setScreen("evidence");
        return;
      }
    }
    setScreen(workflow.screen);
  }

  function proceed() {
    if (!currentScenario) return;
    if (currentScenario.riskScore < 40) {
      saveHistory("진행 완료");
      notify("안전한 금융 행동으로 기록했어요");
      go("home");
    } else if (currentScenario.riskScore < 65) {
      setSheetOpen(true);
    } else {
      go("guard");
    }
  }

  function createEvidence(status = "신고자료 정리하기") {
    const pack = {
      id: `${Date.now()}`,
      status,
      scenarioId: currentScenario.id,
      createdAt: new Date().toLocaleString("ko-KR")
    };
    setEvidencePackages((items) => [pack, ...items]);
    saveHistory(status);
    notify("상담·신고용 기록 묶음을 만들었어요");
    setModal("evidence-created");
    go("evidence");
  }

  function handleReceive(action) {
    const labels = {
      accept: "정상 입금으로 받기",
      hold: "사용하지 않고 보류하기",
      return: "보낸 계좌로 돌려주기",
      report: "신고자료 정리하기"
    };
    if (action === "accept") {
      saveHistory(labels[action]);
      notify("정상 입금으로 기록했어요");
      go("home");
      return;
    }
    if (action === "hold") {
      saveHistory(labels[action]);
      notify("의심입금을 보류 기록에 저장했어요");
      go("history");
      return;
    }
    createEvidence(labels[action]);
  }

  function selectPersona(persona) {
    setSelectedPersona(persona);
    setSettings((value) => ({
      ...value,
      seniorMode: persona.id === "senior" ? true : value.seniorMode,
      easyKoreanMode: persona.id === "foreigner" ? true : value.easyKoreanMode
    }));
  }

  function toggleSetting(key) {
    setSettings((value) => ({ ...value, [key]: !value[key] }));
  }

  return (
    <div className="app-stage">
      <div className="phone-shell">
        <div className="phone">
          <StatusBar />
          <main className="viewport" aria-label={`${screenTitles[screen]} 화면`}>
            {screen === "splash" && <Splash onStart={() => go("onboarding")} />}
            {screen === "onboarding" && (
              <Onboarding selectedPersona={selectedPersona} onSelect={selectPersona} onDone={() => go("home")} />
            )}
            {screen === "home" && (
              <Home
                selectedPersona={selectedPersona}
                settings={settings}
                history={history}
                onCategory={openCategory}
                onScreen={go}
              />
            )}
            {screen === "test" && (
              <TestHubScreen
                history={history}
                onWorkflow={runWorkflow}
                onScenario={(scenarioId) => selectScenario(scenarioId)}
                onReset={() => {
                  setHistory([]);
                  setEvidencePackages([]);
                  notify("테스트 기록을 초기화했어요");
                }}
              />
            )}
            {screen === "input" && (
              <InputScreen
                selectedCategory={selectedCategory}
                selectedWorkflowGroup={selectedWorkflowGroup}
                filteredScenarios={filteredScenarios}
                filteredWorkflows={filteredWorkflows}
                onFilter={setSelectedCategory}
                onWorkflowGroup={setSelectedWorkflowGroup}
                onWorkflow={runWorkflow}
                onSelect={selectScenario}
                onToast={notify}
              />
            )}
            {screen === "analyzing" && <Analyzing />}
            {screen === "risk" && (
              <RiskScreen
                scenario={currentScenario}
                onExplain={() => setSheetOpen(true)}
                onDryrun={() => go("dryrun")}
                onSave={() => {
                  saveHistory("기록함 저장");
                  notify("기록함에 저장했어요");
                }}
                onProceed={proceed}
              />
            )}
            {screen === "explain" && (
              <ExplainScreen
                scenario={currentScenario}
                onUnderstood={() => {
                  saveHistory("이해 체크 완료");
                  notify("핵심 위험 확인이 완료됐어요");
                }}
              />
            )}
            {screen === "dryrun" && (
              <DryRunScreen
                scenario={currentScenario}
                onProceed={proceed}
                onHold={() => setModal("cooling")}
                onCancel={() => {
                  saveHistory("취소");
                  notify("취소 기록을 저장했어요");
                  go("home");
                }}
                onEvidence={() => createEvidence()}
              />
            )}
            {screen === "guard" && (
              <GuardHoldScreen
                scenario={currentScenario}
                reason={reason}
                setReason={setReason}
                onHold={() => setModal("cooling")}
                onCancel={() => {
                  saveHistory("취소");
                  notify("취소 기록을 저장했어요");
                  go("home");
                }}
                onReason={() => setModal("reason")}
                onEvidence={() => createEvidence()}
              />
            )}
            {screen === "receive" && (
              <SafeReceiveScreen scenario={currentScenario} onReceive={handleReceive} onDryrun={() => go("dryrun")} />
            )}
            {screen === "evidence" && (
              <EvidenceScreen
                scenario={currentScenario}
                evidencePackages={evidencePackages}
                onSave={() => {
                  saveHistory("신고자료 정리하기");
                  notify("기록함에 저장했어요");
                }}
                onHistory={() => go("history")}
              />
            )}
            {screen === "money" && (
              <MoneyScreen
                scenarios={scenarios}
                onScenario={(scenario) => {
                  setCurrentScenario(scenario);
                  saveHistory("돈흐름 미리보기", scenario);
                  go("dryrun");
                }}
                onWorkflow={runWorkflow}
              />
            )}
            {screen === "living" && (
              <LivingScreen
                onScenario={(scenarioId) => {
                  const scenario = scenarios.find((item) => item.id === scenarioId);
                  setCurrentScenario(scenario);
                  saveHistory("생활비 보호 확인", scenario);
                  go("guard");
                }}
                onSave={() => {
                  saveHistory("절약 성공 기록");
                  notify("이번 달 지켜낸 금액에 반영했어요");
                }}
              />
            )}
            {screen === "history" && <HistoryScreen history={history} />}
            {screen === "settings" && (
              <SettingsScreen
                settings={settings}
                onToggle={toggleSetting}
                onLimit={(value) => setSettings((current) => ({ ...current, highTransferLimit: value }))}
                onPersona={() => go("onboarding")}
              />
            )}
          </main>
          {!["splash", "onboarding", "analyzing"].includes(screen) && <BottomNav activeScreen={screen} onScreen={go} />}
          {sheetOpen && (
            <ExplainSheet
              scenario={currentScenario}
              activeTab={sheetTab}
              setTab={setSheetTab}
              onClose={() => setSheetOpen(false)}
              onUnderstood={() => {
                setSheetOpen(false);
                saveHistory("이해 체크 완료");
                notify("핵심 위험 확인이 완료됐어요");
              }}
            />
          )}
          <Modal
            modal={modal}
            setModal={setModal}
            reason={reason}
            setReason={setReason}
            onCoolingDone={() => {
              setModal("");
              saveHistory("10분 뒤 다시 확인 완료");
              notify("이 행동을 보류 기록에 저장했어요");
              go("history");
            }}
            onReasonDone={() => {
              setModal("");
              saveHistory("사유 입력 후 진행");
              notify("그래도 진행한 사유를 기록했어요");
              go("history");
            }}
          />
          {toast && <div className="toast">{toast}</div>}
        </div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="status-bar">
      <strong>{new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}</strong>
      <span className="status-right">●●● 87%</span>
    </div>
  );
}

function TopBar({ title, eyebrow, onBack }) {
  return (
    <header className="top-bar">
      {onBack && <button className="icon-button" onClick={onBack} aria-label="뒤로가기">‹</button>}
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
      </div>
    </header>
  );
}

function Splash({ onStart }) {
  return (
    <section className="screen splash-screen">
      <div className="brand-mark">FG</div>
      <div>
        <h1 className="display-title">Finnect Guard</h1>
        <p className="lead">누르기 전에 보여주고, 위험하면 멈추고, 문제 생기면 증거까지 남깁니다.</p>
      </div>
      <button className="primary-button" onClick={onStart}>시작하기</button>
      <Disclaimer />
    </section>
  );
}

function Onboarding({ selectedPersona, onSelect, onDone }) {
  return (
    <section className="screen">
      <TopBar title="보호모드 선택" eyebrow="사용자 유형" />
      <div className="persona-list">
        {personas.map((persona) => (
          <button
            className={`persona-card ${selectedPersona.id === persona.id ? "selected" : ""}`}
            key={persona.id}
            onClick={() => onSelect(persona)}
          >
            <span className="pill">{persona.mode}</span>
            <strong>{persona.label}</strong>
            <span>{persona.copy}</span>
          </button>
        ))}
      </div>
      <button className="primary-button bottom-action" onClick={onDone}>선택 완료</button>
      <Disclaimer />
    </section>
  );
}

function Home({ selectedPersona, settings, history, onCategory, onScreen }) {
  return (
    <section className="screen with-nav">
      <div className="home-top">
        <div>
          <strong className="logo-text">Finnect Guard</strong>
          <span className="subtle">AI 금융 행동 안전벨트</span>
        </div>
        <button className="icon-button" aria-label="알림">!</button>
      </div>
      <div className="status-pills">
        <span className="pill">{settings.protectionMode ? "보호모드 ON" : "보호모드 OFF"}</span>
        <span className="pill muted-pill">{selectedPersona.label}</span>
      </div>
      <h1 className="display-title">오늘도 안전하게 금융 행동하기</h1>
      <p className="lead">금융 동의를 단순한 체크박스가 아니라 이해 기반 의사결정으로 바꿔요.</p>
      <section className="summary-band">
        <div>
          <span className="eyebrow">오늘의 위험 점검</span>
          <strong>5대 기능 전체 시연</strong>
          <p>위험 확인 카드, 쉬운 설명, 돈흐름 미리보기, 잠시 멈추기, 이 입금 확인하기, 신고용 기록을 모두 확인할 수 있어요.</p>
        </div>
        <RiskBadge level="확인 필요" score={62} />
      </section>
      <button className="test-hub-button" data-testid="open-test-hub" onClick={() => onScreen("test")}>
        테스트 허브 열기
        <span>전체 워크플로우와 샘플을 한 화면에서 실행</span>
      </button>
      <SectionTitle title="무엇을 확인할까요?" />
      <div className="quick-grid">
        {quickActions.map((item) => (
          <button className="quick-action" key={item.title} onClick={() => onCategory(item.category)}>
            <strong>{item.title}</strong>
            <span>{item.copy}</span>
          </button>
        ))}
      </div>
      <SectionTitle title="최근 기록" action="전체 보기" onAction={() => onScreen("history")} />
      <HistoryPreview history={history} />
      <Disclaimer />
    </section>
  );
}

function TestHubScreen({ history, onWorkflow, onScenario, onReset }) {
  return (
    <section className="screen with-nav">
      <TopBar title="테스트 허브" eyebrow="전체 흐름 빠른 실행" />
      <section className="test-summary">
        <Metric label="워크플로우" value={`${workflows.length}개`} />
        <Metric label="샘플 시나리오" value={`${scenarios.length}개`} />
        <Metric label="테스트 묶음" value={`${testSuites.length}개`} />
        <Metric label="현재 기록" value={`${history.length}건`} />
      </section>
      <div className="action-grid">
        <button className="primary-button" data-testid="run-loan-flow" onClick={() => onWorkflow(workflows.find((item) => item.id === "WF-03"))}>대출 흐름 실행</button>
        <button data-testid="run-receive-flow" onClick={() => onWorkflow(workflows.find((item) => item.id === "WF-10"))}>입금 흐름 실행</button>
        <button data-testid="run-living-flow" onClick={() => onWorkflow(workflows.find((item) => item.id === "WF-07"))}>생활비 흐름 실행</button>
        <button className="danger-button" data-testid="reset-test-state" onClick={onReset}>기록 초기화</button>
      </div>
      <SectionTitle title="테스트 묶음" />
      <div className="test-suite-list">
        {testSuites.map((suite) => (
          <article className="test-suite" key={suite.id}>
            <div>
              <strong>{suite.title}</strong>
              <p>{suite.copy}</p>
            </div>
            <div className="workflow-steps">
              {suite.workflowIds.map((id) => {
                const workflow = workflows.find((item) => item.id === id);
                return (
                  <button key={id} data-testid={`test-workflow-${id}`} onClick={() => onWorkflow(workflow)}>
                    {id}
                  </button>
                );
              })}
            </div>
            {suite.scenarioIds && (
              <div className="workflow-steps">
                {suite.scenarioIds.map((id) => {
                  const scenario = scenarios.find((item) => item.id === id);
                  return (
                    <button key={id} data-testid={`test-scenario-${id}`} onClick={() => onScenario(id)}>
                      {scenario.category}
                    </button>
                  );
                })}
              </div>
            )}
          </article>
        ))}
      </div>
      <SectionTitle title="전체 워크플로우" />
      <div className="workflow-list compact">
        {workflows.map((workflow) => (
          <WorkflowCard workflow={workflow} key={workflow.id} onRun={() => onWorkflow(workflow)} />
        ))}
      </div>
      <Disclaimer />
    </section>
  );
}

function InputScreen({
  selectedCategory,
  selectedWorkflowGroup,
  filteredScenarios,
  filteredWorkflows,
  onFilter,
  onWorkflowGroup,
  onWorkflow,
  onSelect,
  onToast
}) {
  return (
    <section className="screen with-nav">
      <TopBar title="위험진단" eyebrow="워크플로우와 샘플 시나리오" />
      <SectionTitle title="워크플로우 카테고리" />
      <div className="chip-row">
        {workflowGroups.map((group) => (
          <button className={`chip ${selectedWorkflowGroup === group.id ? "active" : ""}`} key={group.id} onClick={() => onWorkflowGroup(group.id)}>
            {group.label}
          </button>
        ))}
      </div>
      <div className="workflow-list">
        {filteredWorkflows.map((workflow) => (
          <WorkflowCard workflow={workflow} key={workflow.id} onRun={() => onWorkflow(workflow)} />
        ))}
      </div>
      <SectionTitle title="샘플 시나리오" />
      <div className="chip-row">
        {categories.map((category) => (
          <button className={`chip ${selectedCategory === category ? "active" : ""}`} key={category} onClick={() => onFilter(category)}>
            {category}
          </button>
        ))}
      </div>
      <div className="scenario-list">
        {filteredScenarios.map((scenario) => (
          <button className="scenario-card" data-testid={`scenario-${scenario.id}`} key={scenario.id} onClick={() => onSelect(scenario.id)}>
            <div className="scenario-head">
              <span className="pill muted-pill">{scenario.category}</span>
              <RiskBadge level={scenario.riskLevel} score={scenario.riskScore} />
            </div>
            <strong>{scenario.title}</strong>
            <p>{scenario.description}</p>
          </button>
        ))}
      </div>
      <SectionTitle title="예외 상황" />
      <div className="error-grid">
        <button onClick={() => onToast("분석하려면 금액이나 상대 이름이 더 필요해요")}>입력 정보 부족</button>
        <button onClick={() => onToast("화면을 읽지 못했어요. 직접 입력으로 바꿀까요?")}>OCR 실패</button>
        <button onClick={() => onToast("목업에서는 오프라인 샘플로 계속 볼 수 있어요")}>네트워크 없음</button>
      </div>
      <Disclaimer />
    </section>
  );
}

function WorkflowCard({ workflow, onRun }) {
  return (
    <button className="workflow-card" data-testid={`workflow-${workflow.id}`} onClick={onRun}>
      <div className="scenario-head">
        <span className="pill muted-pill">{workflow.id}</span>
        <span className="pill">{workflow.primaryAction}</span>
      </div>
      <strong>{workflow.title}</strong>
      <p>{workflow.purpose}</p>
      <div className="workflow-steps">
        {workflow.steps.slice(0, 4).map((step) => <span key={step}>{step}</span>)}
      </div>
    </button>
  );
}

function Analyzing() {
  return (
    <section className="screen analyzing-screen">
      <h1 className="display-title">AI가 금융 행동을 읽고 있어요</h1>
      <div className="scan-card"><span>분석 중</span></div>
      <ol className="analysis-steps">
        <li>행동 유형 확인 중</li>
        <li>위험 조항 찾는 중</li>
        <li>돈의 흐름 계산 중</li>
        <li>쉬운 설명 만드는 중</li>
      </ol>
    </section>
  );
}

function RiskScreen({ scenario, onExplain, onDryrun, onSave, onProceed }) {
  return (
    <section className="screen with-nav">
      <TopBar title="위험 확인 결과" eyebrow={scenario.category} />
      <RiskCard scenario={scenario} />
      <InfoPanel title="핵심 위험" items={scenario.risks} marker="!" />
      <InfoPanel title="확인해야 할 것" items={scenario.checks} marker="?" />
      <div className="action-grid">
        <button className="primary-button" onClick={onExplain}>쉽게 설명해줘<span className="english">Explain simply</span></button>
        <button onClick={onDryrun}>돈흐름 미리보기<span className="english">Preview money flow</span></button>
        <button onClick={onSave}>기록함에 저장</button>
        <button className={scenario.riskScore >= 65 ? "danger-button" : "safe-button"} onClick={onProceed}>다음 행동 확인하기<span className="english">Check next step</span></button>
      </div>
      <Disclaimer />
    </section>
  );
}

function RiskCard({ scenario }) {
  const meta = riskMeta[scenario.riskLevel];
  return (
    <section className="risk-card">
      <div className="risk-card-head">
        <RiskBadge level={scenario.riskLevel} score={scenario.riskScore} />
        <span className="confidence">AI 분석 신뢰도 {scenario.confidence}%</span>
      </div>
      <h2>{scenario.title}</h2>
      <p>{scenario.summary}</p>
      <div className="score-track" aria-label={`위험 점수 ${scenario.riskScore}점`}>
        <span className={`score-fill ${meta.tone}`} style={{ width: `${scenario.riskScore}%` }} />
      </div>
      <strong className="risk-message">{meta.symbol} {meta.message}</strong>
    </section>
  );
}

function ExplainScreen({ scenario, onUnderstood }) {
  return (
    <section className="screen with-nav">
      <TopBar title="쉬운 설명" eyebrow={scenario.title} />
      <RiskCard scenario={scenario} />
      <GlossaryCards scenario={scenario} />
      <button className="primary-button" onClick={onUnderstood}>이해했어요</button>
      <Disclaimer />
    </section>
  );
}

function DryRunScreen({ scenario, onProceed, onHold, onCancel, onEvidence }) {
  return (
    <section className="screen with-nav">
      <TopBar title="돈흐름 미리보기" eyebrow={scenario.category} />
      <section className="summary-band">
        <div>
          <span className="eyebrow">지금 이 행동을 하면?</span>
          <strong>{scenario.summary}</strong>
          <p>{scenario.recommendedAction}</p>
        </div>
        <RiskBadge level={scenario.riskLevel} score={scenario.riskScore} />
      </section>
      <Timeline timeline={scenario.timeline} />
      <div className="metric-grid">
        <Metric label="월 납입액" value={scenario.metrics.monthly || "-"} />
        <Metric label="총 비용" value={scenario.metrics.total || "상황별 변동"} />
        <Metric label="남은 생활비" value={scenario.metrics.buffer || "확인 필요"} />
        <Metric label="위험 점수" value={`${scenario.riskScore}점`} />
      </div>
      <div className="action-grid">
        <button className={scenario.riskScore >= 65 ? "danger-button" : "safe-button"} onClick={onProceed}>다음 행동 확인하기</button>
        <button className="primary-button" onClick={onHold}>10분 뒤 다시 확인</button>
        <button onClick={onCancel}>취소하기</button>
        <button onClick={onEvidence}>신고자료 정리하기</button>
      </div>
      <Disclaimer />
    </section>
  );
}

function GuardHoldScreen({ scenario, reason, setReason, onHold, onCancel, onReason, onEvidence }) {
  return (
    <section className="screen with-nav">
      <TopBar title="잠시 멈추기" eyebrow={`${riskMeta[scenario.riskLevel].label} ${scenario.riskScore}점`} />
      <section className="guard-hero">
        <RiskBadge level={scenario.riskLevel} score={scenario.riskScore} />
        <h2>잠깐, 지금 바로 진행하지 않아도 괜찮아요</h2>
        <p>10분만 지나도 충동적인 선택인지 다시 판단할 수 있어요.</p>
      </section>
      <InfoPanel title="보류 이유" items={scenario.risks} marker="!" />
      <textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="보류하거나 그래도 진행하려는 이유를 적어둘 수 있어요." />
      <div className="action-grid">
        <button className="primary-button" onClick={onHold}>10분 뒤 다시 확인<span className="english">Check again in 10 min</span></button>
        <button onClick={onCancel}>취소하기</button>
        <button onClick={onEvidence}>신고자료 정리하기</button>
        <button className="danger-button" onClick={onReason}>그래도 진행하기</button>
      </div>
      <Disclaimer />
    </section>
  );
}

function SafeReceiveScreen({ scenario, onReceive, onDryrun }) {
  return (
    <section className="screen with-nav">
      <TopBar title="이 입금 확인하기" eyebrow="의심입금 대응" />
      <section className="receive-hero">
        <RiskBadge level={scenario.riskLevel} score={scenario.riskScore} />
        <h2>이 입금, 바로 써도 될까요?</h2>
        <p>{scenario.summary}</p>
      </section>
      <InfoPanel title="위험 신호" items={scenario.risks} marker="!" />
      <Timeline timeline={scenario.timeline} />
      <div className="action-grid">
        <button className="safe-button" onClick={() => onReceive("accept")}>정상 입금으로 받기<span className="english">Receive as normal deposit</span></button>
        <button className="primary-button" onClick={() => onReceive("hold")}>사용하지 않고 보류하기<span className="english">Keep unused for now</span></button>
        <button onClick={() => onReceive("return")}>보낸 계좌로 돌려주기</button>
        <button className="danger-button" onClick={() => onReceive("report")}>신고자료 정리하기</button>
        <button onClick={onDryrun}>돈흐름 미리보기</button>
      </div>
      <Disclaimer />
    </section>
  );
}

function MoneyScreen({ scenarios: allScenarios, onScenario, onWorkflow }) {
  const moneyWorkflowIds = ["WF-03", "WF-04", "WF-05"];
  const moneyWorkflows = workflows.filter((workflow) => moneyWorkflowIds.includes(workflow.id));
  const previewScenarios = allScenarios.filter((scenario) => ["대출", "카드", "자동이체", "소비", "송금"].includes(scenario.category));

  return (
    <section className="screen with-nav">
      <TopBar title="돈흐름" eyebrow="1개월·3개월·최악 상황" />
      <section className="money-hero">
        <span className="eyebrow">지금 누르면?</span>
        <h2>버튼 뒤의 돈 흐름을 먼저 보여줘요</h2>
        <p>대출, 카드, 구독, 소비, 송금이 이번 달 생활비에 어떤 영향을 주는지 미리 확인합니다.</p>
      </section>
      <SectionTitle title="지원 워크플로우" />
      <div className="workflow-list compact">
        {moneyWorkflows.map((workflow) => (
          <WorkflowCard workflow={workflow} key={workflow.id} onRun={() => onWorkflow(workflow)} />
        ))}
      </div>
      <SectionTitle title="돈흐름 미리보기 샘플" />
      <div className="scenario-list">
        {previewScenarios.slice(0, 8).map((scenario) => (
          <button className="scenario-card" data-testid={`money-scenario-${scenario.id}`} key={scenario.id} onClick={() => onScenario(scenario)}>
            <div className="scenario-head">
              <span className="pill muted-pill">{scenario.category}</span>
              <RiskBadge level={scenario.riskLevel} score={scenario.riskScore} />
            </div>
            <strong>{scenario.title}</strong>
            <p>{scenario.summary}</p>
          </button>
        ))}
      </div>
      <Disclaimer />
    </section>
  );
}

function LivingScreen({ onScenario, onSave }) {
  const livingWorkflows = workflows.filter((workflow) => workflow.group === "living");
  return (
    <section className="screen with-nav">
      <TopBar title="생활비 보호모드" eyebrow="필수 생활비 먼저 지키기" />
      <section className="living-summary">
        <Metric label="오늘 사용 가능 금액" value="30,000원" />
        <Metric label="보호 중인 금액" value="200,000원" />
        <Metric label="이번 달 지켜낸 금액" value="214,000원" />
        <Metric label="필수 생활비" value="1,510,000원" />
      </section>
      <section className="money-hero">
        <span className="eyebrow">생활비 보호</span>
        <h2>통장에 돈이 있어도 전부 써도 되는 돈은 아니에요</h2>
        <p>월세, 통신비, 교통비, 식비, 카드값, 대출상환액을 먼저 빼고 남은 돈만 보여줍니다.</p>
      </section>
      <SectionTitle title="지원 워크플로우" />
      <div className="workflow-list compact">
        {livingWorkflows.map((workflow) => (
          <WorkflowCard
            workflow={workflow}
            key={workflow.id}
            onRun={() => workflow.scenarioId ? onScenario(workflow.scenarioId) : onSave()}
          />
        ))}
      </div>
      <SectionTitle title="충동소비 예시" />
      <div className="info-panel">
        <h2>배달 결제 28,000원</h2>
        <ul>
          <li><b>!</b><span>이번 주 식비 잔액은 18,000원이에요.</span></li>
          <li><b>!</b><span>결제하면 식비 예산을 넘고 월말 생활비가 줄어들어요.</span></li>
          <li><b>✓</b><span>10분 뒤 다시 확인하거나 장바구니에만 담아둘 수 있어요.</span></li>
        </ul>
      </div>
      <div className="action-grid">
        <button className="primary-button" onClick={() => onScenario("spending_delivery_high")}>잠시 멈추기</button>
        <button onClick={onSave}>지켜낸 금액 보기</button>
      </div>
      <Disclaimer />
    </section>
  );
}

function EvidenceScreen({ scenario, evidencePackages, onSave, onHistory }) {
  const latest = evidencePackages[0];
  return (
    <section className="screen with-nav">
      <TopBar title="신고용 기록 묶음" eyebrow="상담·신고용" />
      <section className="evidence-hero">
        <h2>상담·신고에 필요한 내용을 정리했어요</h2>
        <p>이 기록은 내가 위험을 인지하고 보류했다는 근거가 될 수 있어요.</p>
      </section>
      <InfoBlock title="사건 요약" text={`${scenario.title}: ${scenario.summary}`} />
      <InfoBlock title="거래 정보" text={`${scenario.category} · ${riskMeta[scenario.riskLevel].label} ${scenario.riskScore}점 · ${scenario.recommendedAction}`} />
      <InfoPanel title="위험 신호" items={scenario.risks} marker="!" />
      <InfoBlock title="사용자 선택 기록" text={`${latest?.status || "신고자료 정리하기"} · ${latest?.createdAt || new Date().toLocaleString("ko-KR")}`} />
      <div className="action-grid">
        <button className="primary-button" onClick={onSave}>기록함에 저장</button>
        <button onClick={onHistory}>기록함 보기</button>
      </div>
      <Disclaimer />
    </section>
  );
}

function HistoryScreen({ history }) {
  return (
    <section className="screen with-nav">
      <TopBar title="기록함" eyebrow="분석 · 보류 · 신고자료" />
      {history.length === 0 ? (
        <EmptyState title="아직 기록이 없어요" copy="분석 화면에서 시나리오를 선택하면 기록이 쌓입니다." />
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <article className="history-item" key={item.id}>
              <div className="scenario-head">
                <RiskBadge level={item.riskLevel} score={item.riskScore} />
                <span className="subtle">{item.time}</span>
              </div>
              <strong>{item.title}</strong>
              <p>{item.category} · {item.status}</p>
            </article>
          ))}
        </div>
      )}
      <Disclaimer />
    </section>
  );
}

function SettingsScreen({ settings, onToggle, onLimit, onPersona }) {
  return (
    <section className="screen with-nav">
      <TopBar title="보호 설정" eyebrow="포용금융 UI" />
      <SettingRow title="보호모드" copy="위험 행동 전 경고를 표시합니다." active={settings.protectionMode} onToggle={() => onToggle("protectionMode")} />
      <SettingRow title="고령층 큰 글씨 모드" copy="글자와 버튼 간격을 키웁니다." active={settings.seniorMode} onToggle={() => onToggle("seniorMode")} />
      <SettingRow title="쉬운 한국어 / English Assist" copy="주요 버튼에 영어 보조 라벨을 표시합니다." active={settings.easyKoreanMode} onToggle={() => onToggle("easyKoreanMode")} />
      <section className="setting-card">
        <strong>고액 송금 기준</strong>
        <input type="number" min="10000" step="10000" value={settings.highTransferLimit} onChange={(event) => onLimit(Number(event.target.value))} />
        <p>기준을 넘는 송금은 잠시 멈추기 민감도가 올라갑니다.</p>
      </section>
      <button onClick={onPersona}>사용자 유형 바꾸기</button>
      <Disclaimer />
    </section>
  );
}

function ExplainSheet({ scenario, activeTab, setTab, onClose, onUnderstood }) {
  const tabContent = {
    summary: <InfoBlock title={scenario.summary} text={scenario.recommendedAction} />,
    why: <InfoPanel title="왜 위험한지" items={scenario.risks} marker="!" />,
    checks: <InfoPanel title="내가 확인할 것" items={scenario.checks} marker="?" />,
    example: <Timeline timeline={scenario.timeline} />
  };
  return (
    <div className="sheet-backdrop" role="dialog" aria-modal="true">
      <section className="bottom-sheet">
        <div className="sheet-head">
          <div>
            <h2>쉽게 설명해줘</h2>
            <p>어려운 금융 용어를 쉬운 말로 바꿔 보여줘요.</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="닫기">×</button>
        </div>
        <div className="sheet-tabs">
          {[
            ["summary", "한 줄"],
            ["why", "위험"],
            ["checks", "확인"],
            ["example", "예시"]
          ].map(([id, label]) => (
            <button className={activeTab === id ? "active" : ""} key={id} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>
        {tabContent[activeTab]}
        <button className="primary-button" onClick={onUnderstood}>이해했어요<span className="english">I understand</span></button>
      </section>
    </div>
  );
}

function Modal({ modal, setModal, reason, setReason, onCoolingDone, onReasonDone }) {
  if (!modal) return null;
  const close = () => setModal("");
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <section className="modal-card">
        {modal === "disclaimer" && (
          <>
            <h2>목업 안내</h2>
            <p>이 앱은 Finnect Guard 기능을 쉽게 둘러보기 위한 React + Vite 시뮬레이션입니다. 실제 금융거래, 송금, 대출, 신고는 수행하지 않습니다.</p>
            <button className="primary-button" onClick={close}>확인했어요</button>
          </>
        )}
        {modal === "cooling" && (
          <>
            <h2>10분 뒤 다시 확인</h2>
            <p>데모에서는 실제로 기다리지 않고 바로 경과 처리할 수 있어요.</p>
            <button className="primary-button" onClick={onCoolingDone}>10분 지난 것으로 보기</button>
            <button onClick={close}>닫기</button>
          </>
        )}
        {modal === "reason" && (
          <>
            <h2>그래도 진행 사유</h2>
            <p>강행한 이유를 기록하면 이후 분쟁 대응 자료로 남길 수 있어요.</p>
            <textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="예: 상대방과 전화로 계좌명을 다시 확인했어요." />
            <button className="danger-button" onClick={onReasonDone}>사유 기록 후 진행</button>
            <button onClick={close}>취소</button>
          </>
        )}
        {modal === "evidence-created" && (
          <>
            <h2>신고용 기록 묶음 생성 완료</h2>
            <p>상담·신고에 필요한 요약, 거래 정보, 위험 신호, 사용자 선택 기록을 묶었어요.</p>
            <button className="primary-button" onClick={close}>확인</button>
          </>
        )}
      </section>
    </div>
  );
}

function BottomNav({ activeScreen, onScreen }) {
  const activeMap = {
    risk: "input",
    explain: "input",
    receive: "input",
    guard: "input",
    dryrun: "money",
    evidence: "history",
    test: "home"
  };
  const normalizedActive = activeMap[activeScreen] || activeScreen;
  return (
    <nav className="bottom-nav" aria-label="하단 내비게이션">
      {tabs.map((tab) => (
        <button
          className={normalizedActive === tab.screen ? "active" : ""}
          key={tab.screen}
          data-testid={`nav-${tab.screen}`}
          onClick={() => onScreen(tab.screen)}
        >
          <b>{tab.icon}</b>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

function RiskBadge({ level, score }) {
  const meta = riskMeta[level];
  return <span className={`risk-badge ${meta.tone}`}>{meta.symbol} {meta.label}{typeof score === "number" ? ` ${score}점` : ""}</span>;
}

function InfoPanel({ title, items, marker }) {
  return (
    <section className="info-panel">
      <h2>{title}</h2>
      <ul>
        {items.map((item) => <li key={item}><b>{marker}</b><span>{item}</span></li>)}
      </ul>
    </section>
  );
}

function InfoBlock({ title, text }) {
  return (
    <section className="info-block">
      <strong>{title}</strong>
      <p>{text}</p>
    </section>
  );
}

function GlossaryCards({ scenario }) {
  const terms = scenario.risks.map((risk) => {
    const key = Object.keys(glossary).find((term) => risk.includes(term)) || risk;
    return [key, glossary[key] || { plain: `${risk}을 먼저 확인해야 합니다.`, risk: "확실하지 않으면 보류하고 기록을 남기는 편이 안전해요.", english: "Pause if you are not sure." }];
  });
  return (
    <div className="glossary-list">
      {terms.map(([term, data]) => (
        <article className="term-card" key={term}>
          <strong>{term}</strong>
          <p>{data.plain}</p>
          <span>위험 포인트: {data.risk}</span>
          <em className="english">{data.english}</em>
        </article>
      ))}
    </div>
  );
}

function Timeline({ timeline }) {
  return (
    <section className="timeline">
      {[
        ["오늘", timeline.today],
        ["1개월 뒤", timeline.month1],
        ["3개월 뒤", timeline.month3],
        ["최악의 상황", timeline.worst]
      ].map(([label, text]) => (
        <article className="timeline-item" key={label}>
          <strong>{label}</strong>
          <p>{text}</p>
        </article>
      ))}
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <article className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function SectionTitle({ title, action, onAction }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {action && <button onClick={onAction}>{action}</button>}
    </div>
  );
}

function HistoryPreview({ history }) {
  if (history.length === 0) return <EmptyState title="최근 기록이 여기에 표시됩니다" copy="분석을 시작하면 위험도와 사용자 선택이 남아요." compact />;
  return (
    <div className="history-preview">
      {history.slice(0, 2).map((item) => (
        <article className="history-item" key={item.id}>
          <div className="scenario-head">
            <strong>{item.title}</strong>
            <RiskBadge level={item.riskLevel} />
          </div>
          <p>{item.status} · {item.time}</p>
        </article>
      ))}
    </div>
  );
}

function SettingRow({ title, copy, active, onToggle }) {
  return (
    <section className="setting-card setting-row">
      <div>
        <strong>{title}</strong>
        <p>{copy}</p>
      </div>
      <button className={`toggle ${active ? "on" : ""}`} onClick={onToggle} aria-label={title} />
    </section>
  );
}

function EmptyState({ title, copy, compact = false }) {
  return (
    <section className={`empty-state ${compact ? "compact" : ""}`}>
      <strong>{title}</strong>
      <p>{copy}</p>
    </section>
  );
}

function Disclaimer() {
  return <p className="disclaimer">본 화면은 공모전 목업이며 실제 금융거래를 수행하지 않습니다.</p>;
}

export default App;
