import { signIn } from "next-auth/react";
import { Button } from "@chakra-ui/react";

const SignInButton = () => {
    return (
        <Button
            variant="outline"
            display={{ base: "none", md: "inline-flex" }}
            onClick={() => signIn(undefined, { callbackUrl: "/" })}
        >
            Sign in
        </Button>
    );
};

export default SignInButton;
