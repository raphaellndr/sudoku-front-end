import { Box, Grid, Input, SimpleGrid } from "@chakra-ui/react";

interface SudokuGridProps {
    grid: number[][];
    setGrid: React.Dispatch<React.SetStateAction<number[][]>>;
}

const SudokuGridCreator: React.FC<SudokuGridProps> = ({ grid, setGrid }) => {
    const handleChange = (rowIndex: number, colIndex: number, value: string) => {
        const newSudokuGrid = grid.map((row, rIndex) =>
            row.map((cell, cIndex) => (rIndex === rowIndex && cIndex === colIndex ? parseInt(value) || 0 : cell))
        );
        setGrid(newSudokuGrid);
    };

    return (
        <Grid
            templateColumns="repeat(9, 1fr)"
            border="2px solid black"
            width="fit-content"
        >
            {grid.flatMap((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <Box
                        key={`${rowIndex}-${colIndex}`}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        border="1px solid lightgray"
                        borderRight={(colIndex + 1) % 3 === 0 ? "2px solid black" : ""}
                        borderBottom={(rowIndex + 1) % 3 === 0 ? "2px solid black" : ""}
                        borderTop={rowIndex === 0 ? "1px solid black" : ""}
                        borderLeft={colIndex === 0 ? "1px solid black" : ""}
                    >
                        <Input
                            width="40px"
                            height="40px"
                            type="text"
                            inputMode="numeric"
                            pattern="[1-9]"
                            maxLength={1}
                            value={cell !== 0 ? cell.toString() : ""}
                            onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                            textAlign="center"
                            fontSize="xl"
                            fontWeight="bold"
                            border="none"
                            _focus={{
                                outline: "1px solid black",
                                outlineOffset: "1px",
                                borderRadius: "0px",
                            }}
                        />
                    </Box>
                ))
            )}
        </Grid>
    );
}

export default SudokuGridCreator;