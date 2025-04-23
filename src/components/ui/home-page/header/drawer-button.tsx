import React from "react";
import { Button, ButtonProps } from "@chakra-ui/react";

interface DrawerButtonProps extends ButtonProps {
    buttonText: string;
}

const DrawerButton: React.FC<DrawerButtonProps> = ({ buttonText, ...props }) => {
    return (
        <Button
            mt={4}
            fontWeight="bold"
            variant="ghost"
            size="sm"
            width="full"
            justifyContent="flex-start"
            _hover={{
                backgroundColor: "transparent",
            }}
            {...props}
        >
            {buttonText}
        </Button>
    );
};

export default DrawerButton;
