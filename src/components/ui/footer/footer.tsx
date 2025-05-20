"use client"

import { Box, Container, Text, HStack } from "@chakra-ui/react";

import EmailButton from "./email-button";
import LinkedInButton from "./linkedin-button";
import GithubMenu from "./github-menu";

const Footer = () => {
    return (
        <Box py={8} borderTop="1px" borderColor="gray.200" mt="auto">
            <Container maxW="container.lg">
                <HStack justify="space-between" align="center">
                    <Text>&copy; {new Date().getFullYear()} SudokuArena. All rights reserved.</Text>
                    <HStack gap={6}>
                        <GithubMenu />
                        <LinkedInButton />
                        <EmailButton />
                    </HStack>
                </HStack>
            </Container>
        </Box>
    );
}

export default Footer;