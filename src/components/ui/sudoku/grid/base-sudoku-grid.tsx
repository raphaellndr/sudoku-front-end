import { ReactNode } from "react";

import { Box, Grid } from "@chakra-ui/react";

import { Sudoku } from "@/types/sudoku";

import { useColorModeValue } from "../../color-mode";

export interface BaseSudokuGridProps {
    sudoku: Sudoku;
    renderCell: (position: [number, number], index: number) => ReactNode;
}

export const BaseSudokuGrid: React.FC<BaseSudokuGridProps> = ({
    renderCell,
}) => {
    const borderColor = useColorModeValue("gray.300", "gray.600");
    const strongBorderColor = useColorModeValue("black", "white");
    const hoverBgColor = useColorModeValue("gray.200", "gray.900");
    const evenBoxBgColor = useColorModeValue("gray.100", "gray.700");
    const oddBoxBgColor = useColorModeValue("white", "gray.800");

    return (
        <Grid
            templateColumns="repeat(9, 1fr)"
            width="fit-content"
            border={`1px solid ${strongBorderColor}`}
            borderRadius="md"
        >
            {Array.from({ length: 81 }).map((_, index) => {
                const rowIndex = Math.floor(index / 9);
                const colIndex = index % 9;

                // Determine box background color
                const isEvenBox = (Math.floor(rowIndex / 3) + Math.floor(colIndex / 3)) % 2 === 0;
                const boxBgColor = isEvenBox ? evenBoxBgColor : oddBoxBgColor;

                return (
                    <Box
                        key={index}
                        width="40px"
                        height="40px"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        bg={boxBgColor}
                        borderWidth="1px"
                        borderTopLeftRadius={colIndex === 0 && rowIndex === 0 ? "md" : ""}
                        borderTopRightRadius={colIndex === 8 && rowIndex === 0 ? "md" : ""}
                        borderBottomLeftRadius={colIndex === 0 && rowIndex === 8 ? "md" : ""}
                        borderBottomRightRadius={colIndex === 8 && rowIndex === 8 ? "md" : ""}
                        borderColor={borderColor}
                        _hover={{ bg: hoverBgColor }}
                        position="relative"
                    >
                        {renderCell([rowIndex, colIndex], index)}
                    </Box>
                );
            })}
        </Grid>
    );
};
