import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ContractContext } from "../../context";
import useContract from "../../hooks/contract";
import ResultPage from "./component/result";
import Steps from "./component/steps";
import Chat from "./component/chat";
import "./index.scss";
import UpgradeModal from "./component/upgrade";
import useCost from "../../hooks/cost";
import { Button } from "../../../components/ui/button";
import { FileText, Plus } from "lucide-react";
import useContracts from "../../hooks/contracts";
import ToTopButton from "../../components/totop-button";
import Loader from "../../../smartcontract-builder/components/loader";

const MainPage = () => {
  const { state } = useContext(ContractContext) as ContractContextValue;
  const { isFinalStep, results } = useContract();
  const { upgradeModalVisible, openUpgradeModal, closeUpgradeModal } =
    useCost();

  const { contracts } = useContracts();

  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMargin = () => {
      const sidebar = document.getElementById("agent-sidebar");

      // if (sidebar && content.current) {
      //   content.current.style.marginLeft = `${sidebar.offsetWidth}px`;
      // }
    };

    updateMargin();

    window.addEventListener("resize", updateMargin);

    return () => {
      window.removeEventListener("resize", updateMargin);
    };
  }, []);

  return (
    <div className="w-full  ">
      <ToTopButton />
      {/* {state.isLoading ? <Loader type={"normal"} /> : <></>} */}
      {upgradeModalVisible && (
        <UpgradeModal visible={true} onClose={closeUpgradeModal} />
      )}
      <div className="max-w-[1390px] mx-auto px-4 xl:px-0">
        <div className="flex">
          {/* <SideBar /> */}
          <div
            ref={content}
            className="relative h-full flex flex-col justify-between pt-5 md:pl-4 w-full"
          >
            {state.isLoading === false && contracts.length === 0 ? (
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="border rounded-lg p-8 text-center bg-card/50">
                  <div className="max-w-sm mx-auto space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium">No Contracts Found</h3>
                    <p className="text-muted-foreground">
                      Get started by creating your first contract
                      {/* or importing an existing one. */}
                    </p>
                    <Button className="gap-2" asChild>
                      <Link to="/dashboard">
                        <Plus className="h-4 w-4" />
                        Add New Contract
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Steps />
                {isFinalStep ? <ResultPage results={results} /> : <Chat />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
