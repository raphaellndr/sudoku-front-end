import { Box, Circle, Float, IconButton } from "@chakra-ui/react";
import { FaRegLightbulb } from "react-icons/fa";

import { Sudoku } from "@/types/types";

export const MAX_HINTS = 3;

interface HintButtonprops {
    sudoku: Sudoku;
    handleHint: (sudoku: Sudoku) => void;
    remainingHints: number;
}

export const HintButton: React.FC<HintButtonprops> = (
    { sudoku, handleHint, remainingHints }
) => {
    return (
        <Box position="relative">
            <IconButton
                disabled={remainingHints === 0}
                colorPalette="purple"
                variant="outline"
                width="100%"
                onClick={() => handleHint(sudoku)}
                _hover={{
                    backgroundColor: "purple.800",
                }}
            >
                <FaRegLightbulb />
                Hint
            </IconButton>
            <Float>
                <Circle size="5" bg="purple.600" color="white">
                    {remainingHints}
                </Circle>
            </Float>
        </Box>
    );
};