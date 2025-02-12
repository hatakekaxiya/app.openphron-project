import { useEffect, useMemo, useState } from "react";
// import "./index.scss";
import ContractFunctions from "./functions";
import useToDeployContract from "../../../../../hooks/deploy";
import {
  Close,
  CopyAll,
  KeyboardArrowDown,
  KeyboardArrowRight,
  Done,
} from "@mui/icons-material";
import { Button } from "../../../../../../components/ui/button";

function DeployedContracts({ isDeployed }) {
  const { getDeployedContracts } = useToDeployContract();
  // const deployedContracts: DeployedContract[] | any = useMemo(() => async()=> {
  //   // const resp = await getDeployedContracts();
  //   return getDeployedContracts();
  // }, [isDeployed]);

  const [deployedContracts, setDeployedContracts] = useState<
    DeployedContract[]
  >([]);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const resp = await getDeployedContracts();
        setDeployedContracts(resp || []);
      } catch (error) {
        console.error("Error fetching deployed contracts:", error);
      }
    };

    fetchContracts();
  }, [isDeployed]);

  console.log("check build", deployedContracts);

  console.log("DeployedContracts Component", deployedContracts);

  return (
    <>
      {deployedContracts.length > 0 && (
        <div className="max-w-[500px] mx-auto deployed-contracts">
          <h2 className="mb-4 font-bold text-lg pt-2">Deployed Contract(s)</h2>
          <div className="deployed-contract-list">
            {deployedContracts.map((contract, index) => (
              <EachContract
                contractInStorage={contract}
                key={index}
                index={index}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

const EachContract = (props) => {
  const { contractInStorage, index } = props;
  const [selectedContract, setSelectedContract] = useState(false);
  const [copied, setCopied] = useState(false);
  const { deleteContract } = useToDeployContract();

  const selectContract = () => setSelectedContract((prev) => !prev);

  const copyAddress = () => {
    try {
      navigator.clipboard.writeText(contractInStorage.address);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error: any) {
      console.log("Error copying address:", error.message);
    }
  };

  return (
    // <div key={index} className="deployed-contract">
    //   {/* <Button variant="outline" onClick={selectContract}> */}
    //   <div className="flex mb-5 items-center gap-6 justify-center">
    //     {selectedContract ? (
    //       <KeyboardArrowDown
    //         className="icon cursor-pointer"
    //         onClick={selectContract}
    //       />
    //     ) : (
    //       <KeyboardArrowRight
    //         className="icon  cursor-pointer"
    //         onClick={selectContract}
    //       />
    //     )}
    //     <span>Address:{contractInStorage.address}</span>
    //     {!copied ? (
    //       <span
    //         onClick={(e) => {
    //           copyAddress();
    //           e.stopPropagation();
    //         }}
    //       >
    //         <CopyAll className="icon" />
    //       </span>
    //     ) : (
    //       <Done className="icon" />
    //     )}

    //     <Button className="px-5" variant="outline" onClick={selectContract}>
    //       <span>
    //         Address:{contractInStorage.address.substring(0, 6)}...
    //         {contractInStorage.address.substring(12, 20)}
    //       </span>
    //       {!copied ? (
    //         <span
    //           onClick={(e) => {
    //             copyAddress();
    //             e.stopPropagation();
    //           }}
    //         >
    //           <CopyAll className="icon" />
    //         </span>
    //       ) : (
    //         <Done className="icon" />
    //       )}
    //     </Button>
    //     <span
    //       onClick={(e) => {
    //         deleteContract(index);
    //         e.stopPropagation();
    //       }}
    //     >
    //       <Close className="w-3 h-3 text-red-500" />
    //     </span>
    //   </div>
    //   {selectedContract && (
    //     <ContractFunctions
    //       contractInStorage={contractInStorage}
    //       abi={contractInStorage.abi}
    //     />
    //   )}
    // </div>
    <div className="deployed-contract">
      <div className="flex mb-5 items-center gap-6 justify-center">
        {selectedContract ? (
          <KeyboardArrowDown
            className="icon cursor-pointer"
            onClick={selectContract}
          />
        ) : (
          <KeyboardArrowRight
            className="icon cursor-pointer"
            onClick={selectContract}
          />
        )}
        {/* <span>Address: {contractInStorage.address}</span> */}
        <Button className="px-5" variant="outline" onClick={copyAddress}>
          <span>
            Address: {contractInStorage.address.substring(0, 6)}...
            {contractInStorage.address.substring(12, 20)}
          </span>
          {!copied ? (
            <CopyAll className="icon" onClick={copyAddress} />
          ) : (
            <Done className="icon" />
          )}
        </Button>
        <span
          onClick={(e) => {
            deleteContract(index);
            e.stopPropagation();
          }}
        >
          <Close className="w-3 h-3 text-red-500" />
        </span>
      </div>
      {selectedContract && (
        <ContractFunctions
          contractInStorage={contractInStorage}
          abi={contractInStorage.abi}
        />
      )}
    </div>
  );
};

export default DeployedContracts;
