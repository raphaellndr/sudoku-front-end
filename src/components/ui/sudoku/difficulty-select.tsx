"use client";

import { createListCollection } from "@chakra-ui/react";

import { SudokuDifficultyEnum } from "@/types/enums";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "../select";

const difficulties = createListCollection({
    items: SudokuDifficultyEnum.options.map((value) => ({
        label: value,
        value: value,
    })),
});

interface DifficultySelectProps {
    selectedDifficulty: string;
    setSelectedDifficulty: React.Dispatch<React.SetStateAction<string>>;
}

const DifficultySelect: React.FC<DifficultySelectProps> = ({ selectedDifficulty, setSelectedDifficulty }) => {
    return (
        <SelectRoot
            collection={difficulties}
            width="200px"
            value={[selectedDifficulty]}
            onValueChange={(e) => setSelectedDifficulty(e.value[0])}
        >
            <SelectTrigger>
                <SelectValueText placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
                {difficulties.items.map((difficulty) => (
                    <SelectItem item={difficulty} key={difficulty.value}>
                        {difficulty.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </SelectRoot>
    )
}

export default DifficultySelect;