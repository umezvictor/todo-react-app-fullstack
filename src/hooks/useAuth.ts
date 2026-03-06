// custom hook
import { useDispatch } from "react-redux";

import { clearUser, setUser } from "../features/userSlice";
import { APICore } from "../api/apiCore";

const useAuth = () => {
  var api = new APICore();
  const dispatch = useDispatch();

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const response = await api.createGeneric(
      "https://localhost:7024/api/user/login",
      {
        email,
        password,
      }
    );
    const user = response.data.value;
    api.setLoggedInUser(user);
    dispatch(
      setUser({
        email: response.data.value.email,
        username: response.data.value.userName,
      })
    );
    return response.data;
  };

  const logout = () => {
    //clear cookier
    api.setLoggedInUser(null);
    //reset the root state object
    //this ensures user cannot access any data after logout
    dispatch(clearUser());
  };

  return { login, logout };
};

export default useAuth;
