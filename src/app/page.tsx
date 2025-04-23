"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';

import { Box, Separator, Show, Spinner, Flex } from '@chakra-ui/react';
import { ToastContainer } from 'react-toastify';

import SudokuCreator from '@/components/ui/sudoku/sudoku-creator';
import { Sudoku } from '@/types/types';
import Footer from '@/components/ui/home-page/footer/footer';

// Dynamically import the AppBar component to avoid hydration errors
const Header = dynamic(() => import("@/components/ui/home-page/header/header"), { ssr: false });

const HomePage = () => {
    const { status } = useSession()
    const [sudokus, setSudokus] = useState<Sudoku[]>([]);

    return (
        <Show
            when={status !== "loading"}
            fallback={<Spinner />}
        >
            <Flex direction="column" minHeight="100vh">
                <ToastContainer />
                <Header />
                <Box flex="1">
                    <SudokuCreator setSudokus={setSudokus} />
                </Box>
                <Separator marginLeft="5" marginRight="5" />
                <Footer />
            </Flex>
        </Show>
    );
};

export default HomePage;