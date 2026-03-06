import { Link } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

//Use Link for routing.

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    window.location.reload(); // Reload the page to reflect the logout state
  };

  return (
    <div className="navbar">
      <div className="logo">Webly</div>
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>{" "}
        {/* Navigate to Login */}
        <li>
          <Link to="/register">Register</Link>
        </li>{" "}
        {/* Navigate to Register */}
        <li>
          <Link to="/todos">Todos</Link>
        </li>{" "}
        <li>
          <Link to="/plans">Pricing</Link>
        </li>{" "}
        <li>
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "inherit",
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
