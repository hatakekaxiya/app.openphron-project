import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import { marketplaceContract } from "../../blockchain";
import { capitalizeSentences } from "../../utils";
import { useEthersSigner } from "../../../utils/useSigner";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import "./index.scss";

const QuestionAnswer = ({ question, questionId, oracle }: any) => {
  const { signer } = useEthersSigner();

  const [openPanel, setOpenPanel] = useState<number | null>(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [answer, setAnswer] = useState<string>(question.answer);

  const updateQuestion = async () => {
    if (!signer) return;

    try {
      console.log("updateQuestion", oracle.id, questionId, answer);
      await marketplaceContract
        .connect(signer)
        .updateQuestion(oracle.id, questionId, answer);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const editOnlyOwner = () => {
    if (!signer) return;

    if (oracle.owner !== (signer && signer._address)) return;
    console.log("owner");
    setIsDisabled(false);
  };

  const togglePanel = (panel: number) => {
    setOpenPanel(openPanel === panel ? null : panel);
    setIsDisabled(true);
  };

  return (
    // <div className="accordion-container">
    //   <div
    //     className={openPanel === 1 ? "accordion-item open" : "accordion-item"}
    //   >
    //     <div className="accordion-header" onClick={() => togglePanel(1)}>
    //       <span className="span">{capitalizeSentences(question.question)}</span>
    //       <span className={`accordion-icon ${openPanel === 1 ? "open" : ""}`}>
    //         +
    //       </span>
    //     </div>

    //     {openPanel === 1 && (
    //       <div className="accordion-content" onClick={editOnlyOwner}>
    //         {isDisabled ? (
    //           <div className="answer div">{capitalizeSentences(answer)}</div>
    //         ) : (
    //           <textarea
    //             disabled={isDisabled}
    //             rows={5}
    //             value={answer}
    //             onChange={(e) => setAnswer(e.target.value)}
    //             className="answer"
    //           />
    //         )}

    //         {oracle && oracle.owner == signer._address && (
    //           <>
    //             {!isDisabled && (
    //               <Button onClick={updateQuestion}>Update Question</Button>
    //             )}
    //           </>
    //         )}
    //       </div>
    //     )}
    //   </div>
    // </div>

    <Accordion type="single" collapsible>
      <AccordionItem
        value="item-1"
        className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl shadow-md overflow-hidden"
      >
        <AccordionTrigger
          onCanPlay={() => togglePanel(1)}
          className="px-6 py-4 text-left text-primary hover:text-purple-600 font-semibold"
        >
          {question.question}
        </AccordionTrigger>
        <AccordionContent
          onClick={editOnlyOwner}
          className="cursor-pointer flex flex-col space-y-3 px-6 pb-4 text-black/70"
        >
          {isDisabled ? (
            <div className="answer div">{capitalizeSentences(answer)}</div>
          ) : (
            <Textarea
              disabled={isDisabled}
              rows={5}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="answer border-gray-300 bg-white"
            />
          )}

          {oracle && oracle.owner == (signer && signer._address) && (
            <>
              {!isDisabled && (
                <Button onClick={updateQuestion}>Update Question</Button>
              )}
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default QuestionAnswer;