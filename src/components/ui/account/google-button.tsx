import { signIn } from "next-auth/react";

import { Button } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";

interface GoogleButtonProps {
    buttonText: string;
};

const GoogleButton: React.FC<GoogleButtonProps> = ({ buttonText, ...props }) => {
    return (
        <Button
            variant="outline"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            {...props}
        >
            <FcGoogle /> {buttonText}
        </Button>
    );
};

export default GoogleButton;