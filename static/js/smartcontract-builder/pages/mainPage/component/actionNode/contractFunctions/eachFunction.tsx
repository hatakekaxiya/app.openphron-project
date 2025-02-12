import { useState } from 'react';
import { Button, Input } from '@mui/material';
import { East, South } from '@mui/icons-material';
import { displayData, validateParameters } from '../../../../../utils';

function EachFunction({ functionInfo, contractInStorage }) {
    const { name, inputInfos, stateMutability } = functionInfo;

    const [showDetailInfo, setShowDetailInfo] = useState(false);
    const [result, setResult] = useState<any>("");
    const [inputValues, setInputValues] = useState(
        Array(inputInfos.length).fill("")
    );

    const handleInputChange = (index: number, value: any) => {
        const newValues = [...inputValues];
        newValues[index] = value;
        setInputValues(newValues);
    };

    const transact = async () => {
        try {
            if (!contractInStorage) throw new Error("Contract instance is not initialized.");
            if (!validateParameters(inputValues)) return;
            const tx = await contractInStorage.contract[name](...inputValues);
            if (stateMutability === "view") {
                setResult(tx);
            } else {
                await tx.wait();
            }
        } catch (error: any) {
            console.error("Error executing transaction:", error.message);
        }
    };

    const openOrClose = () => {
        setShowDetailInfo(prev => !prev);
        if (inputInfos.length === 0) transact();
    }

    return (
        <div className='each-function'>
            <Button variant="contained" className={stateMutability === "view" ? "button" : "run-button button"} onClick={openOrClose}>
                {name}
                {showDetailInfo ? <South className='icon' /> : <East className='icon' />}
            </Button>
            {
                showDetailInfo &&
                <>
                    <Inputs inputInfos={inputInfos} handleInputChange={handleInputChange} />
                    <h5 className='result' >{displayData(result)}</h5>
                </>
            }
            {
                showDetailInfo && inputInfos.length > 0 &&
                <Button variant='contained' color='success' className='transact button' onClick={transact}>
                    {stateMutability == "view" ? "call" : "transact"}
                </Button>
            }
        </div>
    );
}

const Inputs = (props: any) => {
    const { inputInfos, handleInputChange } = props;
    return (
        <div className='labels-inputs' >
            <div className='labels' >
                {
                    inputInfos.map((inputInfo: any, index: number) => <h4 key={index} >{inputInfo.name}</h4>)
                }
            </div>
            <div className='inputs' >
                {
                    inputInfos.map((inputInfo: any, index: number) =>
                        <Input key={index} className='input' onChange={(e: any) => handleInputChange(index, e.target.value)} placeholder={`${inputInfo.type}`} />
                    )
                }
            </div>

        </div>
    )
}

export default EachFunction