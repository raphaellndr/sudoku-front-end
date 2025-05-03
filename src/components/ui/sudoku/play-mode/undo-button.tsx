import { Box, Circle, Float, IconButton } from "@chakra-ui/react";
import { CiUndo } from "react-icons/ci";

import { useColorModeValue } from "../../color-mode";

export const MAX_UNDOS = 3;

interface UndoButtonprops {
    canUndo: boolean;
    undoMove: () => void;
    remainingUndos: number;
    isPaused: boolean;
}

export const UndoButton: React.FC<UndoButtonprops> = (
    { canUndo, undoMove, remainingUndos, isPaused }
) => {
    const circleBg = useColorModeValue("black", "white");
    const circleBgDisabled = useColorModeValue("gray", "gray");
    const circleColor = useColorModeValue("white", "black");

    const isDisabled = !canUndo || remainingUndos === 0 || isPaused;

    return (
        <Box position="relative">
            <IconButton
                disabled={isDisabled}
                variant="outline"
                width="100%"
                onClick={undoMove}
            >
                <CiUndo />
                Undo
            </IconButton>
            <Float>
                <Circle
                    size="4"
                    bg={isDisabled ? circleBgDisabled : circleBg}
                    color={circleColor}>
                    {remainingUndos}
                </Circle>
            </Float>
        </Box>
    );
};