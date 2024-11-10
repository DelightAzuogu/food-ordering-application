import React, { useState, useRef } from "react";
import { BE_URL, inputTagCss } from "../utils/constants";
import { Navigate } from "react-router-dom";

const Signup = () => {
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputRef = useRef(null);

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  async function handleSignup(e) {
    e.preventDefault();

    const name = e.target[0].value;
    const email = e.target[1].value;
    const phoneNumber = e.target[2].value;
    const address = e.target[3].value;
    const city = e.target[4].value;
    const password = e.target[5].value;
    const confirmPassword = e.target[7].value;

    const file = inputRef.current.files[0];

    console.log(file, e.target.files);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phoneNumber);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("image", file);

    if (password !== confirmPassword) {
      setError(true);
      return;
    }

    try {
      const response = await fetch(`${BE_URL}/restaurant/signup`, {
        method: "POST",
        headers: {},
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw responseData;
      }
      localStorage.setItem("token", responseData.token);
      localStorage.setItem("id", responseData.id);
      setRedirect(true);
    } catch (error) {
      console.error(error);
    }
  }

  return redirect ? (
    <Navigate to="/order" />
  ) : (
    <div className="">
      <div className="max-w-md w-full p-6 rounded-lg shadow-lg mx-auto mt-20">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
          Sign up for an account
        </h2>
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            handleSignup(e);
          }}
        >
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <label htmlFor="restaurantName" className="sr-only">
                Restaurant Name
              </label>
              <input
                id="restaurantName"
                name="restaurantName"
                type="text"
                required
                className={inputTagCss}
                placeholder="Restaurant Name"
              />
            </div>
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={inputTagCss}
                placeholder="Email"
              />
            </div>

            <div className="relative">
              <label htmlFor="phoneNumber" className="sr-only">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                className={inputTagCss}
                placeholder="Phone Number"
              />
            </div>
            <div className="relative">
              <label htmlFor="address" className="sr-only">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                className={inputTagCss}
                placeholder="Address"
              />
            </div>
            <div className="relative">
              <label htmlFor="city" className="sr-only">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                className={inputTagCss}
                placeholder="city"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className={inputTagCss}
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                onClick={() => togglePasswordVisibility("password")}
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
            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                onClick={() => togglePasswordVisibility("confirmPassword")}
              >
                {showConfirmPassword ? (
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
            <div className="relative mt-4">
              <label htmlFor="image" className="sr-only">
                Select Logo
              </label>
              <input
                id="image"
                name="image"
                type="file"
                ref={inputRef}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Select Logo"
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-2">Password do not match</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover-bg-orange-600 focus-outline-none focus-ring-2 focus-ring-offset-2 focus-ring-orange-500"
            >
              SIGN UP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
