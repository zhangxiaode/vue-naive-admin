import axios from "axios";
import { AxiosInstance, AxiosRequestConfig } from "axios";
import { useMessage } from 'naive-ui'
const message = useMessage()

const service: AxiosInstance = axios.create({
  baseURL: "http://koala.sigcms.com/apis",
  withCredentials: true,
  timeout: 15000,
});

service.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["token"] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    if (response.data.status_code === 4 || response.data.status_code === 5) {
      sessionStorage.removeItem("userMsg");
      message.error("用户身份已失效，请重新登录");
      const path: Array<string> =
        window.location.pathname.split("/kaola-backend");
      const url: string = path.length > 1 ? path[1] : path[0];
      location.href = `/kaola-backend/login?redirect=${url}${window.location.search}`;
      return;
    }
    return response.data;
  },
  (error) => {
    message.error("error.message");
    return Promise.reject(error);
  }
);

// 封装axios---------------------------------------
function apiAxios(httpDefault: AxiosRequestConfig, isLoad = false) {
  return new Promise((resolve, reject) => {
    let loadingInstance: any = null;
    if (isLoad) {
      loadingInstance = message.loading('...');
    }
    isLoad && message.destroyAll();
    service(httpDefault)
      .then((response: any) => {
        switch (response.status_code) {
          case 0:
            resolve(response.data);
            break;
          default:
            message.error(response.message || "error");
            reject(response.data);
        }
      })
      .catch((error) => {
        reject(error);
      })
      .finally(() => {
        if (isLoad && loadingInstance) {
          loadingInstance.close();
        }
      });
  });
}

export default apiAxios;
