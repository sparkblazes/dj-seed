import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/auth/authApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // ✅ Hook from RTK Query
  const [login, { isLoading, isError, error, isSuccess }] = useLoginMutation();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (auth.token) {
      navigate("/roles"); // ✅ redirect after successful login
    }
  }, [auth, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await login({ email, password }).unwrap();

      // ✅ Save token to localStorage (optional)
      if (result?.token) {
        localStorage.setItem("token", result.token);
      }

      navigate("/roles");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div>
      <h2 className="fw-bold fs-24">Sign In</h2>

      <p className="text-muted mt-1 mb-4">
        Enter your email address and password to access the admin panel.
      </p>

      <div className="mb-5">
        <form className="authentication-form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="example-email">
              Email
            </label>
            <input
              type="email"
              id="example-email"
              name="example-email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <a
              href="#"
              className="float-end text-muted text-unline-dashed ms-1"
            >
              Reset password
            </a>
            <label className="form-label" htmlFor="example-password">
              Password
            </label>
            <input
              type="password"
              id="example-password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="checkbox-signin"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="checkbox-signin">
                Remember me
              </label>
            </div>
          </div>

          {/* ✅ Button with loading spinner */}
          <div className="mb-1 text-center d-grid">
            <button
              className="btn btn-soft-primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          {/* ✅ Error feedback */}
          {isError && (
            <p className="text-danger text-center mt-3">
              {(error as any)?.data?.message || "Invalid email or password"}
            </p>
          )}
        </form>

        <p className="mt-3 fw-semibold no-span">OR sign with</p>

        <div className="d-grid gap-2">
          <button className="btn btn-soft-dark" type="button">
            <i className="bx bxl-google fs-20 me-1"></i> Sign in with Google
          </button>
          <button className="btn btn-soft-primary" type="button">
            <i className="bx bxl-facebook fs-20 me-1"></i> Sign in with Facebook
          </button>
        </div>
      </div>

      <p className="text-danger text-center">
        Don’t have an account?{" "}
        <a href="auth-signup.html" className="text-dark fw-bold ms-1">
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default Login;
