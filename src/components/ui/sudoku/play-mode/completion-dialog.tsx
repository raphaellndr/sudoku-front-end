import React from "react";

import { Button, CloseButton, Dialog, Portal, Text, VStack } from "@chakra-ui/react";

interface CompletionDialogProps {
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    timer: number;
    formatTime: (seconds: number) => string;
    hintsUsed: number;
    clearSudokuGrid: () => void;
};

const CompletionDialog: React.FC<CompletionDialogProps> = (
    { isDialogOpen, setIsDialogOpen, timer, formatTime, hintsUsed, clearSudokuGrid }
) => {
    return (
        <Dialog.Root open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Puzzle Completed!</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <VStack gap={4} align="stretch">
                                <Text>Congratulations on completing the sudoku puzzle!</Text>
                                <Text>
                                    <strong>Time:</strong> {formatTime(timer)}
                                </Text>
                                {hintsUsed > 0 && (
                                    <Text>
                                        <strong>Hints used:</strong> {hintsUsed}
                                    </Text>
                                )}
                            </VStack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Close
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button colorPalette="blue" onClick={() => {
                                clearSudokuGrid();
                                setIsDialogOpen(false);
                            }}>
                                New Puzzle
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default CompletionDialog;