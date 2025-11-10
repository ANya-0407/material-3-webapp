import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "example.com" },
            // ‚à‚µ‘¼‚ÌƒhƒƒCƒ“‚Ì‰æ‘œ‚àg‚¤‚È‚ç‚±‚±‚É’Ç‰Á‚µ‚Ä‚¢‚­
            // { protocol: "https", hostname: "images.unsplash.com" },
            // { protocol: "https", hostname: "pbs.twimg.com" },
        ],
    },
};

export default nextConfig;
