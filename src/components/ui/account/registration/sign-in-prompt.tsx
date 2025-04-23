import { Center, Text, VStack } from "@chakra-ui/react"
import { signIn } from "next-auth/react";

const SignInPrompt = () => {
    return (
        <Center>
            <VStack>
                <Text fontSize="sm">Already have an account?</Text>
                <Text
                    fontSize="sm"
                    color="blue.500"
                    cursor="pointer"
                    onClick={() => signIn(undefined, { callbackUrl: '/' })}
                    _hover={{ textDecoration: "underline" }}
                >
                    Sign in
                </Text>
            </VStack>
        </Center>
    );
}

export default SignInPrompt;