import { useRouter } from "next/navigation";

import { Button, ButtonProps, Text, TextProps } from "@chakra-ui/react";

interface SudokuArenaButtonProps {
    buttonProps?: ButtonProps;
    textProps?: TextProps;
};

export const SudokuArenaButton: React.FC<SudokuArenaButtonProps> = ({
    buttonProps,
    textProps,
}) => {
    const router = useRouter();

    const handleClick = () => router.push("/");

    return (
        <Button
            variant="ghost"
            onClick={handleClick}
            _hover={{ backgroundColor: "transparent" }}
            {...buttonProps}
        >
            <Text {...textProps}>
                <Text as="span" fontWeight="bold">
                    Sudoku
                </Text>
                Arena
            </Text>
        </Button>
    );
};
