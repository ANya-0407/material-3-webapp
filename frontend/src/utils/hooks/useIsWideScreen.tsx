//画面サイズの判定

import { useState, useEffect } from "react";

const useIsWideScreen = (): boolean | null => {
    const [isWideScreen, setIsWideScreen] = useState<boolean | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const updateScreenSize = () => {
            setIsWideScreen(window.innerWidth >= 650);
        };

        updateScreenSize(); // 初回実行
        window.addEventListener("resize", updateScreenSize);

        return () => window.removeEventListener("resize", updateScreenSize);
    }, []);

    return isWideScreen;
};

export default useIsWideScreen;