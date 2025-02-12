import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "@rainbow-me/rainbowkit/styles.css";

import Dashboard from "./smartcontract-builder/pages/dashboard";
import OracleList from "./AImarketplace/pages/oracleLists";
import MainPage from "./smartcontract-builder/pages/mainPage";
import CreateOracle from "./AImarketplace/pages/createOracle";
import DetailOracle from "./AImarketplace/pages/detailOracle";
import Subscriptions from "./AImarketplace/pages/subscriptions";
import ContractContextProvider from "./smartcontract-builder/context";
import OracleContextProvider from "./AImarketplace/context";
import Signature from "./smartcontract-builder/components/authentication";
import UpgradeModal from "./smartcontract-builder/pages/mainPage/component/upgrade";
import DashboardLayout from "./components/shared/CustomLayout";
import "./App.css";

const App: React.FC = () => {
  return (
    <OracleContextProvider>
      <ContractContextProvider>
        <Router>
          <DashboardLayout>
            <Routes>
              <Route path="/oracle/detail/:id" element={<DetailOracle />} />
              <Route path="/create-oracle" element={<CreateOracle />} />
              <Route path="/oracle" element={<OracleList />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Signature />} />
              <Route path="/agent" element={<MainPage />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/upgrade" element={<UpgradeModal />} />
            </Routes>
          </DashboardLayout>
        </Router>
      </ContractContextProvider>
    </OracleContextProvider>
  );
};

export default App;
