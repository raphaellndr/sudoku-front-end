"use client";

import { useRef, useState, useEffect } from "react";

import { useSession } from "next-auth/react";
import {
    Box,
    Flex,
    HStack,
    VStack,
    Separator,
    Show,
    Spinner,
    Container,
    useBreakpointValue,
    Card,
} from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";

import Header from "@/components/ui/header/header";
import Footer from "@/components/ui/footer/footer";
import SudokuPlayer from "@/components/ui/play-page/sudoku-player";
import HowToPlayAccordion from "@/components/ui/play-page/how-to-play-accordion";
import Leaderboard from "@/components/ui/play-page/leaderboard/leaderboard";
import LeaderboardDialogButton from "@/components/ui/play-page/leaderboard/leaderboard-dialog-button";

export default function Home() {
    const { status } = useSession();

    const isLargeScreen = useBreakpointValue({ base: false, lg: true });
    const headerRef = useRef<HTMLDivElement>(null);

    const [headerHeight, setHeaderHeight] = useState(0);
    const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

    useEffect(() => {
        if (headerRef.current) {
            const height = headerRef.current.getBoundingClientRect().height;
            setHeaderHeight(height);
        }
    }, []);

    const buttonTop = headerHeight + 16;

    return (
        <VStack minHeight="100vh" gap={0}>
            <ToastContainer />
            <Box ref={headerRef} width="100%">
                <Header />
            </Box>

            <Box
                flex="1"
                width="100%"
                px={4}
                pt={`${buttonTop}px`}
                position="relative"
            >
                <Container maxW="container.xl">
                    <Show when={status !== "loading"} fallback={
                        <Flex justify="center" align="center" height="300px">
                            <Spinner size="xl" color="blue.500" />
                        </Flex>
                    }>
                        {isLargeScreen ? (
                            <VStack gap={8} align="stretch">
                                <HStack gap={8}>
                                    <Box flex="2">
                                        <SudokuPlayer />
                                    </Box>
                                    <Box flex="1">
                                        <Card.Root
                                            shadow="md"
                                            maxHeight="500px"
                                        >
                                            <Card.Body>
                                                <Card.Title mb="4" textAlign="center">
                                                    🏆 Leaderboard 🏆
                                                </Card.Title>
                                                <Leaderboard />
                                            </Card.Body>
                                        </Card.Root>
                                    </Box>
                                </HStack>
                                <Separator />
                                <Box>
                                    <HowToPlayAccordion />
                                </Box>
                            </VStack>
                        ) : (
                            <VStack gap={6}>
                                <SudokuPlayer />
                                <Separator />
                                <Box>
                                    <HowToPlayAccordion />
                                </Box>
                            </VStack>
                        )}
                    </Show>
                </Container>

                {!isLargeScreen &&
                    <LeaderboardDialogButton
                        isOpen={isLeaderboardOpen}
                        setIsLeaderboardOpen={setIsLeaderboardOpen}
                        headerHeight={headerHeight}
                    />
                }
            </Box>

            <Separator marginLeft="5" marginRight="5" />
            <Footer />
        </VStack>
    );
}
