import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import useAuth from "smartcontract-builder/hooks/auth";
import { useEthersSigner } from "utils/useSigner";
import { Button } from "../../../components/ui/button";
import "./index.scss";

const Signature: React.FC = () => {
  const navigate = useNavigate();
  const { isAuth, sign } = useAuth();
  const { signer } = useEthersSigner();

  useEffect(() => {
    if (!isAuth) return;
    navigate("/dashboard");
  }, [isAuth]);

  const signAndMove = async () => {
    await sign();
    navigate("/dashboard");
  };

  return (
    <div className="dashboard-container">
      <h2>
        Welcome to <span className="text-primary font-black">OpenPhron</span>
      </h2>
      <p className="mb-4 text-xl">
        Explore all the features AI has to offer to you!
      </p>
      {!isAuth && signer ? (
        <>
          <Button size="lg" className="p-7 text-xl" onClick={signAndMove}>
            Sign Message
          </Button>
        </>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
};

export default Signature;