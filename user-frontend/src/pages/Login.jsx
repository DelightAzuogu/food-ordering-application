import React, { useState } from "react";
import { BE_URL } from "../utils/constants";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [redirect, setRedirect] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function handleLogin(e) {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const response = await fetch(`${BE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw responseData;
      }

      localStorage.setItem("token", responseData.token);
      localStorage.setItem("user", responseData.userId);
      setRedirect(true);
    } catch (error) {
      console.error(error);
    }
  }

  return redirect ? (
    <Navigate to="/" />
  ) : (
    <div className="">
      <div className="max-w-md w-full p-6 rounded-lg shadow-lg mx-auto mt-20">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
          Log in to your account
        </h2>
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            handleLogin(e);
          }}
        >
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative mb-4">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 9l4 4 4-4m0 6H8"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3a9 9 0 110 18 9 9 0 010-18z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12h14"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover-bg-orange-600 focus-outline-none focus-ring-2 focus-ring-offset-2 focus-ring-orange-500"
            >
              LOGIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
