import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to manage the timer state during play mode
 */
export const useTimer = () => {
    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const restartTimer = () => {
        setTimer(0);
        setIsActive(true);
        setIsPaused(false);
    };

    const resetTimer = () => {
        setTimer(0);
        setIsActive(false);
        setIsPaused(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    // Timer logic
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

    // Pause the timer when visibility changes to hidden
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsPaused(false);
            } else {
                setIsPaused(true);
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
        restartTimer,
        resetTimer,
        isActive,
        setIsActive,
        isPaused,
        setIsPaused,
        timerRef,
    };
};
