import React from "react";
import { useRouter } from "next/navigation";

import { Box, Button, ButtonProps } from "@chakra-ui/react";

interface DrawerButtonProps extends ButtonProps {
    buttonText: string;
    routerHref?: string;
}

const DrawerButton: React.FC<DrawerButtonProps> = ({ buttonText, routerHref, ...props }) => {
    const router = useRouter();

    return (
        <Box
            width="full"
            justifyContent="flex-start"
        >
            <Button
                mt={4}
                fontWeight="bold"
                variant="ghost"
                size="sm"
                onClick={() => { if (routerHref) router.push(routerHref) }}
                _hover={{
                    backgroundColor: "transparent",
                    color: "blue.600"
                }}
                {...props}
            >
                {buttonText}
            </Button>
        </Box>
    );
};

export default DrawerButton;
