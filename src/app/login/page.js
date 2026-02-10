"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomInput from "@/components/CustomInput";
import { isInternetAvailable } from "@/utils/internet";

export default function Login() {
  const router = useRouter();

  const [loginUsing, setLoginUsing] = useState("Username");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const eu = localStorage.getItem("eusername");
    const ep = localStorage.getItem("epassword");
    if (eu) setUsername(eu);
    if (ep) setPassword(ep);
  }, []);

  const login = async () => {
    if (!isInternetAvailable()) {
      alert("Internet not found");
      return;
    }

    if (loginUsing === "Username") {
      if (!username || !password) {
        setMessage("Please enter username and password");
        return;
      }
    } else {
      if (!mobile) {
        setMessage("Please enter mobile number");
        return;
      }
    }

    try {
      setLoading(true);
      setMessage("");

      const baseUrl = localStorage.getItem("client_base_url");

      const form = new URLSearchParams();
      if (loginUsing === "Username") {
        form.append("username", username);
        form.append("password", password);
      } else {
        form.append("mobileno", mobile);
      }

      // fcm token placeholder (web me firebase baad me)
      form.append("fcm_devicetoken", "WEB");

      const res = await fetch(baseUrl + "/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString()
      }).then(r => r.json());

      setLoading(false);

      if (res.status === "true") {
        localStorage.setItem("jwt_token", res.data.token);
        localStorage.setItem("otp", res.data.otp);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("fldi_role_id", res.data.userInfo.fldi_role_id);
        localStorage.setItem("full_name", res.data.userInfo.fldv_name);
        localStorage.setItem("fldv_username", res.data.userInfo.fldv_username);
        localStorage.setItem("loginResp", JSON.stringify(res));

        - router.push("/otp-verify");
+ router.replace("/otp-verify");

      } else {
        setMessage(res.message);
      }
    } catch (e) {
      setLoading(false);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#F8FAFF] p-4">
      <div className="w-full max-w-md bg-white border rounded-lg">

        {/* Header */}
        <div className="bg-blue-600 text-white text-center py-4 text-xl font-bold">
          Welcome !
        </div>

        {/* Toggle buttons */}
        <div className="flex p-4 gap-2">
          <button
            className={`flex-1 py-2 rounded ${
              loginUsing === "Username"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setLoginUsing("Username")}
          >
            Login with Username
          </button>
          <button
            className={`flex-1 py-2 rounded ${
              loginUsing === "Mobile"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setLoginUsing("Mobile")}
          >
            Login with Mobile
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="mx-4 mb-2 p-2 bg-red-100 text-red-600 text-center rounded">
            {message}
          </div>
        )}

        {/* Inputs */}
        <div className="p-4 space-y-3">
          {loginUsing === "Username" && (
            <>
              <CustomInput
                value={username}
                onChange={setUsername}
                placeholder="Username"
              />
              <CustomInput
                value={password}
                onChange={setPassword}
                placeholder="Password"
              />
            </>
          )}

          {loginUsing === "Mobile" && (
            <CustomInput
              value={mobile}
              onChange={setMobile}
              placeholder="Mobile no"
            />
          )}

          <p
            className="text-blue-600 text-sm cursor-pointer"
            onClick={() => alert("Forget password flow")}
          >
            Forgot Password?
          </p>

          <button
            type="button"
            onClick={login}
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded font-bold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center p-4 text-sm">
          Power and Created by <b>JAM</b>
        </div>
      </div>
    </div>
  );
}
