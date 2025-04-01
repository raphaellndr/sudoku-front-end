import React, { useEffect } from "react";

import { Flex, Tabs } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import { Sudoku, SudokuDifficulty } from "@/types/types";
import { notifyError } from "@/toasts/toast";
import { SudokuDifficultyEnum } from "@/types/enums";
import SudokuList from "./sudoku-list";

interface SudokuTabsProps {
    sudokus: Sudoku[];
    setSudokus: React.Dispatch<React.SetStateAction<Sudoku[]>>;
};

const SudokuTabs: React.FC<SudokuTabsProps> = ({ sudokus, setSudokus }) => {
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            const fetchSudokus = async () => {
                if (session) {
                    try {
                        const response = await fetch(
                            process.env.NEXT_PUBLIC_BACKEND_URL + "api/sudokus/",
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
                            const fetchedSudokus: Sudoku[] = responseData["results"]
                            setSudokus(fetchedSudokus);
                        } else {
                            notifyError("Failed to fetch Sudoku grids");
                        }
                    } catch (e: unknown) {
                        const error = e as Error;
                        notifyError(`An error occurred while fetching Sudoku grids: ${error.message}`);
                    }
                }
            };
            fetchSudokus();
        };
    }, [session]);

    const getSudokusByDifficulty = (difficulty: SudokuDifficulty | null) => {
        if (!difficulty) return sudokus;
        return sudokus.filter(sudoku => sudoku.difficulty === difficulty);
    };

    return (
        <Tabs.Root defaultValue="all" variant="plain">
            {/* Define tabs names */}
            <Flex justify="center" align="center" p={4}>
                <Tabs.List bg="gray.100" rounded="l3" p="1" justifyContent="center" borderRadius="md">
                    {["all", ...SudokuDifficultyEnum.options].map((option) =>
                        <Tabs.Trigger value={option} key={`trigger-${option}`}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Tabs.Trigger>
                    )}
                    <Tabs.Indicator rounded="l2" />
                </Tabs.List>
            </Flex>
            {/* Define tabs */}
            {["all", ...SudokuDifficultyEnum.options].map((option) =>
                <Tabs.Content value={option} key={`content-${option}`}>
                    <SudokuList
                        sudokus={getSudokusByDifficulty(option === "all" ? null : option as SudokuDifficulty)}
                        difficulty={option === "all" ? null : option as SudokuDifficulty}
                        setSudokus={setSudokus}
                    />
                </Tabs.Content>
            )}
        </Tabs.Root>
    );
};

export default SudokuTabs;