import { Box, Circle, Float, IconButton } from "@chakra-ui/react";
import { FaRegLightbulb } from "react-icons/fa";

import { Sudoku } from "@/types/types";
import { useColorModeValue } from "../../color-mode";

export const MAX_HINTS = 3;

interface HintButtonprops {
    sudoku: Sudoku;
    handleHint: (sudoku: Sudoku) => void;
    remainingHints: number;
}

export const HintButton: React.FC<HintButtonprops> = (
    { sudoku, handleHint, remainingHints }
) => {
    const circleBg = useColorModeValue("purple", "purple");
    const circleBgDisabled = useColorModeValue("purple.400", "mediumpurple");

    return (
        <Box position="relative">
            <IconButton
                disabled={remainingHints === 0}
                colorPalette="purple"
                variant="outline"
                width="100%"
                onClick={() => handleHint(sudoku)}
            >
                <FaRegLightbulb />
                Hint
            </IconButton>
            <Float>
                <Circle
                    size="4"
                    bg={remainingHints === 0 ? circleBgDisabled : circleBg}
                    color="white">
                    {remainingHints}
                </Circle>
            </Float>
        </Box>
    );
};