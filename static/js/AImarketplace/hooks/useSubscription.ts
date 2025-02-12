import { useAccount } from "wagmi";
import serverProvider from "../service/serverProvider";
import { checkError } from "utils";

const useSubscription = () => {
    const { address } = useAccount();

    const getSubscriptionForOracle = async (oracle_id: String): Promise<SubScription[] | any> => {
        try{
            const subscriptions = await serverProvider.getSubscriptionForOracle(oracle_id);
            checkError(subscriptions);
            return subscriptions;
        }catch(error: any){
            console.log("getSubscriptionForOracleError: ", error.message);
        }
    }

    const getSubscriptionForUser = async (): Promise<any> => {
        try {
            if (!address) return;
            const subscriptions = await serverProvider.getSubscriptionForUser();
            checkError(subscriptions);
            return subscriptions;
        } catch (error: any) {
            console.log("getSubscriptionForUserError: ", error.message);
        }
    }

    return {
        getSubscriptionForOracle,
        getSubscriptionForUser
    }
}

export default useSubscription;