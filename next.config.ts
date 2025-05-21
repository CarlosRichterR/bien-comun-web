import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_URL: "https://localhost:44301", // Cambia esta URL según tu entorno
  },
  images: {
    domains: [
      "m.media-amazon.com",
      "nextlevel.com.bo",
      "encrypted-tbn0.gstatic.com",
      "www.bhg.com",
      "www.oster.com.mx",
    ],
  },
};
export default nextConfig;
