import { useState, useEffect, useRef } from "react";

import { Sudoku, SudokuSolution } from "@/types/types";
import { SudokuStatusEnum } from "@/types/enums";
import { notifyError } from "@/toasts/toast";
import { fetchSolution } from "./sudoku-api";

type WebSocketCallbacks = {
    onComplete?: (sudokuId: string) => void;
};

/**
 * Custom hook to manage WebSocket connection for sudoku status updates
 */
export const useSudokuWebSocket = (
    sudokuId: string | null,
    headers: HeadersInit,
    setSudoku: (updater: (prevSudoku: Sudoku) => Sudoku) => void,
    callbacks?: WebSocketCallbacks
) => {
    const [isLoading, setIsLoading] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!sudokuId) return;

        // Close any existing connection
        if (socketRef.current) {
            socketRef.current.close();
        }

        setIsLoading(true);
        // Create new WebSocket connection
        const socket = new WebSocket(`ws://127.0.0.1:8000/ws/sudokus/${sudokuId}/status/`);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log(`WebSocket connected for Sudoku ${sudokuId}`);
        };

        socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "status_update") {
                const { sudoku_id, status } = data;
                setSudoku((prevSudoku) => ({ ...prevSudoku, status: status }));

                switch (status) {
                    case SudokuStatusEnum.Values.completed:
                        const fetchSolutionResponse = await fetchSolution(sudoku_id, headers);
                        if (fetchSolutionResponse?.ok) {
                            const sudokuSolution = await fetchSolutionResponse.json() as SudokuSolution;
                            setSudoku((prevSudoku) => ({ ...prevSudoku, solution: sudokuSolution }));
                            socket.close();
                            callbacks?.onComplete?.(sudoku_id);
                        }
                    case SudokuStatusEnum.Values.aborted:
                        socket.close();
                }
            }
        };

        socket.onerror = (error) => {
            console.error(`WebSocket error for Sudoku ${sudokuId}:`, error);
            notifyError("WebSocket connection error");
            setIsLoading(false);
        };

        socket.onclose = () => {
            console.log(`WebSocket closed for Sudoku ${sudokuId}`);
            setIsLoading(false);
        };

        // Cleanup function
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [sudokuId]);

    return { isLoading };
};
