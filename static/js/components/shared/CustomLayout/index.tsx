import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { navItems } from "../../../constants/navItems";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Logo } from "../../../components/ui/logo";
import useWorkflow from "../../../smartcontract-builder/hooks/workflow";
import useContracts from "../../../smartcontract-builder/hooks/contracts";
import useOracles from "../../../AImarketplace/hooks/useOracles";
import useQuestions from "../../../AImarketplace/hooks/useQuestions";
import useTimer from "../../../utils/useTimer";
import useCost from "../../../smartcontract-builder/hooks/cost";
import { saveAddress } from "../../../utils/useSigner";
import useAuth from "smartcontract-builder/hooks/auth";
import ContractSidebar from "./contractSidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Label } from "../../ui/label";
import { ContractContext } from "../../../smartcontract-builder/context";

const titles = {
  "/dashboard": "Dashboard",
  "/oracle": "AI Libraries",
  "/create-oracle": "Contribute",
  "/agent": "My Contracts",
  "/subscriptions": "Subscriptions",
  "/deployed-contract": "Deployed Contracts",
};

export default function DashboardLayout({
  children,
  title = "Dashboard",
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const { state, update } = useContext(ContractContext) as ContractContextValue;

  const { address } = useAccount();
  const { isLoading, updateContracts } = useContracts();
  const { updateOracles, updateSomeOracle } = useOracles();
  const { updateQuestions } = useQuestions();
  const { updateWorkflow } = useWorkflow();
  const { getToken } = useCost();
  const { getSignature } = useAuth();
  const { timer } = useTimer(30);
  const { pathname } = useLocation();

  const mainRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeLink, setActiveLink] = useState("Overview");

  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isAuth } = useAuth();
  const navigator = useNavigate();

  useEffect(() => {
    getSignature();

    if (address) {
      getToken();
    }

    if (!isLoading && !isAuth) {
      navigator("/");
    }
  }, [isAuth, address]);

  useEffect(() => {
    saveAddress(address);
    if (!isAuth) return;
    updateContracts();
    updateOracles();
    updateSomeOracle();
    updateQuestions();
    updateWorkflow();
  }, [isAuth, timer, address]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const chatInputContainer = document.getElementById("chat-input-container");

    if (chatInputContainer) {
      if (isMobile) {
        chatInputContainer.style.left = isMobileMenuOpen ? "0px" : "0px";
      } else {
        chatInputContainer.style.left = isExpanded ? "240px" : "80px";
      }
    }
  }, [isMobile, isMobileMenuOpen, isExpanded]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const chatInputContainer = document.getElementById(
        "chat-input-container"
      );

      if (chatInputContainer) {
        if (isMobile) {
          chatInputContainer.style.left = isMobileMenuOpen ? "0px" : "0px";
        } else {
          chatInputContainer.style.left = isExpanded ? "240px" : "80px";
        }

        observer.disconnect(); // Stop observing once found
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect(); // Cleanup observer on unmount
  }, [isMobile, isMobileMenuOpen, isExpanded]);

  // Toggle button
  const toggleSidebar = () => {
    if (!isMobile) {
      // Desktop -> toggle isExpanded
      setIsExpanded((prev) => !prev);
    } else {
      // Mobile -> toggle isMobileMenuOpen
      setIsMobileMenuOpen((prev) => !prev);
    }
  };

  const renderedItems = useMemo(() => {
    return navItems.map((item) => (
      <Link key={item.id} to={item.href}>
        <motion.div
          className={`flex items-center space-x-3 mx-3 my-1 px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
            isExpanded || isMobile ? "" : "justify-center"
          } ${
            pathname === item.href
              ? "bg-[#e5e5ff] text-primary"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          onClick={() => {
            setActiveLink(item.label);
            if (isMobile) setIsMobileMenuOpen(false);
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex-shrink-0">
            <item.icon
              size={18}
              className={activeLink === item.label ? "text-primary" : ""}
            />
          </span>
          {(isExpanded || isMobile) && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          )}
        </motion.div>
      </Link>
    ));
  }, [pathname, isExpanded, isMobile]);

  const sidebarContent = (
    <>
      <div
        className={`flex items-center justify-between p-4 ${
          isExpanded ? "flex-row" : "flex-col"
        } `}
      >
        {isExpanded ? (
          <div className="max-w-[150px]">
            <Logo />
          </div>
        ) : isMobile ? (
          <div className="max-w-[180px]">
            <Logo />
          </div>
        ) : (
          <div className="max-w-[50px]">
            <Logo showOnlyHead />
          </div>
        )}

        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0 transition-colors duration-200"
          >
            {isExpanded ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        )}
      </div>
      <nav id="sidebar" className="flex-1 py-4">
        {renderedItems}

        {isExpanded === true && pathname === "/agent" ? (
          <>
            <hr />
            <ContractSidebar />
          </>
        ) : null}
      </nav>
    </>
  );

  const titleKey = useMemo(() => {
    return Object.keys(titles).find((key) => {
      if (pathname === "/") {
        return "/";
      }

      return key.length > 2 && pathname.includes(key);
    });
  }, [pathname]);

  return (
    <div className={`flex h-screen ${isDarkMode ? "dark" : ""}`}>
      {!isMobile && (
        <motion.nav
          className="white fixed h-screen bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-r border-gray-200 dark:border-gray-700 flex flex-col"
          initial={{ width: isExpanded ? 240 : 80 }}
          animate={{ width: isExpanded ? 240 : 80 }}
          transition={{ duration: 0.3 }}
        >
          {sidebarContent}
        </motion.nav>
      )}
      <main
        ref={mainRef}
        className={`${
          isMobile ? "ml-0" : isExpanded ? "ml-[240px]" : "ml-[80px]"
        } flex-1 bg-[#E5E5FF] dark:bg-gray-900`}
      >
        <div
          className=" top-0 z-10 bg-[#E5E5FF] dark:bg-gray-900 p-4 md:py-4 md:px-8 flex flex-col sm:flex-row justify-between sm:items-start xl:items-center"
          style={{
            borderBottom: "1px solid rgb(67 32 141 / 14%)",
          }}
        >
          <div className="flex w-full max-w-[400px] gap-6 items-center">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Menu size={24} className="text-gray-600 dark:text-gray-400" />
              </button>
            )}
            <h2 className="text-base text-primary font-light uppercase tracking-[10px] dark:text-white">
              {/* @ts-ignore */}
              {titles[titleKey]}
            </h2>
          </div>
          <div className="flex flex-col-reverse xl:flex-row gap-4 items-end w-full justify-end space-x-4">
            {/* {address ? (
              <div className="w-full max-w-[180px]">
                <Label className="font-bold">Select Chat Mode</Label>
                <Select
                  value={state.chatMode}
                  onValueChange={(v) => {
                    update({ chatMode: v });
                  }}
                >
                  <SelectTrigger className="mt-1 bg-white rounded-xl">
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null} */}
            <ConnectButton />
          </div>
        </div>
        <div
          className={`${
            pathname === "/dashboard"
              ? "h-[80vh] flex items-center justify-center"
              : ""
          } px-4 pb-4 md:px-8`}
        >
          {children}
        </div>
      </main>
      {/* <AnimatePresence> */}
      {isMobile && isMobileMenuOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-r border-gray-200 dark:border-gray-700 flex flex-col z-20"
        >
          {sidebarContent}
        </motion.div>
      )}
      {/* </AnimatePresence> */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}
