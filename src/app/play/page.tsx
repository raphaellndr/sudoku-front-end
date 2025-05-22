"use client";

import { useSession } from "next-auth/react";

import {
    Box,
    Flex,
    Separator,
    Show,
    Spinner,
    Container,
} from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";

import Header from "@/components/ui/header/header";
import Footer from "@/components/ui/footer/footer";
import SudokuPlayer from "@/components/ui/play-page/sudoku-player";
import HowToPlayAccordion from "@/components/ui/play-page/how-to-play-accordion";

export default function Home() {
    const { status } = useSession();

    return (
        <Flex direction="column" minHeight="100vh">
            <ToastContainer />
            <Header />

            <Box
                flex="1"
                width="100%"
                px={4}
            >
                <Container maxW="container.xl">
                    <Show when={status !== "loading"} fallback={
                        <Flex justify="center" align="center" height="300px">
                            <Spinner size="xl" color="blue.500" />
                        </Flex>
                    }>
                        <SudokuPlayer />

                        <Separator mb={10} />
                        <Box mb={6}>
                            <HowToPlayAccordion />
                        </Box>
                    </Show>
                </Container>
            </Box>

            <Separator marginLeft="5" marginRight="5" />
            <Footer />
        </Flex>
    );
};
