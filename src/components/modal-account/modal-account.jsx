import { useState } from "react";
import { useModalAccount } from "../../context/modal-account-context";
import ModalWindow from "../modal-window/modal-window";
import CustomInput from "../custom-input/custom-input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      passwordRules,
      "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character"
    ),
});

const signupSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      passwordRules,
      "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character"
    ),
});

export default function ModalAccount() {
  const { isModalWindowAccountOpen, setIsModalWindowAccountOpen } =
    useModalAccount();
  const [mode, setMode] = useState("login");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(mode === "login" ? loginSchema : signupSchema),
  });

  const onSubmit = async (data) => {
    const url =
      mode === "login"
        ? "http://localhost:5000/api/users/login"
        : "http://localhost:5000/api/users/register";

    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = response.data;

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      toast.success(`${result.message}`);

      setTimeout(() => {
        reset();
        setIsModalWindowAccountOpen(false);
      }, 2400);
    } catch (err) {
      console.error("Auth error:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  if (!isModalWindowAccountOpen) return null;

  return (
    <>
      <Toaster />
      <ModalWindow
        title={
          mode === "login" ? "Login to your account" : "Create a new account"
        }
        onClose={() => setIsModalWindowAccountOpen(false)}
        className="!h-auto"
      >
        <div className="flex justify-around mb-6">
          <button
            className={`!px-4 !py-3 rounded-md font-semibold transition-colors ${
              mode === "login"
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-800 text-gray-300 hover:bg-gray-900"
            }`}
            onClick={() => {
              setMode("login");
              reset();
            }}
          >
            Login
          </button>
          <button
            className={`!px-4 !py-3 rounded-md font-semibold transition-colors ${
              mode === "signup"
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-800 text-gray-300 hover:bg-gray-900"
            }`}
            onClick={() => {
              setMode("signup");
              reset();
            }}
          >
            Sign Up
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {mode === "signup" && (
            <div className="flex flex-col gap-1">
              <CustomInput
                type="text"
                placeholder="Name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <CustomInput
              type="text"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <CustomInput
              type="password"
              placeholder="Password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white !p-3 rounded hover:bg-green-700 transition"
          >
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
      </ModalWindow>
    </>
  );
}
