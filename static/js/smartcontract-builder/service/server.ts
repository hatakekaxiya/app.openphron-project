import axios from "axios";
import { config } from "../../config";

console.log({ config });

const serverProvider = {
  serverUrl: config.server,
  contractUrl: config.deploy,
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
  createContract: async (data: any) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/contract",
      data
    );
    return response.data;
  },
  addDeployedContract: async (data: any) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/contract/deployed",
      data
    );
    return response.data;
  },
  getDeployedContract: async (id: any) => {
    serverProvider.setAuthentication();

    const response = await axios.get(
      serverProvider.serverUrl + `/contract/user/deployed/${id}`
    );
    return response.data;
  },
  getContracts: async () => {
    serverProvider.setAuthentication();
    const response = await axios.get(serverProvider.serverUrl + "/contract");
    return response.data;
  },
  sendMessage: async (data: any) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/contract/message",
      data
    );
    return response.data;
  },
  saveResult: async (data: any) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/contract/save-result",
      data
    );
    return response.data;
  },
  getWorkflows: async () => {
    serverProvider.setAuthentication();
    const response = await axios.get(serverProvider.serverUrl + "/workflow");
    return response.data;
  },
  deleteContract: async (_id) => {
    serverProvider.setAuthentication();
    const response = await axios.delete(
      serverProvider.serverUrl + `/contract/${_id}`
    );
    return response.data;
  },
  compileContract: async (contractCode) => {
    serverProvider.setAuthentication();
    const response = await axios.post(serverProvider.contractUrl + "/compile", {
      contractCode,
    });
    return response.data;
  },
  testContract: async (testCode, contractCode) => {
    serverProvider.setAuthentication();
    const response = await axios.post(serverProvider.contractUrl + "/test", {
      testCode,
      contractCode,
    });
    return response.data;
  },
  reduceTokens: async (token) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/token/reduce",
      { token }
    );
    return response.data;
  },
  getToken: async () => {
    serverProvider.setAuthentication();
    const response = await axios.get(serverProvider.serverUrl + "/token");
    return response.data;
  },
  subscribeToken: async (id) => {
    serverProvider.setAuthentication();
    const response = await axios.post(
      serverProvider.serverUrl + "/token/subscribe",
      { id }
    );
    return response.data;
  },
};

export default serverProvider;
