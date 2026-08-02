import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  redirects() {
    // The sieve demo entry became the algo. collection; keep old links alive.
    return Promise.resolve([
      {
        source: "/projects/sieve-of-eratosthenes",
        destination: "/projects/algo",
        permanent: true,
      },
    ]);
  },
};

export default nextConfig;
