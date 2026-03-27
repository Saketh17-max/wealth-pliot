import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    indigo: "#6366f1",
                    emerald: "#10b981",
                    slate: "#0f172a",
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
