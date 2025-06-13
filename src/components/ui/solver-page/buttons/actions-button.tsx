import { Button, HStack } from "@chakra-ui/react";

import SolveButton from "./solve-button";
import AbortButton from "./abort-button";
import ClearButton from "./clear-button";

interface ActionButtonsProps {
    mode: "create" | "display" | "solved";
    isLoading: boolean;
    hasValidInput: boolean;
    isEmpty: boolean;
    onSolve: () => void;
    onAbort: () => void;
    onClear: () => void;
    onNewPuzzle: () => void;
}

const ActionButtons = ({
    mode,
    isLoading,
    hasValidInput,
    isEmpty,
    onSolve,
    onAbort,
    onClear,
    onNewPuzzle,
}: ActionButtonsProps) => {
    if (mode === "solved") {
        return (
            <HStack>
                <Button variant="solid" onClick={onNewPuzzle}>
                    New puzzle
                </Button>
            </HStack>
        );
    }

    return (
        <HStack>
            <ClearButton
                show={!isEmpty && !isLoading}
                onClick={onClear}
            />
            <AbortButton
                show={isLoading}
                onClick={onAbort}
            />
            <SolveButton
                show={!isLoading}
                disabled={!hasValidInput}
                onClick={onSolve}
            />
        </HStack>
    );
};

export default ActionButtons;
