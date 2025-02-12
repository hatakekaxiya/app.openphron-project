import { useState } from "react";

import useOracles from "../../hooks/useOracles";
import Sidebar from "./components/sidebar";
import MainPanel from "./components/mainPan";
import CreatePanel from "./components/createPanel";
import "./index.scss";

const CreateOracle = () => {
  const { oracles } = useOracles();

  const [oracleId, setOracleId] = useState<string | null>(null);
  const oracle = oracles.find((oracle) => oracle.id == oracleId);

  return (
    <div className="w-full">
      <div className="max-w-[1120px] mx-auto mt-10">
        <div className="px-4 xl:px-0 flex gap-8 justify-center mx-auto pt-4">
          <Sidebar setOracleId={setOracleId} />
          {/* <div className="w-full">
          </div> */}
          {oracleId === null ? <CreatePanel /> : <MainPanel oracle={oracle} />}
        </div>
      </div>
    </div>
  );
};

export default CreateOracle;