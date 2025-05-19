import { useEffect } from "react";

import { Float, Spinner } from "@chakra-ui/react";

import { Tooltip } from "@/components/ui/tooltip";
import { useTimer } from "./timer/use-timer";
import { formatTime } from "./timer/timer";

export const LoadingStatus = () => {
    const {
        timer,
        resetTimer,
        setIsActive: setIsTimerRunning,
    } = useTimer();

    useEffect(() => {
        setIsTimerRunning(true);

        return () => {
            resetTimer();
        };
    }, []);

    const tooltipContent = `Generating content (${formatTime(timer)})`

    return (
        <Tooltip content={tooltipContent}>
            <Float>
                <Spinner size="sm" />
            </Float>
        </Tooltip>
    );
};
