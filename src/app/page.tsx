"use client";

import dynamic from 'next/dynamic';

import { Separator, Spinner } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';

import SudokuCreator from '@/components/ui/sudoku/sudoku-creator';
import SudokuList from '@/components/ui/sudoku/sudoku-list';

// Dynamically import the AppBar component to avoid hydration errors
const AppBar = dynamic(() => import("@/components/ui/home-page/app-bar"), { ssr: false });

const HomePage = () => {
  const { data: session, status } = useSession()

  if (status === "loading") return <Spinner />;

  return (
    <>
      <ToastContainer />
      <AppBar />
      <SudokuCreator />
      <Separator />
      <SudokuList />
    </>
  );
};

export default HomePage;
