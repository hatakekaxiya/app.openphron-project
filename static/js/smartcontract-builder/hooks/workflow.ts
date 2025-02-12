import { useContext, useMemo } from "react";
import { ContractContext } from "../context";
import serverProvider from "../service/server";

const useWorkflow = () => {
    const { state, update } = useContext(ContractContext) as ContractContextValue;

    const updateWorkflow = async () => {
        try {
            if (!state.isAuth) throw new Error("Please sign in!");
            const workflows: Workflow[] | any = await serverProvider.getWorkflows();
            update({ workflows });
        } catch (error: any) {
            update({ workflows: [] });
            console.log("updateWorkflowError: ", error.message);
        }
    };

    const workflow = useMemo<Workflow | undefined>(() => {
        if (state.workflows.length === 0) return undefined;
        return state.workflows[state.workflowId];
    }, [state.workflowId, state.workflows]);

    return { workflow, updateWorkflow };
};

export default useWorkflow;