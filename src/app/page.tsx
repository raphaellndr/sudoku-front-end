"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

import { Separator, Spinner } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';

import SudokuCreator from '@/components/ui/sudoku/sudoku-creator';
import SudokuList from '@/components/ui/sudoku/sudoku-list';
import { Sudoku } from '@/types/types';

// Dynamically import the AppBar component to avoid hydration errors
const AppBar = dynamic(() => import("@/components/ui/home-page/app-bar"), { ssr: false });

const HomePage = () => {
    const { status } = useSession()
    const [sudokus, setSudokus] = useState<Sudoku[]>([]);

    return (
        <>
            {status === "loading" ? <Spinner /> :
                <>
                    <ToastContainer />
                    <AppBar />
                    <SudokuCreator setSudokus={setSudokus} />
                    <Separator />
                    <SudokuList sudokus={sudokus} setSudokus={setSudokus} />
                </>
            }
        </>
    );
};

export default HomePage;
