import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

interface LoginPageProps {
  darkMode: boolean;
}

interface ErrorResponse {
  message?: string;
}

function LoginPage({ darkMode }: LoginPageProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post<LoginResponse>(
        "/auth/login",
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      // Store authentication information
      localStorage.setItem(
        "authToken",
        token
      );

      localStorage.setItem(
        "authUser",
        JSON.stringify(user)
      );

      // Go to dashboard after successful login
      navigate("/");

    } catch (err: unknown) {
      console.error(err);

      if (axios.isAxiosError<ErrorResponse>(err)) {
        setError(
          err.response?.data?.message ||
            "Login failed. Please check your credentials."
        );
      } else {
        setError(
          "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`flex min-h-screen items-center justify-center px-4 ${
        darkMode
          ? "bg-slate-950"
          : "bg-slate-100"
      }`}
    >

      {/* Login Card */}
      <div
        className={`w-full max-w-md rounded-2xl p-8 shadow-lg ${
          darkMode
            ? "bg-slate-900"
            : "bg-white"
        }`}
      >

        {/* Header */}
        <div className="mb-8 text-center">

          <h1
            className={`text-3xl font-bold ${
              darkMode
                ? "text-white"
                : "text-slate-900"
            }`}
          >
            Instant Mechanic
          </h1>

          <p
            className={`mt-2 text-sm ${
              darkMode
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            Sign in to access the dashboard
          </p>

        </div>

        {/* Error */}
        {error && (
          <div
            className={`mb-5 rounded-lg border px-4 py-3 text-sm ${
              darkMode
                ? "border-red-900 bg-red-950 text-red-400"
                : "border-red-200 bg-red-50 text-red-600"
            }`}
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* Email */}
          <div>

            <label
              htmlFor="email"
              className={`mb-2 block text-sm font-medium ${
                darkMode
                  ? "text-slate-200"
                  : "text-slate-700"
              }`}
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              required
              className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition ${
                darkMode
                  ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-900"
                  : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            />

          </div>

          {/* Password */}
          <div>

            <label
              htmlFor="password"
              className={`mb-2 block text-sm font-medium ${
                darkMode
                  ? "text-slate-200"
                  : "text-slate-700"
              }`}
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              required
              className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition ${
                darkMode
                  ? "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-900"
                  : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            />

          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default LoginPage;