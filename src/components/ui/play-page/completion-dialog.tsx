import { Button, CloseButton, Dialog, Flex, Portal, Text, VStack } from "@chakra-ui/react";
import { FaRegClock, FaRegLightbulb } from "react-icons/fa";
import { useEffect } from "react";
import confetti from "canvas-confetti";

import { formatTime } from "./timer";
import { MAX_HINTS } from "./buttons/hint-button";

interface CompletionDialogProps {
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    timer: number;
    remainingHints: number;
    clearSudokuGrid: () => void;
}

const CompletionDialog: React.FC<CompletionDialogProps> = (
    { isDialogOpen, setIsDialogOpen, timer, remainingHints, clearSudokuGrid }
) => {

    const fireConfetti = (): void => {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 },
            zIndex: 10000
        };

        function fire(particleRatio: number, opts: any): void {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });
        fire(0.2, {
            spread: 60,
        });
        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    };

    useEffect(() => {
        if (isDialogOpen) {
            fireConfetti();
        }
    }, [isDialogOpen]);

    return (
        <Dialog.Root open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e.open)}>
            <Portal>
                <Dialog.Backdrop backdropFilter="blur(4px)" />
                <Dialog.Positioner>
                    <Dialog.Content border="2px solid" borderColor="green.300" mx={4}>
                        <Dialog.Header display="flex" justifyContent="center">
                            <Dialog.Title> 🎉 Puzzle Completed 🎉</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body py={8} px={6}>
                            <VStack gap={6} align="stretch">
                                <Text textStyle="lg">Congratulations on completing the sudoku puzzle!</Text>
                                <Flex align="center">
                                    <FaRegClock />
                                    <Text ml={2}><strong>Time:</strong> {formatTime(timer)}</Text>
                                </Flex>
                                <Flex align="center">
                                    <FaRegLightbulb />
                                    <Text ml={2}><strong>Hints used:</strong> {MAX_HINTS - remainingHints}</Text>
                                </Flex>
                            </VStack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button onClick={() => {
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
