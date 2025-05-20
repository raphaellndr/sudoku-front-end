"use client"

import { Center, Heading, Stack, Text, VStack } from "@chakra-ui/react";

import RegistrationForm from "@/components/ui/account/registration/registration-form";
import OrSeparator from "@/components/ui/or-separator";
import GoogleButton from "@/components/ui/account/google-button";
import SignInPrompt from "@/components/ui/account/registration/sign-in-prompt";
import { SudokuArenaButton } from "@/components/ui/sudoku-arena-button";

export default function Home() {
    return (
        <Center height="100vh">
            <VStack gap="10">
                <VStack>
                    <Text
                        textStyle="6xl"
                        textAlign="center"
                    >
                        New to <SudokuArenaButton
                            textProps={{ fontSize: "6xl" }}
                            buttonProps={{
                                alignItems: "baseline",
                                p: "0",
                                m: "0"
                            }}
                        />?
                    </Text>
                    <Heading size="6xl" textAlign="center">Create your account</Heading>
                </VStack>
                <Stack gap="4">
                    <RegistrationForm />
                    <OrSeparator />
                    <GoogleButton buttonText="Sign in with Google" />
                    <SignInPrompt />
                </Stack>
            </VStack>
        </Center>
    )
}