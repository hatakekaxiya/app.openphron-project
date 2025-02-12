import { useContext, useEffect, useMemo, useRef, useState } from "react";

import ApprovePanel from "./approvePanel";
import useContract from "../../../../hooks/contract";
import ContentViewer from "../../../../components/contentViewer";
import "./chathistory.scss";
import useTypeWriterEffect from "smartcontract-builder/hooks/typewriter";
import { ContractContext } from "smartcontract-builder/context";
import { TypewriterEffect } from "../../../../../components/shared/TypewriterEffect";
import ToTopButton from "../../../../components/totop-button";

const ChatHistory: React.FC = () => {
  const { currentContract, currentMessages, stepId } = useContract();
  const { newTypingMessage } = useTypeWriterEffect();

  const contentRef = useRef<any>(null);

  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }, [currentMessages.history.length, stepId]);

  const newTypingMessageId = useMemo(() => {
    if (!newTypingMessage) return;
    if (!currentContract) return;
    if (newTypingMessage.contractId !== currentContract._id) return;
    if (newTypingMessage.stepId !== stepId) return;
    return newTypingMessage.index;
  }, [currentMessages, newTypingMessage, currentContract, stepId]);

  return (
    <div ref={contentRef} className="chat-history">
      {/* <ToTopButton /> */}
      {currentMessages.history.map((msg: Message, index: number) => (
        <ChatMessage
          key={index}
          message={msg}
          isTypingMessage={index == newTypingMessageId}
        />
      ))}
      <ApprovePanel />
    </div>
  );
};

const ChatMessage = ({
  message,
  isTypingMessage,
}: {
  message: Message;
  isTypingMessage: boolean;
}) => {
  const { cleanTypingMessage } = useTypeWriterEffect();
  const { update } = useContext(ContractContext) as ContractContextValue;
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isTypingMessage) {
      update({ isLoading: true });
      setIsTyping(true);
      cleanTypingMessage();

      setTimeout(() => {
        setIsTyping(false);
        update({ isLoading: false });
      }, 5000);
    }
  }, [isTypingMessage]);

  return (
    <div
      className={`chat-message ${
        message?.role === "user"
          ? "user-message"
          : "glassy-background other-message"
      }`}
    >
      <div className="message-content px-4 py-1">
        {isTyping ? (
          <TypewriterEffect text={message.content} speed={50} />
        ) : (
          <ContentViewer content={message?.content} />
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
