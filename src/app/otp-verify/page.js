"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OtpVerify() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [time, setTime] = useState(60);
  const [expired, setExpired] = useState(false);

  const otpOrg = typeof window !== "undefined"
    ? localStorage.getItem("otp")
    : "";

  useEffect(() => {
    if (time === 0) {
      setExpired(true);
      return;
    }
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [time]);

  const verify = async () => {
    if (expired) {
      alert("OTP expired");
      return;
    }

    const entered = otp.join("");
    if (entered.length !== 4) {
      alert("Enter complete OTP");
      return;
    }

    if (entered !== otpOrg) {
      alert("Invalid OTP");
      return;
    }

    localStorage.setItem("opt_verify", "true");

    // login_logout API
    const baseUrl = localStorage.getItem("client_base_url");
    const userId = localStorage.getItem("userId");

    await fetch(baseUrl + "/api/leads/login_logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aid: userId,
        login_time: new Date().toISOString()
      })
    });

   - router.push("/dashboard");
+ router.replace("/dashboard");

  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFF] p-6">
      <h1 className="text-2xl font-bold mb-4">
        Enter OTP ({time}s)
      </h1>

      <div className="flex gap-2 mb-6">
        {otp.map((v, i) => (
          <input
            key={i}
            maxLength={1}
            value={v}
            onChange={e => {
              const copy = [...otp];
              copy[i] = e.target.value;
              setOtp(copy);
            }}
            className="w-12 h-12 text-center border rounded text-xl"
          />
        ))}
      </div>

      <button
        type="button"
        onClick={verify}
        className="w-full max-w-xs bg-red-600 text-white py-3 rounded font-bold"
      >
        Verify OTP
      </button>

      {expired && (
        <p
          className="mt-4 text-blue-600 cursor-pointer"
          onClick={() => router.push("/login")}
        >
          ← Try Again
        </p>
      )}
    </div>
  );
}
