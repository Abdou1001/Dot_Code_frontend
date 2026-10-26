import type {NextConfig} from "next";

const BACKEND_URL = process.env.BACKEND_URL;

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "rqvdrhhhgaczinbmuqun.supabase.co",
            },
            {
                protocol: "https",
                hostname: "*.supabase.co",
            },
        ],
    },
    output: "standalone",
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${BACKEND_URL}/api/:path*`,
            },
        ];
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/dashboard",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
