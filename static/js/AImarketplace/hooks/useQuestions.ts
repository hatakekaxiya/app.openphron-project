import { useMemo } from "react";
import { useGlobalContext } from "../context";
import serverProvider from "../service/serverProvider";

const useQuestions = () => {
    const { state, update } = useGlobalContext() as OracleContextValue;
    const questions = useMemo(() => {
        return state.questions
    }, [state.questions])

    const updateQuestions = async (): Promise<void> => {
        try {
            const questions = await serverProvider.getQuestions();
            update({ questions });
        } catch (error: any) {
            update({ questions: [] });
            console.error("updateQuestionsError: ", error.message);
        }
    };

    const questionForOracle = (oracleId: string): Question[] => {
        if (!oracleId) {
            throw new Error("Oracle ID cannot be empty");
        }
        return state.questions.filter((question: Question) => question.oracleId === oracleId);
    };

    return {
        questions: state.questions,
        updateQuestions,
        questionForOracle
    };
};

export default useQuestions;