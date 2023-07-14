import axios, { AxiosResponse, AxiosError } from "axios";
import { error } from "console";

interface ConfigureInterceptorsParams {
  accessToken: string;
}

export default class ApiHelper {
  static baseURL: string = "https://localhost:7134/api";

  public static handleError = (error: AxiosError) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error getting data. Error status: ", error.response.status)
      console.error(error.response.data);
      console.error(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error("Error getting data. Request: ", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error getting data. Error message:', error.message);
    }
    console.error(error.config);
  }

  public static get = async<T>(path: string): Promise<AxiosResponse<T>> => {
    return await axios.get(this.baseURL + path, { 
      withCredentials: true, 
    })
  }

  public static post = async<T>(path: string, data: any): Promise<AxiosResponse<T>> => {
    return await axios.post(this.baseURL + path, data, { 
        withCredentials: true, 
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  public static async postWithFiles<T>(path: string, data?: any, params?: any): Promise<AxiosResponse<T>> {
    return await axios.post(this.baseURL + path, data, { 
        params: params,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
  }

  public static async postForDownload<T>(path: string, data?: any, params?: any): Promise<AxiosResponse<T>> {
    return await axios.post(this.baseURL + path, data, { 
      params: params,
      withCredentials: true, 
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}