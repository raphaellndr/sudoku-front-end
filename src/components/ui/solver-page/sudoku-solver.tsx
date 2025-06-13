import { Box, VStack } from "@chakra-ui/react";

import { useSudokuSolver } from "@/hooks/use-sudoku-solver";

import SudokuGridContainer from "./sudoku-grid-container";
import ActionButtons from "./buttons/actions-button";

const SudokuSolver = () => {
    const {
        sudoku,
        mode,
        isLoading,
        hasValidInput,
        isEmpty,
        handleCellChange,
        handleSolveSudoku,
        handleAbortSolving,
        handleClearGrid,
        startNewPuzzle,
    } = useSudokuSolver();

    return (
        <Box p="5">
            <VStack gap="4">
                <SudokuGridContainer
                    mode={mode}
                    sudoku={sudoku}
                    isLoading={isLoading}
                    onCellChange={handleCellChange}
                />
                <ActionButtons
                    mode={mode}
                    isLoading={isLoading}
                    hasValidInput={hasValidInput}
                    isEmpty={isEmpty}
                    onSolve={handleSolveSudoku}
                    onAbort={handleAbortSolving}
                    onClear={handleClearGrid}
                    onNewPuzzle={startNewPuzzle}
                />
            </VStack>
        </Box>
    );
};

export default SudokuSolver;
