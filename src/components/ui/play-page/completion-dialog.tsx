import { useEffect } from "react";

import { Button, CloseButton, Dialog, Flex, Portal, Text, VStack, Box } from "@chakra-ui/react";
import { FaRegClock, FaRegLightbulb } from "react-icons/fa";
import confetti from "canvas-confetti";

import { formatTime } from "./timer";
import { MAX_HINTS } from "./buttons/hint-button";
import { useColorModeValue } from "../color-mode";

const fireConfetti = (): void => {
    const count = 200;
    const defaults = {
        origin: { y: 0.5 },
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

interface CompletionDialogProps {
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    timer: number;
    remainingHints: number;
    clearSudokuGrid: () => void;
};

const CompletionDialog: React.FC<CompletionDialogProps> = (
    { isDialogOpen, setIsDialogOpen, timer, remainingHints, clearSudokuGrid }
) => {
    // Color mode values
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("green.300", "green.400");
    const titleColor = useColorModeValue("green.600", "green.300");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const cardBg = useColorModeValue("gray.50", "gray.700");
    const cardBorder = useColorModeValue("gray.200", "gray.600");
    const iconColor = useColorModeValue("#4A5568", "#A0AEC0");

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
                    <Dialog.Content
                        border="2px solid"
                        borderColor={borderColor}
                        mx={4}
                        bg={bgColor}
                        borderRadius="xl"
                        boxShadow="xl"
                    >
                        <Dialog.Header display="flex" justifyContent="center" pb={2}>
                            <Dialog.Title fontSize="2xl" fontWeight="bold" color={titleColor}>
                                🎉 Puzzle Completed! 🎉
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body py={6} px={8}>
                            <VStack gap={6} align="stretch">
                                <Text textStyle="lg" textAlign="center" color={textColor} fontWeight="medium">
                                    Congratulations on completing the sudoku puzzle!
                                </Text>
                                <VStack gap={4}>
                                    <Box
                                        p={4}
                                        bg={cardBg}
                                        borderRadius="lg"
                                        w="full"
                                        border="1px solid"
                                        borderColor={cardBorder}
                                    >
                                        <Flex align="center" justify="center">
                                            <FaRegClock color={iconColor} size={18} />
                                            <Text ml={3} fontSize="lg">
                                                <Text as="span" fontWeight="bold">Time:</Text> {formatTime(timer)}
                                            </Text>
                                        </Flex>
                                    </Box>
                                    <Box
                                        p={4}
                                        bg={cardBg}
                                        borderRadius="lg"
                                        w="full"
                                        border="1px solid"
                                        borderColor={cardBorder}
                                    >
                                        <Flex align="center" justify="center">
                                            <FaRegLightbulb color={iconColor} size={18} />
                                            <Text ml={3} fontSize="lg">
                                                <Text as="span" fontWeight="bold">Hints used:</Text> {MAX_HINTS - remainingHints}
                                            </Text>
                                        </Flex>
                                    </Box>
                                </VStack>
                            </VStack>
                        </Dialog.Body>
                        <Dialog.Footer pt={2}>
                            <Button
                                onClick={() => {
                                    clearSudokuGrid();
                                    setIsDialogOpen(false);
                                }}
                                colorScheme="green"
                                size="lg"
                                borderRadius="lg"
                                fontWeight="semibold"
                                px={8}
                            >
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
