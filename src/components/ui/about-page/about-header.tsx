"use client";

import { Box, Heading, Text } from "@chakra-ui/react";

const AboutHeader = () => {
    return (
        <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={4}>
                About SudokuArena
            </Heading>
            <Text fontSize="xl">
                A journey of learning and passion for web development.
            </Text>
        </Box>
    );
};

export default AboutHeader;
