"use client"

import { Box, Container, Stack, Text, Link, HStack, Icon } from "@chakra-ui/react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <Box py={8} borderTop="1px" borderColor="gray.200" mt="auto">
            <Container maxW="container.lg">
                <Stack direction={["column", "row"]} justify="space-between" align="center">
                    <Text>&copy; {new Date().getFullYear()} SudokuSolver. All rights reserved.</Text>

                    <Stack direction="row" gap={6}>
                        <Link href="https://github.com/raphaellndr/your-repo">
                            <HStack>
                                <Icon as={FaGithub} boxSize={5} />
                                <Text>Source Code</Text>
                            </HStack>
                        </Link>

                        <Link href="https://www.linkedin.com/in/rapha%C3%ABl-landur%C3%A9-16028a183/">
                            <Icon as={FaLinkedin} boxSize={5} />
                        </Link>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}

export default Footer;