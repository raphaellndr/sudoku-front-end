import { Badge, IconButton } from "@chakra-ui/react";
import { IoIosPause, IoIosPlay } from "react-icons/io";

export const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

interface TimerProps {
    timer: number;
    isActive: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>
};

const Timer: React.FC<TimerProps> = (
    { timer, isActive, setIsActive }
) => {
    return (
        <Badge
            backgroundColor="transparent"
            fontSize="md"
            padding={2}
            borderRadius="md"
        >
            {formatTime(timer)}
            <IconButton variant="ghost" onClick={() => setIsActive(!isActive)}>
                {!isActive ? (
                    <IoIosPlay />
                ) : (
                    <IoIosPause />
                )}
            </IconButton>
        </Badge>
    );
};

export default Timer;