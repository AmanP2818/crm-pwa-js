"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomInput from "@/components/CustomInput";
import { isInternetAvailable } from "@/utils/internet";
import { ROOT_VALIDATE_URL } from "@/services/root";

export default function ValidateClient() {
  const router = useRouter();
  const [clientId, setClientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verified = localStorage.getItem("opt_verify");
    const saved = localStorage.getItem("clientid");

    if (
  verified === "true" &&
  localStorage.getItem("jwt_token")
) {
  router.replace("/dashboard");
}

    if (saved) setClientId(saved);

    if (!localStorage.getItem("userAcceptedPrivacy")) {
      alert("Enter your Client ID to continue.");
      localStorage.setItem("userAcceptedPrivacy", "true");
    }
  }, []);

  const submit = async () => {
    if (!clientId) {
      setError("Please enter a valid client code.");
      return;
    }

    if (!isInternetAvailable()) {
      alert("Internet not found");
      return;
    }

    try {
      setLoading(true);

      const form = new URLSearchParams();
      form.append("code", clientId);

      const res = await fetch(
        ROOT_VALIDATE_URL + "validateClient",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: form.toString()
        }
      ).then(r => r.json());

      setLoading(false);

      if (res.status === "true") {
  const d = res.data.clientDetail;

  localStorage.setItem("client_base_url", d.fldv_base_url);
  localStorage.setItem("client_logo", d.fldv_logo);
  localStorage.setItem("clientid", clientId);
  localStorage.setItem("client_code", d.fldv_client_code);

 router.replace("/login");
}

      else {
        setError(res.message);
      }
    } catch {
      setLoading(false);
      alert("Validation failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-md space-y-4">

        <img
          src="/image.png"
          className="w-full h-[300px] object-contain"
        />

        <CustomInput
          value={clientId}
          onChange={setClientId}
          placeholder="Enter Client ID"
        />

        <button
  type="button"
  onClick={submit}
  disabled={loading}
  className="w-full bg-red-600 text-white py-3 rounded-md font-bold"
>

          {loading ? "Validating..." : "Continue"}
        </button>

        {error && <p className="text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
}
