import React from "react";

import { Flex, Tabs } from "@chakra-ui/react";

import SudokuList from "./sudoku-list";
import { Sudoku, SudokuDifficulty } from "@/types/types";
import { SudokuDifficultyEnum } from "@/types/enums";

interface SudokuTabsProps {
    sudokus: Sudoku[];
    setSudokus: React.Dispatch<React.SetStateAction<Sudoku[]>>;
};

const SudokuTabs: React.FC<SudokuTabsProps> = ({ sudokus, setSudokus }) => {
    const getSudokusByDifficulty = (difficulty: SudokuDifficulty | null) => {
        if (!difficulty) return sudokus;
        const filteredSudokus = sudokus.filter(sudoku => sudoku.difficulty === difficulty);
        return filteredSudokus;
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