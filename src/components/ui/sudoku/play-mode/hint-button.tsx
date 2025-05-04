import { Box, Circle, Float, IconButton } from "@chakra-ui/react";
import { FaRegLightbulb } from "react-icons/fa";

import { Sudoku } from "@/types/types";
import { useColorModeValue } from "../../color-mode";
import { TooltipIconButton } from "../../tooltip-icon-button";

export const MAX_HINTS = 3;

interface HintButtonprops {
    sudoku: Sudoku;
    handleHint: (sudoku: Sudoku) => void;
    remainingHints: number;
    isPaused: boolean;
}

export const HintButton: React.FC<HintButtonprops> = (
    { sudoku, handleHint, remainingHints, isPaused }
) => {
    const circleBg = useColorModeValue("purple", "purple");
    const circleBgDisabled = useColorModeValue("purple.400", "mediumpurple");

    const disabled = remainingHints === 0 || isPaused;

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