"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Box, Button, Code, HStack, Spinner, Text, VStack } from "@chakra-ui/react";

export default function Home() {
    const { data: session, status } = useSession({ required: true });
    const [response, setResponse] = useState("{}");

    const getUserDetails = async (useToken: boolean) => {
        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_BACKEND_URL + "auth/user/",
                {
                    headers: useToken ? { Authorization: "Bearer " + session?.access_token } : {},
                }
            );
            const responseData = await response.json();
            if (response.ok) {
                setResponse(JSON.stringify(responseData));
            } else {
                setResponse("An error occurred.");
            }
        } catch (error) {
            if (error instanceof Error) {
                setResponse(error.message);
            } else {
                setResponse("An unknown error occurred.");
            }
        }
    };

    if (status == "loading") {
        return <Spinner size="lg"></Spinner>
    }

    if (session) {
        return (
            <Box m={8}>
                <VStack>
                    <Text>Username: {session.user.username}</Text>
                    <Text>Email: {session.user.email || "Not provided"}</Text>
                    <Code>
                        {response}
                    </Code>
                </VStack>
                <HStack justifyContent="center" mt={4}>
                    <Button colorScheme="blue" onClick={() => getUserDetails(true)}>
                        User details (with token)
                    </Button>
                    <Button colorScheme="orange" onClick={() => getUserDetails(false)}>
                        User details (without token)
                    </Button>
                    <Button colorScheme="red" onClick={() => signOut({ callbackUrl: "/" })}>
                        Sign out
                    </Button>
                </HStack>
            </Box>
        );
    }

    return <></>;
}