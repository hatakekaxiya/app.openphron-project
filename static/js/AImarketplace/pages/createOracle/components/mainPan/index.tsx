import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/ui/dialog";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import QuestionAnswer from "../../../../components/question";
import useQuestions from "../../../../hooks/useQuestions";
import useOracle from "../../../../hooks/useOracle";
import Oracle from "../../../oracleLists/components/oracle";
import "./index.scss";

const MainPanel = ({ oracle }) => {
  const { id } = oracle;
  const { questions } = useQuestions();
  const { addQuestion } = useOracle({ id });

  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addtoQuestion = async () => {
    await addQuestion(question, answer);
    setAnswer("");
    setQuestion("");
    closeModal();
  };

  return (
    <div className="flex gap-4 items-start justify-center md:pl-4">
      <div className="questions space-y-4 pt-10 md:pt-0 w-full">
        <h2 className="mb-4 font-semibold text-2xl">Questions</h2>
        {questions &&
          questions.map((q, index) =>
            q.oracleId === oracle.id ? (
              <QuestionAnswer
                key={index}
                question={q}
                oracle={oracle}
                questionId={q.id}
              />
            ) : null
          )}
        <div className="w-full">
          <Button onClick={openModal}>AddQuestion</Button>
        </div>
      </div>

      <div>
        <Oracle oracle={oracle} />
      </div>

      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={question}
              type="text"
              placeholder="Question"
              onChange={(e) => setQuestion(e.target.value)}
            />
            <Input
              value={answer}
              type="text"
              placeholder="Answer"
              onChange={(e) => setAnswer(e.target.value)}
            />
            <Button onClick={addtoQuestion} size="lg" className="p-7 text-lg">
              Add Question
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainPanel;