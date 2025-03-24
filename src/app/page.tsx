"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

import { Separator, Spinner } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';

import SudokuCreator from '@/components/ui/sudoku/sudoku-creator';
import SudokuList from '@/components/ui/sudoku/sudoku-list';
import { Sudoku } from '@/types/types';
import { notifyError } from '@/toasts/toast';

// Dynamically import the AppBar component to avoid hydration errors
const AppBar = dynamic(() => import("@/components/ui/home-page/app-bar"), { ssr: false });

const HomePage = () => {
  const { data: session, status } = useSession()
  const [sudokus, setSudokus] = useState<Sudoku[]>([]);

  const fetchSudokus = async () => {
    if (session) {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + "sudoku/sudokus/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + session.accessToken,
            },
          }
        );
        if (response.ok) {
          const responseData = await response.json();
          const sudokus = responseData["results"]
          const grids: string[] = [];
          sudokus.forEach((sudoku: Sudoku) => {
            grids.push(sudoku.grid);
          });
          setSudokus(sudokus);
        } else {
          notifyError('Failed to fetch Sudoku grids');
        }
      } catch (e: unknown) {
        const error = e as Error;
        notifyError(`An error occurred while fetching Sudoku grids: ${error.message}`);
      }
    }
  };

  return (
    <>
      {status === "loading" ? <Spinner /> :
        <>
          <ToastContainer />
          <AppBar />
          <SudokuCreator onSudokuCreated={fetchSudokus} />
          <Separator />
          <SudokuList sudokus={sudokus} onFetchSudokus={fetchSudokus} />
        </>
      }
    </>
  );
};

export default HomePage;
