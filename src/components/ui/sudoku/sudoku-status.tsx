import { Float, Status } from "@chakra-ui/react";

import { SudokuStatus as SudokuStatusType } from "@/types/sudoku";

const getStatusColor = (status: string | null) => {
    switch (status) {
        case "completed": return "green";
        case "running": return "blue";
        case "pending": return "yellow";
        case "failed": return "red";
        case "invalid": return "red";
        case "aborted": return "orange";
        default: return "gray";
    }
};

const SudokuStatus = ({ status }: { status: SudokuStatusType | null }) => {
    return (
        <Float>
            <Status.Root colorPalette={getStatusColor(status)}>
                <Status.Indicator />
            </Status.Root>
        </Float>
    );
};

export default SudokuStatus;
