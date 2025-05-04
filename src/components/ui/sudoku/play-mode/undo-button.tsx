import { Box, Circle, Float } from "@chakra-ui/react";
import { CiUndo } from "react-icons/ci";

import { useColorModeValue } from "../../color-mode";
import { TooltipIconButton } from "../../tooltip-icon-button";

export const MAX_UNDOS = 3;

interface UndoButtonProps {
    canUndo: boolean;
    undoMove: () => void;
    remainingUndos: number;
    isPaused: boolean;
}

export const UndoButton: React.FC<UndoButtonProps> = (
    { canUndo, undoMove, remainingUndos, isPaused }
) => {
    const circleBg = useColorModeValue("black", "white");
    const circleBgDisabled = useColorModeValue("gray", "gray");
    const circleColor = useColorModeValue("white", "black");

    const isDisabled = !canUndo || remainingUndos === 0 || isPaused;

    return (
        <Box position="relative">
            <TooltipIconButton
                icon={<CiUndo />}
                buttonText="Undo"
                tooltipText="Remove last value entered"
                disabled={isDisabled}
                variant="outline"
                width="100%"
                onClick={undoMove}
            />
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
