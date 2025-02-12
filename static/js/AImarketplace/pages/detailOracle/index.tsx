import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Button } from "../../../components/ui/button";
import useOracle from "../../hooks/useOracle";
import useQuestions from "../../hooks/useQuestions";
import TextField from "../../components/textField";
import QuestionAnswer from "../../components/question";
import Modal from "../../components/modal";
import image from "../../assets/oracleImage.webp";
import "./index.scss";

const DetailOracle = () => {
  const { id } = useParams();
  const { oracle, subscribe } = useOracle({ id }) as UseOracleReturn;
  const { questions } = useQuestions();
  const { name, description, subscriptionPrice } = oracle as Oracle;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isData, setIsData] = useState("Loading...");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    setTimeout(() => {
      console.log("nodata");
      if (!oracle) setIsData("No Data!");
    }, 5000);
  }, [oracle]);

  return (
    <div className="py-5">
      {!oracle ? (
        <div className="loading">
          <h1 className="no-data">{isData}</h1>
          {isData !== "No Data!" && <div className="loader"></div>}
        </div>
      ) : (
        <div className="flex items-start max-w-[1390px] gap-6 mx-auto px-4 xl:px-0">
          <SubScribleModal
            subscribe={subscribe}
            isModalOpen={isModalOpen}
            closeModal={closeModal}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="w-full space-y-4 bg-white p-1 rounded-2xl">
              <img
                src={image}
                alt="oracle-detail-image"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-8 lg:col-span-2 w-full">
              <div className="bg-white w-full rounded-3xl p-5 md:p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-blue-800 mb-4">
                  {name}
                </h2>
                <p className="text-gray-600 mb-4">{description} </p>
                <div className="flex flex-wrap gap-4 justify-between items-center">
                  <span className="text-2xl font-bold text-teal-600">
                    {subscriptionPrice}
                  </span>
                  <Button
                    onClick={openModal}
                    className="w-full sm:w-auto text-white font-bold py-2 px-6 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
            <QuestionContrainer questions={questions} oracle={oracle} />
          </div>
        </div>
      )}
    </div>
  );
};

const QuestionContrainer = ({ questions, oracle }) => {
  return (
    <div className="w-full space-y-4">
      {!oracle ? (
        <></>
      ) : (
        questions &&
        questions.map((question: Question, index) =>
          oracle && question.oracleId === oracle.id ? (
            <QuestionAnswer
              key={index}
              oracle={oracle}
              question={question}
              questionId={question.id}
            />
          ) : (
            ""
          )
        )
      )}
    </div>
  );
};

const SubScribleModal = ({ subscribe, isModalOpen, closeModal }) => {
  const [contractAddress, setContractAddress] = useState("");
  const [isLoading, setLoading] = useState(false);

  const onSubscribe = async () => {
    try {
      setLoading(true);
      await subscribe(contractAddress);
      setLoading(false);
      closeModal();
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title={"Subscribe this Oracle"}
    >
      <TextField
        value={contractAddress}
        type="text"
        tagType="input"
        onChange={(e) => setContractAddress(e.target.value)}
        label="Contract Address Please"
      />

      <Button onClick={onSubscribe} disabled={isLoading}>
        {isLoading ? "Loading" : "SUBSCRIBE"}
      </Button>
    </Modal>
  );
};

export default DetailOracle;