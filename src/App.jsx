import React, { useState } from "react";
import { PhoneFrame } from "./components/DemoLayout";
import Home from "./screens/Home";
import DiagnosisDemo from "./screens/DiagnosisDemo";
import EasyExplainDemo from "./screens/EasyExplainDemo";
import CashflowDemo from "./screens/CashflowDemo";
import BudgetGuardDemo from "./screens/BudgetGuardDemo";
import SuspiciousDepositDemo from "./screens/SuspiciousDepositDemo";
import ReportDemo from "./screens/ReportDemo";

const screens = {
  home: Home,
  diagnosis: DiagnosisDemo,
  explain: EasyExplainDemo,
  cashflow: CashflowDemo,
  budget: BudgetGuardDemo,
  deposit: SuspiciousDepositDemo,
  report: ReportDemo
};

function App() {
  const [activeScreen, setActiveScreen] = useState("home");
  const ActiveScreen = screens[activeScreen] || Home;

  function navigate(screen) {
    setActiveScreen(screen);
    window.requestAnimationFrame(() => {
      const viewport = document.querySelector(".screen");
      if (viewport) viewport.scrollTop = 0;
    });
  }

  return (
    <PhoneFrame activeScreen={activeScreen} onNavigate={navigate}>
      <ActiveScreen onNavigate={navigate} />
    </PhoneFrame>
  );
}

export default App;