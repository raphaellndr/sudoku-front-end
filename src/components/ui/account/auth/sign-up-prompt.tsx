import { useRouter } from "next/navigation";

import { Center, Text, VStack } from "@chakra-ui/react"

const SignUpPrompt = () => {
    const router = useRouter();

    return (
        <Center>
            <VStack>
                <Text fontSize="sm">New to SudokuArena?</Text>
                <Text
                    fontSize="sm"
                    color="blue.500"
                    cursor="pointer"
                    onClick={() => router.push("/auth/signup")}
                    _hover={{ textDecoration: "underline" }}
                >
                    Sign up
                </Text>
            </VStack>
        </Center>
    );
}

export default SignUpPrompt;