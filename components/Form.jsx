"use client";

import {
  EmailOutlined,
  LockOutlined,
  PersonOutline,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import { useSession } from "next-auth/react";

const Form = ({ type }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession(); // Get session data

  useEffect(() => {
    // When session is authenticated, redirect based on user role
    if (status === "authenticated") {
      const userRole = session?.user?.role; // Access role from session
      if (userRole === "admin") {
        router.push("/admin"); // Redirect to /admin if user is an admin
      } else {
        router.push("/home"); // Redirect to /home for other roles
      }
    }
  }, [session, status, router]); // Re-run when session or status changes

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (type === "login") {
        const res = await signIn("credentials", {
          ...data,
          redirect: false, // Don't automatically redirect
        });

        // Check for login success using res.error (instead of session status)
        if (res?.error) {
          toast.error("Invalid email or password");
        }
        // No need to do anything extra for the redirect; use the useEffect hook instead
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="content">
        <img
          src="https://upload.wikimedia.org/wikipedia/vi/2/2e/Dai_hoc_phu_yen_logo.png"
          alt="logo"
          className="logo"
        />

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          {type === "register" && (
            <div>
              <div className="input">
                <input
                  {...register("username", {
                    required: "Username is required",
                    validate: (value) => {
                      if (value.length < 3) {
                        return "Username must be at least 3 characters";
                      }
                    },
                  })}
                  type="text"
                  placeholder="Username"
                  className="input-field"
                />
                <PersonOutline sx={{ color: "#737373" }} />
              </div>
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
            </div>
          )}

          <div>
            <div className="input">
              <input
                defaultValue="dung@gmail.com"
                {...register("email", { required: "Email is required" })}
                type="email"
                placeholder="Email"
                className="input-field"
              />
              <EmailOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="input">
              <input
                defaultValue="123456@"
                {...register("password", {
                  required: "Password is required",
                  validate: (value) => {
                    if (
                      value.length < 5 ||
                      !value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)
                    ) {
                      return "Password must be at least 5 characters and contain at least one special character";
                    }
                  },
                })}
                type="password"
                placeholder="Password"
                className="input-field"
              />
              <LockOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button className="button" type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : type === "register" ? "Đăng ký" : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
