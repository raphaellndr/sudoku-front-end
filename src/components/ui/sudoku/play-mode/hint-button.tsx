import { Box, Circle, Float } from "@chakra-ui/react";
import { FaRegLightbulb } from "react-icons/fa";

import { Sudoku } from "@/types/types";
import { useColorModeValue } from "../../color-mode";
import { TooltipIconButton } from "../../tooltip-icon-button";

export const MAX_HINTS = 3;

interface HintButtonProps {
    sudoku: Sudoku;
    handleHint: (sudoku: Sudoku) => void;
    remainingHints: number;
    isPaused: boolean;
    isCheckModeActive: boolean;
};

export const HintButton: React.FC<HintButtonProps> = (
    { sudoku, handleHint, remainingHints, isPaused, isCheckModeActive }
) => {
    const circleBg = useColorModeValue("purple", "purple");
    const circleBgDisabled = useColorModeValue("purple.400", "mediumpurple");

    const disabled = remainingHints === 0 || isPaused || isCheckModeActive;

    return (
        <Box position="relative">
            <TooltipIconButton
                icon={<FaRegLightbulb />}
                buttonText="Hint"
                tooltipText="Reveal a correct number"
                disabled={disabled}
                colorPalette="purple"
                variant="outline"
                width="100%"
                onClick={() => handleHint(sudoku)}
            />
            <Float>
                <Circle
                    size="4"
                    bg={disabled ? circleBgDisabled : circleBg}
                    color="white">
                    {remainingHints}
                </Circle>
            </Float>
        </Box>
    );
};
