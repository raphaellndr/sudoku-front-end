import { Badge, IconButton } from "@chakra-ui/react";
import { IoIosPause, IoIosPlay } from "react-icons/io";

import { formatTime } from "@/utils/time";

interface TimerProps {
    timer: number;
    isPaused: boolean;
    setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
};

const Timer: React.FC<TimerProps> = (
    { timer, isPaused, setIsPaused }
) => {
    return (
        <Badge
            backgroundColor="transparent"
            fontSize="md"
            padding={2}
            borderRadius="md"
        >
            {formatTime(timer)}
            <IconButton variant="ghost" onClick={() => { setIsPaused(!isPaused) }}>
                {isPaused ? (
                    <IoIosPlay />
                ) : (
                    <IoIosPause />
                )}
            </IconButton>
        </Badge>
    );
};

export default Timer;