import { useRouter } from "next/navigation";

import { Button } from "@chakra-ui/react";

interface HeaderButtonProps {
    buttonText: string;
    routerHref: string;
};

const HeaderButton: React.FC<HeaderButtonProps> = ({ buttonText, routerHref, ...props }) => {
    const router = useRouter();

    return (
        <Button
            variant="ghost"
            fontSize="md"
            onClick={() => router.push(routerHref)}
            _hover={{
                textDecoration: "underline",
                backgroundColor: "transparent"
            }}
            {...props}
        >
            {buttonText}
        </Button>
    );
};

export default HeaderButton;