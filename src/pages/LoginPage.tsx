import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { APICore } from "../api/apiCore";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";

export default function LoginPage() {
  var api = new APICore();
  const dispatch = useDispatch();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await login({ email, password });

    if (!result.isSuccess) {
      setError(result.error.description || "Login failed");
    } else {
      setError("");
      navigate("/todos");
    }
  };

  const handleLoginSuccess = async (credentialResponse: any) => {
    const googleToken = credentialResponse.credential;

    if (!googleToken) {
      console.error("Google login failed. No ID token found.");
      return;
    }
    axios
      .post("https://localhost:5001/api/user/login/google", {
        token: googleToken,
      })
      .then((response) => {
        if (!response.data.isSuccess) {
          setError(response.data.error.description || "Login failed");
        } else {
          api.setLoggedInUser(response.data.value);
          dispatch(
            setUser({
              email: response.data.value.email,
              username: response.data.value.userName,
            })
          );
          setError("");
          navigate("/todos");
        }
      })
      .catch((error) => {
        console.error("Google Login failed:", error);
      });
  };

  const handleGoogleError = () => {
    console.log("Google Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId="306518438820-7cts4tabvho91feneum9dqeb7qn3fk79.apps.googleusercontent.com">
      <div className="login-container">
        <div className="login-form">
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          <div className="google-login">
            <h6>Or log in with Google</h6>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleGoogleError}
              auto_select
              useOneTap
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
