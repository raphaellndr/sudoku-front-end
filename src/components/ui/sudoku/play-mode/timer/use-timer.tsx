import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to manage the timer state during play mode
 */
export const useTimer = () => {
    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isActive && !isPaused) {
            timerRef.current = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isActive, isPaused]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsActive(false);
            } else {
                setIsActive(true);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    return {
        timer,
        setTimer,
        isActive,
        setIsActive,
        isPaused,
        setIsPaused,
        timerRef,
    };
};
