import { Box, Circle, Float } from "@chakra-ui/react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { MdOutlineCancel } from "react-icons/md";

import TooltipIconButton from "@/components/ui/tooltip-icon-button";
import { useColorModeValue } from "@/components/ui/color-mode";

export const MAX_CHECKS = 3;

interface CheckButtonProps {
    remainingChecks: number;
    canCheck: boolean;
    isPaused: boolean;
    onActivateCheckMode: () => void;
    isCheckModeActive: boolean;
}

export const CheckButton: React.FC<CheckButtonProps> = (
    { remainingChecks, canCheck, isPaused, onActivateCheckMode, isCheckModeActive }
) => {
    const circleBg = useColorModeValue("black", "white");
    const circleBgDisabled = useColorModeValue("gray", "gray");
    const circleColor = useColorModeValue("white", "black");
    const borderColor = useColorModeValue("grey.500", "white");

    const isDisabled = remainingChecks === 0 || !canCheck || isPaused;

    return (
        <Box position="relative">
            <TooltipIconButton
                leftIcon={isCheckModeActive ? <MdOutlineCancel /> : <HiMagnifyingGlass />}
                buttonText={isCheckModeActive ? "Cancel" : "Verify"}
                tooltipText={isCheckModeActive
                    ? "Cancel checking a cell"
                    : "Check if the value in a cell is the right one or not"
                }
                disabled={isDisabled}
                variant="outline"
                width="100%"
                borderColor={borderColor}
                onClick={onActivateCheckMode}
            />
            <Float>
                <Circle
                    size="4"
                    bg={isDisabled ? circleBgDisabled : circleBg}
                    color={circleColor}>
                    {remainingChecks}
                </Circle>
            </Float>
        </Box>
    );
};
