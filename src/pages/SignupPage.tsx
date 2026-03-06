import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import z from "zod";
import { registerUserAsync, resetSignupResponse } from "../features/userSlice";
import type { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";

//use built in validations from zod
const schema = z.object({
  firstName: z.string().min(3, "FirstName must be at least 3 characters long"),
  lastName: z.string().min(3, "LastName must be at least 3 characters long"),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  //role: z.int(),
});

type RegisterUserRequest = z.infer<typeof schema>;

export default function SignUpPage() {
  useEffect(() => {
    dispatch(resetSignupResponse());
  }, []);

  const { isUserCreated, message } = useSelector(
    (state: RootState) => state.user.value,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<RegisterUserRequest>({
    resolver: zodResolver(schema),
  });

  const registerUser: SubmitHandler<RegisterUserRequest> = async (data) => {
    try {
      dispatch(resetSignupResponse());
      await dispatch(registerUserAsync(data));
    } catch (error) {
      setError("root", { type: "manual", message: String(error) });
    }
  };

  useEffect(() => {
    if (message) {
      if (isUserCreated) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    }
  }, [isUserCreated, message]);

  return (
    <div className="signup-page">
      <ToastContainer />
      <div className="signup-container">
        <div className="signup-form">
          <h1>Create an Account</h1>
          <form onSubmit={handleSubmit(registerUser)}>
            {/* First Name Field */}
            <div className="form-group">
              <label htmlFor="first-name">First Name</label>
              <input
                {...register("firstName")}
                type="text"
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <div className="text-danger">{errors.firstName.message}</div>
              )}
            </div>

            {/* Last Name Field */}
            <div className="form-group">
              <label htmlFor="last-name">Last Name</label>
              <input
                {...register("lastName")}
                type="text"
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <div className="text-danger">{errors.lastName.message}</div>
              )}
            </div>
            {/* <input {...register("role")} type="hidden" value={2} /> */}

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
              />
              {errors.email && (
                <div className="text-danger">{errors.email.message}</div>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group" style={{ position: "relative" }}>
              <label htmlFor="password">Password</label>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                style={{ paddingRight: "32px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "35px", // Adjust this value if needed
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  height: "24px",
                  width: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye closed SVG
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z"
                      stroke="#888"
                      strokeWidth="2"
                    />
                    <path d="M7 13L13 7" stroke="#888" strokeWidth="2" />
                  </svg>
                ) : (
                  // Eye open SVG
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z"
                      stroke="#888"
                      strokeWidth="2"
                    />
                    <circle
                      cx="10"
                      cy="10"
                      r="3"
                      stroke="#888"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>
              {errors.password && (
                <div className="text-danger">{errors.password.message}</div>
              )}
            </div>

            {/* Submit Button */}
            <button
              disabled={isSubmitting}
              type="submit"
              className="signup-button"
            >
              {isSubmitting ? "Please wait..." : "Register"}
            </button>
            {errors.root && (
              <div className="text-danger mt-3">{errors.root.message}</div>
            )}
          </form>
          <p className="signup-message">
            Already have an account? <Link to="/login">Login here</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
