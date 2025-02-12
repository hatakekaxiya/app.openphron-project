import { Contract } from "ethers";
import { useAccount } from "wagmi";
import serverProvider from "../service/server";
import { useEthersSigner } from "../../utils/useSigner";
import useContract from "./contract";

const useToDeployContract = () => {
  const { currentContract } = useContract();
  const { signer } = useEthersSigner();
  const account = useAccount();

  const saveToLocalStorage = ({ address, abi, chainId }: any) => {
    try {
      const contractToDeploy = {
        userAddress: account.address,
        address,
        abi,
        chainId,
        timestamp: new Date().toISOString(),
      };
      const _deployedContracts: any = localStorage.getItem(currentContract.id);
      let deployedContracts: any = JSON.parse(_deployedContracts);

      if (!deployedContracts) {
        localStorage.setItem(
          currentContract.id,
          JSON.stringify([contractToDeploy])
        );
      } else {
        deployedContracts.push(contractToDeploy);
        localStorage.setItem(
          currentContract.id,
          JSON.stringify(deployedContracts)
        );
      }
      return contractToDeploy;
    } catch (error: any) {
      console.log("saveToLocalStorage Error!", error.message);
    }
  };

  const deleteContract = (id: any) => {
    try {
      if (!window.confirm("Do you want delete this contract?")) return;
      const _deployedContracts: any = localStorage.getItem(currentContract.id);
      const deployedContracts = JSON.parse(_deployedContracts);
      deployedContracts.splice(id, 1);
      localStorage.setItem(
        currentContract.id,
        JSON.stringify(deployedContracts)
      );
      return deployedContracts;
    } catch (error: any) {
      console.log("deleteContract Error!", error.message);
    }
  };

  const getDeployedContracts = async (): Promise<any> => {
    try {
      const _deployedContracts: any = localStorage.getItem(currentContract.id);
      let deployedContracts = JSON.parse(_deployedContracts);
      // deployedContracts = await serverProvider.getDeployedContract(
      //   currentContract.id
      // );

      console.log("deployedContracts", deployedContracts);
      if (!deployedContracts) {
        deployedContracts = await serverProvider.getDeployedContract(
          currentContract.id
        );
        console.log("deployedContracts from req", deployedContracts);
        if (!deployedContracts) return [];
      }

      return deployedContracts.map((item: any, index: any) => ({
        ...item,
        contract: new Contract(item.address, item.abi, signer),
      }));
    } catch (error: any) {
      console.log("getDeployedContracts Error!", error.message);
      return [];
    }
  };

  return {
    saveToLocalStorage,
    getDeployedContracts,
    deleteContract,
  };
};

export default useToDeployContract;
