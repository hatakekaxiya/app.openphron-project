import React, { useEffect, useState } from "react";
import useCost from "../../hooks/cost";
import AILibraryGrid from "./component/aiLibraryGrid";
import WorkflowSteps from "./component/workFlowSteps";
import UpgradeModal from "../mainPage/component/upgrade";
import "./index.scss";
import useAuth from "smartcontract-builder/hooks/auth";
import { useNavigate } from "react-router-dom";
import RequirementsForm from "../../../components/RequirementsForm";

const Dashboard = () => {
  const { upgradeModalVisible, closeUpgradeModal } = useCost();
  const { isAuth } = useAuth();
  const navigator = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigator("/");
    }
  }, [isAuth]);

  return (
    <div className="w-full">
      {upgradeModalVisible && (
        <UpgradeModal visible={true} onClose={closeUpgradeModal} />
      )}
      {/* <RequirementsForm /> */}
      <WorkflowSteps />
    </div>
  );
};

export default Dashboard;
