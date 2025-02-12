import { useMemo } from "react";
import { CheckIcon } from "lucide-react";

import useContract from "../../../../hooks/contract";
import useWorkflow from "../../../../hooks/workflow";
import "./index.scss";

const Steps = () => {
  const { workflow } = useWorkflow() as UseWorkflowReturn;

  const steps: any = useMemo(() => {
    if (!workflow) return [];
    return workflow.assistors.map((assistor) => assistor.name);
  }, [workflow]);

  return (
    <div
      className="sticky top-0 pt-4 bg bg-[#E5E5FF] z-50 w-full pb-3 place-content-center flex"
      id="steps"
    >
      {steps.map((step: string, index: number) => (
        <div className="flex gap-3 items-center w-full" key={index}>
          <Step
            totalSteps={steps.length}
            step={step}
            index={index}
            key={index}
          />
          <hr className="hidden lg:block w-[70px] border-primary" />
        </div>
      ))}
      {steps.length > 0 && <FinalStep stepId={steps.length} />}
    </div>
  );
};

const Step = ({
  step,
  index,
}: {
  totalSteps: number;
  step: string;
  index: number;
}) => {
  const { stepId, isFinalStep, changeStepId } = useContract();

  const isActive = useMemo(
    () => stepId === index && !isFinalStep,
    [stepId, isFinalStep, index]
  );

  const isCompleted = isFinalStep || stepId > index;
  const stepNumber = index + 1;

  return (
    <div
      className="text-center flex flex-col items-center h-full w-full max-w-[160px]"
      onClick={() => changeStepId(index)}
    >
      <div
        className={`${
          isCompleted || isActive ? "bg-purple-600 text-white" : "bg-white"
        } w-7 h-7 text-xs sm:text-sm sm:w-10 sm:h-10 grid cursor-pointer place-content-center mx-auto rounded-full mb-3`}
        data-state={isActive}
      >
        {isCompleted ? <CheckIcon className="w-4 h-4" /> : `0${stepNumber}`}
      </div>
      <span className="text-[10px] sm:text-xs uppercase tracking-wider">
        {step}
      </span>
    </div>
  );
};

const FinalStep = ({ stepId }: { stepId: number }) => {
  const { isFinalStep, changeToFinalStep } = useContract();
  let stepNumber = Number(stepId) + 1;

  return (
    <div
      className="text-center w-full flex flex-col h-full items-center justify-between max-w-[160px]"
      onClick={() => changeToFinalStep()}
    >
      <div
        className={`${
          isFinalStep ? "bg-purple-600 text-white" : "bg-white"
        } w-7 h-7 text-xs sm:text-base sm:w-10 sm:h-10 grid cursor-pointer place-content-center mx-auto rounded-full mb-3 `}
        data-state={isFinalStep}
      >
        0{stepNumber}
      </div>
      <span className="text-[10px] sm:text-xs uppercase tracking-wider">
        result
      </span>
    </div>
  );
};

export default Steps;
