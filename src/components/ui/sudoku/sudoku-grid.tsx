import { Input, SimpleGrid } from "@chakra-ui/react";

interface SudokuGridProps {
    grid: number[][];
    setGrid: React.Dispatch<React.SetStateAction<number[][]>>;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({ grid, setGrid }) => {
    const handleChange = (rowIndex: number, colIndex: number, value: string) => {
        const newSudokuGrid = grid.map((row, rIndex) =>
            row.map((cell, cIndex) => (rIndex === rowIndex && cIndex === colIndex ? parseInt(value) || 0 : cell))
        );
        setGrid(newSudokuGrid);
    };

    return (
        <SimpleGrid columns={9}>
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <Input
                        key={`${rowIndex}-${colIndex}`}
                        width="35px"
                        type="text"
                        inputMode="numeric"
                        pattern="[1-9]"
                        maxLength={1}
                        value={cell !== 0 ? cell : ""}
                        onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                        textAlign="center"
                    />
                ))
            )}
        </SimpleGrid>
    );
}

export default SudokuGrid;