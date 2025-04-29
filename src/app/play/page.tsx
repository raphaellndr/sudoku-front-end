"use client";

import { useSession } from "next-auth/react";

import { Box, Flex, Separator, Show, Spinner } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";

import Header from "@/components/ui/home-page/header/header";
import Footer from "@/components/ui/home-page/footer/footer";
import SudokuPlayer from "@/components/ui/sudoku/play-mode/sudoku-player";

export default function Home() {
    const { status } = useSession();

    return (
        <Flex direction="column" minHeight="100vh">
            <ToastContainer />
            <Header />
            <Box flex="1">
                <Show
                    when={status !== "loading"}
                    fallback={<Spinner />}
                >
                    <SudokuPlayer />
                </Show>
            </Box>
            <Separator marginLeft="5" marginRight="5" />
            <Footer />
        </Flex>
    );
};