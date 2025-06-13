import { Button } from "@chakra-ui/react";

const SolveButton = ({
    show,
    disabled,
    onClick
}: {
    show: boolean;
    disabled: boolean;
    onClick: () => void
}) => {
    if (!show) return null;

    return (
        <Button disabled={disabled} onClick={onClick}>
            Solve sudoku
        </Button>
    );
};

export default SolveButton;
