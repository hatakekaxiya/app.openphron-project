import { useContext } from "react";
import { ContractContext } from "../context";
import { useEthersSigner } from "utils/useSigner";
import { useAccount } from "wagmi";
import { createNotification } from "utils";

const useAuth = () => {
  const { state, update } = useContext(ContractContext) as ContractContextValue;
  const { signer } = useEthersSigner();
  const { address } = useAccount();

  const getSignature = () => {
    try {
      if (!address) throw new Error("Please connect wallet");
      const _signature = localStorage.getItem(address);
      if (!_signature) throw new Error("Please signe in wallet");
      update({ isAuth: true, isLoading: false });
    } catch (error: any) {
      console.error("Error getting signature:", error.message);
      update({ isAuth: false, isLoading: false });
    }
  };

  const sign = async () => {
    try {
      const message = "welcome to openPhron";
      if (!signer || !address)
        throw new Error("No signer found. Please connect to MetaMask.");
      const signature = await signer.signMessage(message);
      console.log("signature: ", signature);
      localStorage.setItem(
        address,
        JSON.stringify({
          signature,
          message,
        })
      );
      createNotification("success", "Signed in successfully!");
      update({ isAuth: true });
    } catch (error: any) {
      console.error("Error signing message:", error.message);
      alert(error.message);
    }
  };

  return {
    isAuth: state.isAuth,
    getSignature,
    sign,
  };
};

export default useAuth;