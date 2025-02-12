import React, { useState } from 'react';
import { cleanErrorMessage } from 'smartcontract-builder/utils/deploy';
import useContracts from 'smartcontract-builder/hooks/contracts';
import useContract from 'smartcontract-builder/hooks/contract';
import ErrorMessage from './errorMessage';
import ErrorModal from './errorModal';

interface ErrorPanelProps {
    errors: {
        form: 'compile' | 'test';
        message: string;
    };
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ErrorPanel(props: ErrorPanelProps) {
    const { errors, isModalOpen, setIsModalOpen } = props;
    const { currentContract, sendMessage, changeStepId } = useContract();
    const { setIsUserActive, isLoading } = useContracts();

    const [isModifyLoading, setIsModifyLoading] = useState(false);

    const handleModify = async () => {
        try {
            if (!currentContract || isLoading) return;
            setIsModifyLoading(true);
            const stepId = errors.form === 'compile' ? 2 : 3; //if compile error, go to step 2(reviewer), if test error, go to step 3(tester)
            await sendMessage(currentContract._id, cleanErrorMessage(errors), stepId);
            changeStepId(stepId);
            setIsUserActive(false);
            setIsModifyLoading(false);
            console.log("Modify");
        } catch (error: any) {
            console.error("Error modifying contract:", error.message);
        } finally {
        }
    };

    return (
        <>
            <ErrorModal
                errors={errors}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                isLoading={isLoading}
                handleModify={handleModify}
                isModifyLoading={isModifyLoading}
            />
            {errors.message && (
                <ErrorMessage
                    errors={errors}
                    handleModify={handleModify}
                    setIsModalOpen={setIsModalOpen}
                    isLoading={isLoading}
                />
            )}
        </>
    );
}

export default ErrorPanel; 