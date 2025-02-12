import React, { useContext, useEffect, useMemo, useState } from "react";

import { Button } from "../../../../../components/ui/button";
import { ContractContext } from "../../../../context";
import useContract from "../../../../hooks/contract";
import useWorkflow from "../../../../hooks/workflow";
import { Loader } from "lucide-react";

const ApprovePanel = () => {
  const { state } = useContext(ContractContext) as ContractContextValue;
  const { stepId, currentMessages, approve } = useContract();
  const { workflow } = useWorkflow();
  const [autoApproveTime, setAutoApproveTime] = useState(15);

  const isAvailableToApprove = useMemo(() => {
    // if (!state.isLoading) return false;
    if (!workflow) return false;
    if (currentMessages.history.length === 0) return false;

    const assistor = workflow.assistors[stepId];
    if (currentMessages.history.length >= assistor.minChatCount * 2)
      return true;
  }, [state.contracts, currentMessages, stepId, state.isLoading]);

  useEffect(() => {
    setAutoApproveTime((autoApproveTime) => (state.isLoading ? 100 : 20));
  }, [stepId, state.isLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAutoApproveTime((autoApproveTime) => {
        if (autoApproveTime <= 0) return 0;
        return autoApproveTime - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const isAutoApprovable = useMemo(() => {
    if (state.isUserActive) return false;
    if (!workflow || workflow.assistors[stepId].isAuto == false) return false;
    if (state.isLoading) return false;
    return true;
  }, [autoApproveTime, state.isUserActive, workflow, state.isLoading]);

  useEffect(() => {
    if (!isAutoApprovable) return;
    if (autoApproveTime > 0) return;
    approve();
  }, [autoApproveTime, isAutoApprovable]);

  return (
    <div className="flex items-center justify-center mt-5">
      {!isAvailableToApprove ? (
        <></>
      ) : isAutoApprovable == true ? (
        <Button
          size="lg"
          className="approve-button w-fit"
          onClick={approve}
          disabled={state.isLoading}
        >
          {state.isLoading ? <Loader className="animate-spin" /> : null}
          Approve ({autoApproveTime})
        </Button>
      ) : (
        <Button
          size="lg"
          className="approve-button w-fit"
          onClick={approve}
          disabled={state.isLoading}
        >
          {state.isLoading ? <Loader className="animate-spin" /> : null}
          Approve
        </Button>
      )}
    </div>
  );
};

export default ApprovePanel;
