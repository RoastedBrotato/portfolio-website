import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /pricing became /services. Permanent, so shared links and search
      // results carry over, including the #package anchors.
      { source: "/pricing", destination: "/services", permanent: true },
    ];
  },
};

export default nextConfig;
