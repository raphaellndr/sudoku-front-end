import { Center, Text, VStack } from "@chakra-ui/react"
import { useRouter } from "next/navigation";

const SignUpPrompt = () => {
    const router = useRouter();

    return (
        <Center>
            <VStack>
                <Text fontSize="sm">New to SudokuSolver?</Text>
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