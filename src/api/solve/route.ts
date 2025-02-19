import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { sudoku } = await request.json();
    // Logique de résolution du sudoku ici
    const solution = solveSudoku(sudoku);
    return NextResponse.json({ solution });
}

function solveSudoku(sudoku: number[][]): number[][] {
    // Implémentez ou appelez un algorithme de résolution de sudoku
    return sudoku; // Retourne une grille résolue fictive pour l'exemple
}
