import { Button } from "@chakra-ui/react";

const AbortButton = ({ show, onClick }: { show: boolean; onClick: () => void }) => {
    if (!show) return null;

    return (
        <Button variant="outline" colorPalette="red" onClick={onClick}>
            Abort solving
        </Button>
    );
};

export default AbortButton;
