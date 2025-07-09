// app/login/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LogoCircle from "@/components/LogoCircle";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/clients");
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: true,
        email,
        password,
        callbackUrl: "/clients",
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      // Redirect will happen automatically due to callbackUrl
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-100 flex min-h-screen items-center justify-center">
      <div className="bg-base-200 flex max-w-md flex-col items-center justify-center space-y-8 rounded-lg p-8 shadow-md">
        <LogoCircle />
        <div className="text-center">
          <p className="text-gray-600">Enter your credentials to continue</p>
        </div>

        {error && (
          <div className="text-error bg-error rounded-lg p-4">{error}</div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="text-base-content/50 block font-medium"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="text"
              required
              className="input input-md input-info focus:input-bordered mt-3 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-base-content/50 block font-medium"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input input-md input-info focus:input-bordered mt-3 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-soft btn-info mt-3 w-full"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}