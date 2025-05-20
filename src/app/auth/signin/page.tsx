"use client"

import { Center, Stack, Text, VStack } from "@chakra-ui/react";

import LoginForm from "@/components/ui/account/auth/login-form";
import OrSeparator from "@/components/ui/or-separator";
import GoogleButton from "@/components/ui/account/google-button";
import SignUpPrompt from "@/components/ui/account/auth/sign-up-prompt";
import { SudokuArenaButton } from "@/components/ui/sudoku-arena-button";

export default function Home() {
    return (
        <Center height="100vh">
            <VStack gap="10">
                <Text
                    textStyle="6xl"
                    textAlign="center"
                >
                    Sign in to <SudokuArenaButton
                        textProps={{ fontSize: "6xl" }}
                        buttonProps={{
                            alignItems: "baseline",
                            p: "0",
                            m: "0"
                        }}
                    />
                </Text>
                <Stack gap="4">
                    <LoginForm />
                    <OrSeparator />
                    <GoogleButton buttonText="Continue with Google" />
                    <SignUpPrompt />
                </Stack>
            </VStack>
        </Center>
    );
};
