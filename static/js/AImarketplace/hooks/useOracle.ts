import { useMemo } from "react";
import { ethers } from "ethers";
import { useGlobalContext } from "../context";
import { marketplaceContract } from "../blockchain";
import useQuestions from "./useQuestions";
import { useEthersSigner } from "../../utils/useSigner";

const useOracle = ({ id }): UseOracleReturn => {
    const { state } = useGlobalContext() as OracleContextValue;
    const { updateQuestions } = useQuestions() as UseQuestionsReturn;
    const { signer } = useEthersSigner();

    const oracle: any = useMemo(() => {
        const _oracle = state.oracles.find(oracle => oracle.id === id);
        if (state.oracles.length === 0 || !_oracle) return "";
        return _oracle;
    }, [state.oracles, id]);

    const subscribe = async (userContract: string) => {
        console.log('value', ethers.utils.parseUnits(String(oracle.subscriptionPrice)));
        if (!signer || !oracle) return;
        try {
            const tx = await marketplaceContract.connect(signer).subscribe(id, userContract, {
                value: ethers.utils.parseUnits(String(oracle.subscriptionPrice))
            });
            await tx.wait();
        } catch (error) {
            console.error("Subscription failed:", error);
        }
    };

    const addQuestion = async (question: string, answer: string) => {
        if (!signer) return;
        try {
            const tx = await marketplaceContract.connect(signer).addQuestion(id, question, answer);
            await tx.wait();
            await updateQuestions();
        } catch (error) {
            console.error("Adding question failed:", error);
        }
    };

    const updateQuestion = async (questionId: string, answer: string) => {
        if (!signer) return;
        try {
            console.log("updateQuestion", id, questionId, answer)
            const tx = await marketplaceContract.connect(signer).updateQuestion(id, questionId, answer);
            await tx.wait();
        } catch (error) {
            console.error("Updating question failed:", error);
        }
    };

    return {
        oracle,
        subscribe,
        addQuestion,
        updateQuestion
    };
};

export default useOracle;