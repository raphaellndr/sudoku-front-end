import { Button } from "@chakra-ui/react";

const ClearButton = ({ show, onClick }: { show: boolean; onClick: () => void }) => {
    if (!show) return null;

    return (
        <Button variant="outline" onClick={onClick}>
            Clear grid
        </Button>
    );
};

export default ClearButton;
