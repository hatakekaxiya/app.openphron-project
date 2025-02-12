import { useContext, useMemo } from "react";
import { useAccount } from "wagmi";

import { ContractContext } from "../context";
import serverProvider from "../service/server";
import useContracts from "./contracts";
import useWorkflow from "./workflow";
import useCost from "./cost";
import { tokenize } from "../utils";
import { checkError, createNotification } from "utils";
import useTypeWriterEffect from "./typewriter";

const useContract = () => {
  const { address } = useAccount();
  const { state, update } = useContext(ContractContext) as ContractContextValue;
  const { updateContracts }: any = useContracts();
  const { workflow } = useWorkflow();
  const { getToken, reduceToken } = useCost();
  const { updateTypingMessage } = useTypeWriterEffect();

  const currentContract: any = useMemo(() => {
    if (state.contracts.length === 0) return null;
    return state.contracts[state.contractId];
  }, [state.contractId, state.contracts]);

  const currentMessages = useMemo(() => {
    if (!currentContract || !currentContract.steps[state.stepId])
      return { history: [] };
    return currentContract.steps[state.stepId];
  }, [state.stepId, currentContract]);

  const results: any[] = useMemo(() => {
    if (!currentContract) return [];
    if (!workflow) return [];
    return currentContract.steps.map((step: Step, index: number) => ({
      name: workflow.assistors[index].name,
      content: step.result,
    }));
  }, [currentContract, workflow]);

  // const contractCode: string = useMemo(() => {
  //   if (!workflow) return "";
  //   if (!workflow.parameters) return "";
  //   if (results.length < workflow.parameters.contractNode + 1) return "";
  //   const code = results[workflow.parameters.contractNode].content;

  //   return code;
  // }, [results]);

  const contractCode: string = useMemo(() => {
    if (results.length < 3) return "";
    return results[2].content;
  }, [results]);

  const testCode: string = useMemo(() => {
    if (results.length < 4) return "";
    return results[3].content;
  }, [results]);

  // const testCode: string = useMemo(() => {
  //   if (!workflow) return "";
  //   if (!workflow.parameters) return "";
  //   if (results.length < workflow.parameters.testNode + 1) return "";
  //   return results[workflow.parameters.testNode].content;
  // }, [results]);

  const createContract = async (idea: string, chatMode: string) => {
    try {
      if (!state.isAuth) {
        createNotification("error", "Please sign in!");
        return;
      }
      update({ isLoading: true });
      let data = {
        userAddress: address,
        initMessage: idea,
        chatMode: chatMode,
      };
      let contract = await serverProvider.createContract(data);
      checkError(contract);
      updateTypingMessage(contract._id, 0, 1);

      _addContract(contract);
      await getToken();
      update({ contractId: state.contracts.length, stepId: 0 });
      update({ isLoading: false });
      return contract;
    } catch (error: any) {
      update({ isLoading: false, isUserActive: true });
      checkError(error.message, true);
      console.log("createContractError: ", error.message);
    }
  };

  const sendMessage = async (
    _id: string | undefined,
    message: string,
    _stepId?: number,
    isApprove: boolean = false
  ) => {
    try {
      if (!state.isAuth) {
        createNotification("error", "Please sign in!");
        return;
      }
      if (!_id) {
        createNotification("error", "No contract found.");
        return;
      }
      if (state.total_token < tokenize(message)) {
        update({ isUpgradeModalVisible: true });
        return false;
      }
      await reduceToken(tokenize(message));

      update({ isLoading: true });

      const stepId = !_stepId ? state.stepId : _stepId;
      _addMessage(stepId, { role: "user", content: message });
      const data = { _id, stepId, content: message };

      const botResponse = await serverProvider.sendMessage({
        ...data,
        chatMode: state.chatMode,
      });

      // checkError(botResponse);
      // typeWriteEffect
      // updateTypingMessage(
      //   _id,
      //   stepId,
      //   isApprove ? 1 : currentMessages?.history.length
      // );

      checkError(botResponse);
      updateTypingMessage(
        _id,
        stepId,
        isApprove ? 1 : currentMessages?.history.length
      );

      _addMessage(stepId, botResponse.responseMessage);
      await getToken();
      await updateContracts(address);

      return botResponse.responseMessage ? true : false;
    } catch (error: any) {
      update({ isLoading: false, isUserActive: true });
      checkError(error.message, true);
      console.log("sendMessageError: ", error.message);
    }
  };

  const _addMessage = (stepId: number, message: any) => {
    if (typeof message == "string") return;
    const contracts = [...state.contracts];
    contracts[state.contractId].steps[stepId].history.push(message);
    update({ contracts: contracts });
  };

  const _addContract = (contract: Contract | string) => {
    if (typeof contract == "string") return;
    update({ contracts: [...state.contracts, contract] });
  };

  const approve = async () => {
    try {
      update({ isLoading: true });

      const result = await _saveResult();

      checkError(result);

      if (state.stepId === currentContract.steps.length - 1) {
        update({ isFinalStep: true });
        await updateContracts(address);
        update({ isLoading: false });
        return;
      }

      const response = await sendMessage(
        currentContract._id,
        result,
        state.stepId + 1,
        true
      );

      update({ stepId: state.stepId + 1 });
      update({ isLoading: false, isUserActive: !response });
    } catch (error: any) {
      update({ isLoading: false, isUserActive: true });
      console.log("approveError: ", error.message);
    }
  };

  const _saveResult = async () => {
    try {
      if (!currentContract) throw new Error("No contract");
      const data = {
        _id: currentContract._id,
        stepId: state.stepId,
      };
      const result = await serverProvider.saveResult({
        ...data,
        chatMode: state.chatMode,
      });

      return result;
    } catch (error: any) {
      console.log("saveResultError: ", error.message);
    }
  };

  const changeStepId = (id: number) => {
    if (!currentContract) {
      createNotification("error", "No contract found.");
      return;
    }
    if (id < 0 || currentContract.steps[id].history.length === 0) {
      createNotification("error", "There are no messages in this step.");
      return;
    }

    update({
      stepId: id,
      isFinalStep: false,
      isUserActive: true,
    });
  };

  const changeToFinalStep = () => {
    if (!results[results.length - 2]?.content) {
      createNotification("error", "There is no result available.");
      return;
    }
    update({ isFinalStep: true });
  };

  const deleteContract = async (id: string) => {
    try {
      if (!window.confirm("Are you sure you want to delete this contract?"))
        return;
      // let _id = state.contracts[id]._id;
      const result = await serverProvider.deleteContract(id);
      checkError(result);
      // update({ contractId: id > 0 ? id - 1 : 0 });
      await updateContracts(address);
    } catch (error: any) {
      console.log("deleteContractError: ", error.message);
    }
  };

  const compileContract = async (contractCode: string): Promise<any> => {
    try {
      console.log("contractCode", contractCode);
      if (!contractCode) return null;
      let reply = await serverProvider.compileContract(contractCode);
      checkError(reply);
      return reply;
    } catch (error: any) {
      console.log("compile-contract-error: ", error.message);
      checkError(error.message, true);
    }
  };

  const testContract = async (): Promise<any> => {
    try {
      if (!testCode) throw new Error("TestScript is wrong!");
      let reply: any = await serverProvider.testContract(
        testCode,
        contractCode
      );
      // checkError(reply);
      return reply;
    } catch (error: any) {
      console.log("test-error: ", error.message);
      checkError(error.message, true);
    }
  };

  const addDeployedContract = async (
    contractAddress: string,
    abi: any,
    chainId: string,
    contractId: string
  ) => {
    try {
      if (!state.isAuth) {
        createNotification("error", "Please sign in!");
        return;
      }
      update({ isLoading: true });
      let data = {
        userAddress: address,
        contractAddress: contractAddress,
        abi: abi,
        chainId: chainId,
        contractId: contractId,
      };
      let contract = await serverProvider.addDeployedContract(data);
      checkError(contract);
      updateTypingMessage(contract._id, 0, 1);

      await getToken();
      //update({ contractId: state.contracts.length, stepId: 0 });
      update({ isLoading: false });
      return contract;
    } catch (error: any) {
      update({ isLoading: false, isUserActive: true });
      checkError(error.message, true);
      console.log("createContractError: ", error.message);
    }
  };

  return {
    currentMessages,
    currentContract,
    stepId: state.stepId,
    isFinalStep: state.isFinalStep,
    results,
    contractCode,
    testCode,
    addDeployedContract,
    createContract,
    sendMessage,
    approve,
    changeStepId,
    changeToFinalStep,
    deleteContract,
    compileContract,
    testContract,
  };
};

export default useContract;
