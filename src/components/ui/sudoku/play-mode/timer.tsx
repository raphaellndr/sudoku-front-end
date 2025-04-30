import { useEffect } from "react";

import { Badge } from "@chakra-ui/react";

export const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

interface TimerProps {
    timerRef: React.RefObject<NodeJS.Timeout | null>
    timer: number;
    setTimer: React.Dispatch<React.SetStateAction<number>>;
    isTimerRunning: boolean;
};

const Timer: React.FC<TimerProps> = (
    { timerRef, timer, setTimer, isTimerRunning }
) => {
    useEffect(() => {
        if (isTimerRunning) {
            timerRef.current = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isTimerRunning]);

    return (
        <Badge
            colorPalette={isTimerRunning ? "green" : "gray"}
            fontSize="md"
            p={2}
            borderRadius="md"
        >
            Time: {formatTime(timer)}
        </Badge>
    );
};

export default Timer;