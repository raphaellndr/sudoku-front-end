"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

import { Separator, Show, Spinner } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';

import SudokuCreator from '@/components/ui/sudoku/sudoku-creator';
import { Sudoku } from '@/types/types';

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
            <ToastContainer />
            <Header />
            <SudokuCreator setSudokus={setSudokus} />
            <Separator />
        </Show>
    );
};

export default HomePage;
