import { ethers } from "ethers";
import { useGlobalContext } from "../context";
import { marketplaceContract } from "../blockchain";
import serverProvider from "../service/serverProvider";
import { useEthersSigner } from "../../utils/useSigner";

const useOracles = () => {
    const { state, update } = useGlobalContext() as OracleContextValue;
    const { signer } = useEthersSigner();

    const updateOracles = async (): Promise<void> => {
        try {
            const oracles = await serverProvider.getOracleList();
            update({ oracles });
            return oracles;
        } catch (error: any) {
            update({ oracles: [] });
            console.error("updateOraclesError: ", error.message);
        }
    };

    const updateSomeOracle = async (): Promise<void> => {
        try {
            const len = 10;
            const oracles = await serverProvider.getOracleList();
            if (oracles.length <= len) {
                update({ someOracles: oracles });
                return;
            }
            let someOracles = oracles.slice(len * (-1));
            update({ someOracles });
            return;
        } catch (error: any) {
            update({ someOracles: [] });
            console.log("Update some oracle error", error.message);
        }
    }

    const createOracle = async ({ name, description, price }: { name: string; description: string; price: string }): Promise<void> => {
        try {
            if (!signer) throw new Error("Sign Error!");
            const tx = await marketplaceContract.connect(signer).createOracle(
                name,
                description,
                ethers.utils.parseUnits(price)
            );
            await tx.wait();
            await updateOracles();
            console.log("Oracle created successfully.");
        } catch (error: any) {
            console.error("Error creating oracle:", error.message);
        }
    };

    const getOracleById = async (oracleId: string) => {
        try {
            const oracle = await serverProvider.getOracleById(oracleId);
            return oracle;
        } catch (error: any) {
            console.log("getOracleById: ", error.message);
        }
    }

    return {
        oracles: state.oracles,
        someOracles: state.someOracles,
        updateOracles,
        createOracle,
        getOracleById,
        updateSomeOracle
    };
};

export default useOracles;