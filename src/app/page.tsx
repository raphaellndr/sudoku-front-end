"use client";

import { Spinner } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

import SudokuCreator from '@/components/ui/sudoku/sudoku-creator';

// Dynamically import the AppBar component to avoid hydration errors
const AppBar = dynamic(() => import("@/components/ui/home-page/app-bar"), { ssr: false });

const HomePage = () => {
  const { data: session, status } = useSession()

  if (status === "loading") return <Spinner />;

  return (
    <>
      <AppBar />
      {status === "authenticated" ? (
        <p>You are already signed in.</p>
      ) : (
        <p>Please sign in to access the home page.</p>
      )}
    <SudokuCreator />
    </>
  );
};

export default HomePage;
