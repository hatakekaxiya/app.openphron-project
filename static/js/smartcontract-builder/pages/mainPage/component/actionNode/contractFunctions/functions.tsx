import { useMemo } from 'react';
import { getAllFunctionsInfo } from '../../../../../utils/deploy';
import EachFunction from './eachFunction';
import './index.scss';

function ContractFunctions(props: any) {
    const { abi, contractInStorage } = props;

    const functions = useMemo(() => {
        return getAllFunctionsInfo(abi);
    }, [])

    return (
        <div className='contract-functions' >
            {
                functions.map((functionInfo: any, index: number) => (
                    <EachFunction key={index} functionInfo={functionInfo} contractInStorage={contractInStorage} />
                ))
            }
        </div>
    )
}

export default ContractFunctions;