import { useContext } from "react";
import { ContractContext } from "../context";

const useTypeWriterEffect = () => {
    const { state, update } = useContext(ContractContext) as ContractContextValue;

    const updateTypingMessage = (contractId: string, stepId: number, index: number) => {
        console.log("updateTypingMessage", contractId, stepId, index)
        update({ newTypingMessage: { contractId, stepId, index } })
    }

    const cleanTypingMessage = () => {
        update({ newTypingMessage:undefined})
    }

    return {
        newTypingMessage: state.newTypingMessage,
        updateTypingMessage,
        cleanTypingMessage
    }
}

export default useTypeWriterEffect;