import { jwtDecode } from "jwt-decode";
import axios, { type AxiosRequestHeaders, type AxiosResponse } from "axios";
import Cookies from "js-cookie";

import config from "../../src/config";

/**
 * with axios interceptors, You can intercept requests or responses before they are handled by then or catch.
 * i.e you can do something before a request is sent
 *
 * Note: some things here need to be refined to meet specific needs
 */

// content type
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.baseURL = config.API_URL;

//const authBaseUrl = process.env.REACT_APP_USER_API_URL;
//intercept api calls and set authorization headers before they hit the api
axios.interceptors.request.use(
  (config) => {
    var api = new APICore();
    //get token
    const token = api.getUserToken();
    if (token) {
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("something bad happened");
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response, // Directly return successful responses.
  async (error) => {
    var api = new APICore();
    const originalRequest = error.config;

    // Handle network errors

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
      try {
        const user = api.getLoggedInUser();
        // call the refresh token endpoint to get a new access token
        const response = await axios.post(
          "https://localhost:7024/api/user/refresh-token",
          {
            refreshToken: user.refreshToken,
          }
        );
        api.setLoggedInUser(response.data.value);
        // Update the authorization header with the new access token.
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.value.accessToken}`;
        return axios(originalRequest); // Retry the original request with the new access token.
      } catch (refreshError) {
        // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
        api.setLoggedInUser(null);
        setAuthorization(null);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// intercepting to capture errors
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;

    if (error && error.response && error.response.status === 404) {
      message = "Error occurred during registration. Please try again later";
    } else if (error && error.response && error.response.status === 403) {
      window.location.href = "/access-denied";
    } else if (error.response.status === 401) {
      message = "Invalid credentials";
      var apiCore = new APICore();
      if (apiCore.isUserAuthenticated() === false) {
        console.log("jajaj");
        //window.location.href = "/login";
      }
      return Promise.reject(message);
    } else {
      return error.response;
    }
  }
);

const AUTH_SESSION_KEY = "todo_app";
const ACCESS_TOKEN_KEY = "tokenKey";

/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token: string | null) => {
  if (token) axios.defaults.headers.common["Authorization"] = "bearer " + token;
  else delete axios.defaults.headers.common["Authorization"];
};

const getUserFromCookie = () => {
  const user = Cookies.get(ACCESS_TOKEN_KEY);
  //const user = sessionStorage.getItem(AUTH_SESSION_KEY);
  return user ? (typeof user == "object" ? user : JSON.parse(user)) : null;
};
class APICore {
  /**
   * Fetches data from given url
   */
  get = (url: string, params: any = null) => {
    let response;
    if (params) {
      var queryString = params
        ? Object.keys(params)
            .map((key) => key + "=" + params[key])
            .join("&")
        : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }
    return response;
  };

  getGeneric = <T = any>(
    url: string,
    params: any = null
  ): Promise<AxiosResponse<T>> => {
    if (params) {
      const queryString = Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&");
      return axios.get<T>(`${url}?${queryString}`);
    } else {
      return axios.get<T>(url);
    }
  };

  getFile = (url: string, params: any) => {
    let response;
    if (params) {
      var queryString = params
        ? Object.keys(params)
            .map((key) => key + "=" + params[key])
            .join("&")
        : "";
      response = axios.get(`${url}?${queryString}`, { responseType: "blob" });
    } else {
      response = axios.get(`${url}`, { responseType: "blob" });
    }
    return response;
  };

  getMultiple = (urls: string, params: any) => {
    const reqs = [];
    let queryString = "";
    if (params) {
      queryString = params
        ? Object.keys(params)
            .map((key) => key + "=" + params[key])
            .join("&")
        : "";
    }

    for (const url of urls) {
      reqs.push(axios.get(`${url}?${queryString}`));
    }
    return axios.all(reqs);
  };

  /**
   * post given data to url
   */
  create = (url: string, data: any) => {
    return axios.post(url, data);
  };

  createGeneric = <T = any>(
    url: string,
    data: any
  ): Promise<AxiosResponse<T>> => {
    return axios.post<T>(url, data);
  };

  /**
   * Updates patch data
   */
  updatePatch = (url: string, data: any) => {
    return axios.patch(url, data);
  };

  /**
   * Updates data
   */
  update = (url: string, data: any) => {
    return axios.put(url, data);
  };

  updateGeneric = <T = any>(
    url: string,
    data: any = null
  ): Promise<AxiosResponse<T>> => {
    return axios.put<T>(url, data);
  };

  /**
   * Deletes data
   */
  delete = (url: string) => {
    return axios.delete(url);
  };

  deleteGeneric = <T = any>(url: string): Promise<AxiosResponse<T>> => {
    return axios.delete<T>(url);
  };

  /**
   * post given data to url with file
   */
  createWithFile = (url: string, data: any) => {
    const formData = new FormData();
    for (const k in data) {
      formData.append(k, data[k]);
    }

    const config: any = {
      headers: {
        ...axios.defaults.headers,
        "content-type": "multipart/form-data",
      },
    };
    return axios.post(url, formData, config);
  };

  /**
   * post given data to url with file
   */
  updateWithFile = (url: string, data: any) => {
    const formData = new FormData();
    for (const k in data) {
      formData.append(k, data[k]);
    }

    const config: any = {
      headers: {
        ...axios.defaults.headers,
        "content-type": "multipart/form-data",
      },
    };
    return axios.patch(url, formData, config);
  };

  isUserAuthenticated = () => {
    const user = this.getLoggedInUser();

    if (!user) {
      return false;
    }

    const decoded: any = jwtDecode(user.accessToken);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      console.warn("access token expired");
      return axios
        .post("https://localhost:7024/api/user/refresh-token", {
          refreshToken: user.refreshToken,
        })
        .then((response: any) => {
          this.setLoggedInUser(response.data.value);
        })
        .catch((error) => {
          this.setLoggedInUser(null);
          setAuthorization(null);
          console.log(error);
          window.location.href = "/login";
        });
    } else {
      return true;
    }
  };

  //this saves the entire response object data from the login api call
  //it includes the id, username, email, accessToken, etc
  setLoggedInUser = (payload: any) => {
    if (payload) {
      //sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(payload));
      Cookies.set(ACCESS_TOKEN_KEY, JSON.stringify(payload), {
        sameSite: "Lax",
        expires: 3650, // 10 years - last for a long time
      });
    } else {
      Cookies.remove(ACCESS_TOKEN_KEY);
      //sessionStorage.removeItem(AUTH_SESSION_KEY);
      setAuthorization(null);
    }
  };

  //use this for production
  // Cookies.set("access_token", response.data.data.accessToken, {
  //   secure: true, // Ensures the cookie is sent only over HTTPS
  //   sameSite: "Strict", // Prevents the cookie from being sent in cross-site requests
  //   expires: 7, // Cookie expires in 7 days
  // });

  //use this for the token only since cookies store about 4kb of data, usually small
  saveAccessTokenInCookie = (accessToken: string) => {
    if (accessToken)
      Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
        sameSite: "Lax",
      });
    else {
      Cookies.remove(ACCESS_TOKEN_KEY);
      setAuthorization(null);
    }
  };

  getAccessTokenFromCookie = () => {
    var accessToken = Cookies.get(ACCESS_TOKEN_KEY);
    if (accessToken) {
      return accessToken;
    }

    return null;
  };

  removeAccessTokenFromCookie = () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
  };
  /**
   * Returns the logged in user
   */
  getLoggedInUser = () => {
    return getUserFromCookie();
  };

  getUserToken = () => {
    var user = getUserFromCookie();
    if (user) {
      return user.accessToken;
    }

    return null;
  };

  /**
   * Returns the logged in user role
   */
  getLoggedInUserRole = () => {
    var user = getUserFromCookie();
    if (user) {
      var decoded: any = jwtDecode(user.accessToken);
      if (decoded)
        return decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
    }

    return null;
  };

  setUserInSession = (modifiedUser: any) => {
    let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (userInfo) {
      const { token, user } = JSON.parse(userInfo);
      this.setLoggedInUser({ token, ...user, ...modifiedUser });
    }
  };
}

/*
Check if token available in session
*/
let user = getUserFromCookie();
if (user) {
  const { token } = user;
  if (token) {
    setAuthorization(token);
  }
}

export { APICore, setAuthorization };
