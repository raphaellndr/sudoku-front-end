import { Sudoku } from "@/types/types";
import { Box, Button, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface SudokuGridProps {
    sudokuGrid: string;
};

const DisplaySudokuGrid: React.FC<SudokuGridProps> = ({ sudokuGrid }) => {
    return (
        <Box p={5}>
            <SimpleGrid columns={9}>
                {Array.from({ length: 9 }).map((_, rowIndex) =>
                    Array.from({ length: 9 }).map((_, colIndex) => {
                        const cellIndex = rowIndex * 9 + colIndex;
                        const cellValue = sudokuGrid[cellIndex];
                        return (
                            <Box
                                key={`${rowIndex}-${colIndex}`}
                                width="35px"
                                height="35px"
                                borderWidth="1px"
                                alignContent="center"
                            >
                                <Text key={`${rowIndex}-${colIndex}`} textAlign="center">{cellValue || ''}</Text>
                            </Box>
                        )
                    })
                )}
            </SimpleGrid>
        </Box>
    );
};

const SudokuList = () => {
    const { data: session, status } = useSession();
    const [sudokus, setSudokus] = useState<Sudoku[]>([]);

    const notifyError = (message: string) => toast.error(
        message,
        {
            position: "bottom-right",
        }
    );

    const fetchSudokus = async () => {
        console.log(sudokus)
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
                    const sudokus = await response.json();
                    const grids: string[] = [];
                    sudokus.forEach((sudoku: Sudoku) => {
                        grids.push(sudoku.grid);
                    });
                    setSudokus(sudokus);
                } else {
                    console.error('Failed to fetch Sudoku grids');
                    notifyError('Failed to fetch Sudoku grids');
                }
            } catch (e: unknown) {
                const error = e as Error;
                console.error('Error fetching Sudoku grids:', error);
                notifyError(`An error occurred while fetching Sudoku grids: ${error.message}`);
            }
        }
    };

    useEffect(() => {
        fetchSudokus();
    }, []);

    return (
        <>
            <ToastContainer />
            <VStack p={5}>
                <Button size="sm" width="150px" onClick={fetchSudokus}>
                    Fetch Sudokus
                </Button>
                {sudokus.map((sudoku, index) => (
                    <Box key={index}>
                        <Text mb={2}>Sudoku {index + 1}</Text>
                        <DisplaySudokuGrid sudokuGrid={sudoku.grid} />
                    </Box>
                ))}
            </VStack>
        </>
    );
};

export default SudokuList;