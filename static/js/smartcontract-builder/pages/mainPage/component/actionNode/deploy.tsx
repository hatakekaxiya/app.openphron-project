import { useState } from "react";
import { Loader } from "lucide-react";
import { useEthersSigner } from "../../../../../utils/useSigner";
import { Button } from "../../../../../components/ui/button";
import useToDeployContract from "../../../../hooks/deploy";
import useContracts from "../../../../hooks/contracts";
import useContract from "../../../../hooks/contract";
import ConstructorInputs from "./constructorInputs";
import { Deploy } from "../../../../utils/deploy";
import ErrorPanel from "./errorPanel";
import { Badge } from "../../../../../components/ui/badge";

function DeployContract(props: any) {
  const { constructorInfo, abi, bytecode, setIsDeployed } = props;
  const { testContract, addDeployedContract, currentContract } = useContract();
  const { isLoading, setIsLoading } = useContracts();

  const { signer, chainId } = useEthersSigner();

  const { saveToLocalStorage } = useToDeployContract();
  const [constructorValues, setConstructorValues] = useState(
    Array(constructorInfo.length).fill("")
  );
  const [result, setResult] = useState<any>({ form: "test", message: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...constructorValues];
    newValues[index] = value;
    setConstructorValues(newValues);
  };

  const deploy = async () => {
    try {
      const address = await Deploy(constructorValues, abi, bytecode, signer);
      saveToLocalStorage({ address, abi, chainId });
      setIsDeployed(true);
      addDeployedContract(address, abi, chainId, currentContract.id);
    } catch (error: any) {
      console.log("Deploy Error: ", error.message);
      setIsDeployed(false);
    }
  };

  const runTest = async () => {
    try {
      setResult({ form: "test", message: "" });
      setIsLoading(true);
      setIsModalOpen(true);
      const _result = await testContract();
      if (!_result) throw new Error("Server Error!");
      setResult({
        form: "test",
        message: _result.success ? _result.output : _result.error,
      });
    } catch (error: any) {
      setIsModalOpen(false);
      console.log("Test Error: ", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="deploy-contract text-black">
      <div className="deploy-panel">
        <h2 className="deploy-title">Contract Ready to Deploy</h2>
        <div className="deploy-content">
          <ConstructorInputs
            constructorInfo={constructorInfo}
            onInputChange={handleInputChange}
          />
          <div className="button-group">
            <Button className="h-10" onClick={deploy}>
              <span className="button-icon">🚀</span>
              Deploy Contract
            </Button>
            {isLoading ? (
              <Button className="testing-button" disabled>
                <Loader className="button-icon animate-spin" size={18} />
              </Button>
            ) : (
              <div className="flex flex-col items-end gap-1">
                <Button
                  onClick={runTest}
                  variant="outline"
                  className="h-10"
                  // className="test-button"
                >
                  <span className="button-icon">🧪</span>
                  Test Contract
                </Button>
                <Badge variant="yellow" className="-mt-3 -mr-3">
                  Beta
                </Badge>
              </div>
            )}
          </div>
        </div>
        <ErrorPanel
          errors={result}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </div>
  );
}

export default DeployContract;
