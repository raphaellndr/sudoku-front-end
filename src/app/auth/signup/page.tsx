"use client"

import { Center, Heading, Stack, VStack } from "@chakra-ui/react";

import RegistrationForm from "@/components/ui/account/registration/registration-form";
import OrSeparator from "@/components/ui/or-separator";
import GoogleButton from "@/components/ui/account/google-button";
import SignInPrompt from "@/components/ui/account/registration/sign-in-prompt";

export default function Home() {
    return (
        <Center height="100vh">
            <VStack gap="10">
                <Heading size="6xl" textAlign="center">Create your account</Heading>
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