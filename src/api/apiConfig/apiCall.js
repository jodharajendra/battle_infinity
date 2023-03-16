import axios from "axios";
import { ConsoleLogs } from "../../utils/ConsoleLogs";

const TAG = 'ApiCall';

export const ApiCallPost = async (url, parameters, headers) => {
  try {
    const response = await axios.post(url, parameters, { headers: headers });
    ConsoleLogs(
      TAG + ', ApiCallPost',
      `apiDebug, response : ${JSON.stringify(response.data)}`,
    );
    return response.data;
  } catch (error) {
    ConsoleLogs(
      TAG + ', ApiCallPost',
      `apiDebug, response error: ${JSON.stringify(error.response.data.message)}`,
    );
    return error.response.data;
  }
};

export const ApiCallGet = async (url, headers) => {
  try {
    const response = await axios.get(url, { headers: headers });
    ConsoleLogs(
      TAG + ', ApiCallGet',
      `apiDebug, response : ${JSON.stringify(response.data)}`,
    );
    return response.data;
  } catch (error) {
    ConsoleLogs(
      TAG + ', ApiCallGet',
      `apiDebug, response error : ${JSON.stringify(error.response.data.message)}`,
    );
    return error.response.data;
  }
};


export const ApiCallPut = async (url, parameters, headers) => {
  try {
    const response = await axios.put(url, parameters, { headers: headers });
    ConsoleLogs(
      TAG + ', ApiCallPut',
      `apiDebug, response : ${JSON.stringify(response.data)}`,
    );
    return response.data;
  } catch (error) {
    ConsoleLogs(
      TAG + ', ApiCallPut',
      `apiDebug, response error: ${JSON.stringify(error.response.data.message)}`,
    );
    return error.response.data;
  }
};



export const ApiCallPatch = async (url, parameters, headers) => {
  try {
    const response = await axios.patch(url, parameters, { headers: headers });
    ConsoleLogs(
      TAG + ', ApiCallPut',
      `apiDebug, response : ${JSON.stringify(response.data)}`,
    );
    return response.data;
  } catch (error) {
    ConsoleLogs(
      TAG + ', ApiCallPut',
      `apiDebug, response error: ${JSON.stringify(error.response.data.message)}`,
    );
    return error.response.data;
  }
};