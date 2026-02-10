import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  reactStrictMode: true
};

export default isDev
  ? nextConfig
  : withPWA({
      dest: "public",
      register: true,
      skipWaiting: true
    })(nextConfig);
