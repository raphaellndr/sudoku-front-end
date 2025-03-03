import { Box, Text } from "@chakra-ui/react"
import { signIn } from "next-auth/react";

const AccountAlreadyExists = () => {
    const handleLogin = () => {
        signIn(undefined, { callbackUrl: '/profile' });
    };

    return (
        <div>
            <Text>Already have an account? </Text>
            <Box>
                <Text
                    as="span"
                    color="blue.500"
                    cursor="pointer"
                    onClick={handleLogin}
                >
                    Sign in.
                </Text>
            </Box>
        </div>
    );
}

export default AccountAlreadyExists;