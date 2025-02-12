import { useEffect, useState } from "react";
import useContract from "../../../../hooks/contract";
import { getConstructorInfo } from "../../../../utils/deploy";
import DeployedContracts from "./contractFunctions";
import DeployContract from "./deploy";
import ErrorPanel from "./errorPanel";
import "./index.scss";
import useContracts from "smartcontract-builder/hooks/contracts";

function ActionNode() {
  const { contractCode, compileContract } = useContract();
  const { setIsLoading } = useContracts();

  const [abi, setAbi] = useState<any>(null);
  const [bytecode, setBytecode] = useState<string>("");
  const [constructorInfo, setConstructorInfo] = useState<any[]>([]);
  const [isDeployed, setIsDeployed] = useState<boolean>(false);
  const [error, setError] = useState<any>({ form: "compile", message: "" });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const compile = async () => {
    try {
      setError({ form: "compile", message: "" });
      setIsModalOpen(true);
      setIsLoading(true);
      const result = await compileContract(contractCode);

      console.log("result", result);
      if (!result) throw new Error("Server Error!");
      if (result.error) {
        setError({
          form: "compile",
          message: result.error,
        });
        return;
      }
      setAbi(result.abi);
      setBytecode(result.bytecode);
      setConstructorInfo(getConstructorInfo(result.abi));
      //   setIsDeployed(true);
      setIsModalOpen(false);
    } catch (error: any) {
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    compile();
  }, []);

  console.log("this is ran");
  console.log("setIsDeployed", isDeployed);

  return (
    <div className="flex flex-col action-node">
      <ErrorPanel
        errors={error}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      {bytecode && (
        <DeployContract
          constructorInfo={constructorInfo}
          abi={abi}
          bytecode={bytecode}
          setIsDeployed={setIsDeployed}
        />
      )}
      {bytecode && <DeployedContracts isDeployed={isDeployed} />}
    </div>

    //open a branch
  );
}

export default ActionNode;
