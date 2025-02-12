import React from "react";
import useOracles from "../../hooks/useOracles";
import Oracle from "./components/oracle";
import OracleHeader from "../../../AImarketplace/components/header";
import "./index.scss";

// const styles: React.CSSProperties = {
//   display: "flex",
//   flexWrap: "wrap",
//   justifyContent: "center",
//   alignItems: "start",
// };

const OracleList: React.FC = () => {
  const { oracles }: { oracles: Oracle[] } = useOracles();

  return (
    <div className="w-full">
      <main className="max-w-[1390px] mx-auto px-4 xl:px-0 pt-6">
        <OracleHeader />
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-6 gap-4"
          // style={styles}
        >
          {oracles.map((oracle: Oracle, index: number) => (
            <Oracle oracle={oracle} key={index} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default OracleList;