"use client";

import { useRef, useState, useEffect } from "react";

import { useSession } from "next-auth/react";
import {
    Box,
    Flex,
    Separator,
    Show,
    Spinner,
    Container,
    useBreakpointValue,
} from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";

import Header from "@/components/ui/header/header";
import Footer from "@/components/ui/footer/footer";
import SudokuPlayer from "@/components/ui/play-page/sudoku-player";
import HowToPlayAccordion from "@/components/ui/play-page/how-to-play-accordion";
import Leaderboard from "@/components/ui/play-page/leaderboard";
import LeaderboardDialog from "@/components/ui/play-page/leaderboard-dialog";

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
        <Flex direction="column" minHeight="100vh">
            <ToastContainer />
            <Box ref={headerRef}>
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
                            <Flex direction="column">
                                <Flex direction="row" gap={8} mb={8}>
                                    <Box flex="2">
                                        <SudokuPlayer />
                                    </Box>
                                    <Box flex="1">
                                        <Leaderboard />
                                    </Box>
                                </Flex>
                                <Separator mb={10} />
                                <Box mb={6}>
                                    <HowToPlayAccordion />
                                </Box>
                            </Flex>
                        ) : (
                            <Flex direction="column">
                                <SudokuPlayer />
                                <Separator mb={10} mt={4} />
                                <Box mb={6}>
                                    <HowToPlayAccordion />
                                </Box>
                            </Flex>
                        )}
                    </Show>
                </Container>

                {!isLargeScreen &&
                    <LeaderboardDialog
                        isOpen={isLeaderboardOpen}
                        setIsLeaderboardOpen={setIsLeaderboardOpen}
                        headerHeight={headerHeight}
                    />
                }
            </Box>

            <Separator marginLeft="5" marginRight="5" />
            <Footer />
        </Flex>
    );
}
