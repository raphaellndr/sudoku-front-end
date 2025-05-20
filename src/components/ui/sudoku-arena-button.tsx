import { useRouter } from "next/navigation";

import { Button, Text, TextProps } from "@chakra-ui/react";

export const SudokuArenaButton: React.FC<TextProps> = ({ ...props }) => {
    const router = useRouter();

    const handleClick = () => router.push("/");

    return (
        <Button
            variant="ghost"
            onClick={handleClick}
            _hover={{ backgroundColor: "transparent" }}
        >
            <Text {...props}>
                <Text as="span" fontWeight="bold">
                    Sudoku
                </Text>
                Arena
            </Text>
        </Button>
    );
};
