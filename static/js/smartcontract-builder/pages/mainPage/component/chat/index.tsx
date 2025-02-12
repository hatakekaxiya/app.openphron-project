import ChatHistory from "./chathistory";
import ChatInput from "./chatinput";
import useContract from "../../../../hooks/contract";
import useWorkflow from "../../../../hooks/workflow";
import ActionNode from "../actionNode";
import "./index.scss";

const Chat = () => {
  const { workflow } = useWorkflow();
  const { stepId } = useContract();

  return (
    <div className="w-full">
      {workflow &&
      workflow.assistors[stepId] &&
      workflow.assistors[stepId].action ? (
        <ActionNode />
      ) : (
        <>
          <ChatHistory />
          <ChatInput />
        </>
      )}
    </div>
  );
};

export default Chat;
