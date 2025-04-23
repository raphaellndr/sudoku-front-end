import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import SudokuSolutionsPagination from "./sudoku-solutions-pagination";
import SudokuTabs from "./sudoku-tabs";
import { Sudoku } from "@/types/types";
import { notifyError } from "@/toasts/toast";

const pageSize = 5

interface SudokuSolutionsDisplayProps {
    sudokus: Sudoku[];
    setSudokus: React.Dispatch<React.SetStateAction<Sudoku[]>>;
};

const SudokuSolutionsDisplay: React.FC<SudokuSolutionsDisplayProps> = ({ sudokus, setSudokus }) => {
    const { data: session } = useSession();

    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (session) {
        headers.Authorization = "Bearer " + session.accessToken;
    }

    useEffect(() => {
        fetchSudokus();
    }, [session, page]);

    const fetchSudokus = async () => {
        const offset = (page - 1) * pageSize;
        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_BACKEND_URL + `api/sudokus?offset=${offset}&limit=${pageSize}`,
                {
                    method: "GET",
                    headers: headers,
                }
            );
            if (response.ok) {
                const responseData = await response.json();
                const fetchedSudokus: Sudoku[] = responseData["results"]
                setSudokus(fetchedSudokus);
                setCount(responseData.count);
            } else {
                notifyError("Failed to fetch Sudoku grids");
            }
        } catch (e: unknown) {
            const error = e as Error;
            notifyError(`An error occurred while fetching Sudoku grids: ${error.message}`);
        }
    };

    return (
        <>
            <SudokuTabs
                sudokus={sudokus}
                setSudokus={setSudokus}
            />
            <SudokuSolutionsPagination
                count={count}
                pageSize={pageSize}
                page={page}
                setPage={setPage}
            />
        </>
    );
};

export default SudokuSolutionsDisplay;