"use client"

import { Center, Heading, Stack, VStack } from "@chakra-ui/react";

import LoginForm from "@/components/ui/account/auth/login-form";
import OrSeparator from "@/components/ui/or-separator";
import GoogleButton from "@/components/ui/account/google-button";
import SignUpPrompt from "@/components/ui/account/auth/sign-up-prompt";

export default function Home() {
    return (
        <Center height="100vh">
            <VStack gap="10">
                <Heading size="6xl" textAlign="center">Sign in to SudokuArena</Heading>
                <Stack gap="4">
                    <LoginForm />
                    <OrSeparator />
                    <GoogleButton buttonText="Continue with Google" />
                    <SignUpPrompt />
                </Stack>
            </VStack>
        </Center>
    )
}