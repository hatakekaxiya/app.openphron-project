import { useContext, useState } from "react";
import { Send } from "lucide-react";
import { useAccount } from "wagmi";

import useContracts from "smartcontract-builder/hooks/contracts";
import { Textarea } from "../../../../../components/ui/textarea";
import LoadingButton from "../../../../components/buttons";
import { ContractContext } from "../../../../context";
import useContract from "../../../../hooks/contract";
import useCost from "../../../../hooks/cost";
import "./chatinput.scss";

const ChatInput = () => {
  const { state, update } = useContext(ContractContext) as ContractContextValue;
  const { currentContract, sendMessage } = useContract() as UseContractReturn;
  const { setIsUserActive } = useContracts();

  const [userInput, setUserInput] = useState("");

  const handleSendMessage = async () => {
    if (state.isLoading) return;
    if (!userInput.trim()) return;
    setUserInput("");
    await sendMessage(currentContract?._id, userInput);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      console.log("Enter key pressed");
      handleSendMessage();
    }
  };

  const changeInput = (value: string) => {
    if (!state.isUserActive) setIsUserActive(true);
    setUserInput(value);
  };

  return (
    <div id="chat-input-container" className="chat-input-container">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex-grow">
          <Textarea
            className="chat-input rounded-[6px]  min-h-[80px] resize-none"
            placeholder="Type your message here..."
            value={userInput}
            onChange={(e) => changeInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="input-actions">
          <LoadingButton
            className="rounded-[6px] h-10 px-4"
            disabled={state.isLoading || userInput.trim() === ""}
            onClick={handleSendMessage}
          >
            {!state.isLoading && <Send className="w-4 h-4 mr-2" />}
            Send
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;