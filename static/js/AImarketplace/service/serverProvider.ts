import axios from "axios";
import { config } from "../../config";

const serverProvider = {
  serverUrl: config.server,
  setAuthentication: () => {
    try {
      const address: string | null = localStorage.getItem("userAddress");
      if (!address) {
        delete axios.defaults.headers.common.authentication;
        throw new Error("User address not found!");
      }
      const signInfo: string | null = localStorage.getItem(address);
      if (!signInfo) {
        delete axios.defaults.headers.common.authentication;
        throw new Error("No signInfo found for address: " + address);
      }
      const { signature, message } = JSON.parse(signInfo);
      axios.defaults.headers.common.authentication = JSON.stringify({
        signature,
        message,
        address,
      });
    } catch (error: any) {
      console.log("setAuthenticatioinError: ", error.message);
    }
  },
  getOracleList: async (): Promise<any> => {
    serverProvider.setAuthentication();
    let res = await axios.get(serverProvider.serverUrl + "/oracle");
    return res.data;
  },
  getOracleById: async (id: string) => {
    serverProvider.setAuthentication();
    let res = await axios.get(serverProvider.serverUrl + `/oracle/${id}`);
    return res.data;
  },
  getQuestions: async (): Promise<any> => {
    serverProvider.setAuthentication();
    let res = await axios.get(serverProvider.serverUrl + "/question");
    return res.data;
  },
  getQuestion: async (question_id: String): Promise<any> => {
    serverProvider.setAuthentication();
    let res = await axios.get(
      serverProvider.serverUrl + "/question/" + question_id
    );
    return res.data;
  },
  getQuestionForOracle: async (oracle_id: String): Promise<any> => {
    serverProvider.setAuthentication();
    let res = await axios.post(
      serverProvider.serverUrl + "/question/oracle/" + oracle_id
    );
    return res.data;
  },
  getSubscriptionForUser: async (): Promise<any> => {
    serverProvider.setAuthentication();
    let res = await axios.get(serverProvider.serverUrl + "/subscription/user");
    return res.data;
  },
  getSubscriptionForOracle: async (oracleId: String): Promise<any> => {
    serverProvider.setAuthentication();
    let res = await axios.post(
      serverProvider.serverUrl + "/subscription/oracle/" + oracleId
    );
    return res.data;
  },
};

export default serverProvider;