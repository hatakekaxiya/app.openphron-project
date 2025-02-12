import React, { createContext, useState, ReactNode } from "react";

export const ContractContext = createContext<ContractContextValue | undefined>(
  undefined
);

const initState: ContractState = {
  address: "",
  stepId: 0,
  contractId: 0,
  contracts: [],
  workflows: [],
  workflowId: 0,
  isLoading: true,
  isUserActive: true,
  isFinalStep: false,
  isUpgradeModalVisible: false,
  someOracles: [],
  total_token: 10000000000,
  isAuth: false,
  newTypingMessage: undefined,
  chatMode: localStorage.getItem("chatMode") || "Basic",
};

const ContractContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<ContractState>(initState);

  const update = (newState: any) => {
    if (newState.chatMode) {
      localStorage.setItem("chatMode", newState.chatMode);
    }
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  return (
    <ContractContext.Provider value={{ state, update }}>
      {children}
    </ContractContext.Provider>
  );
};

export default ContractContextProvider;
