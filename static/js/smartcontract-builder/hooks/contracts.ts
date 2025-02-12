import { useContext } from "react";
import { ContractContext } from "../context";
import serverProvider from "../service/server";

const useContracts = () => {
  const { state, update } = useContext(ContractContext) as ContractContextValue;

  const updateContracts = async () => {
    try {
      if (!state.isAuth) throw new Error("Please sign in!");
      const contracts = await serverProvider.getContracts();
      update({ contracts: contracts });

    } catch (error: any) {
      update({ contracts: [] });
      console.log("updateContractsError: ", error.message);
    }
  };

  const changeContract = (id: number) => {
    update({ contractId: id, stepId: 0, isFinalStep: false });
  };

  const setIsUserActive = (bool: boolean) => {
    update({ isUserActive: bool });
  };

  const setIsLoading = (bool: boolean) => {
    update({ isLoading: bool });
  };

  return {
    contractId: state.contractId,
    contracts: state.contracts,
    isLoading: state.isLoading,
    updateContracts,
    changeContract,
    setIsUserActive,
    setIsLoading,
  };
}

export default useContracts;