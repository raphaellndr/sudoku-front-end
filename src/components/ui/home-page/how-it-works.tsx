import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react"

const HowItWorks = () => {
    return (
        <Container maxW="container.lg" py={10}>
            <Heading size="2xl" textAlign="center" mb={10}>
                How It Works
            </Heading>
            <VStack gap={8}>
                <Box textAlign="center">
                    <Text fontSize="lg" fontWeight="bold">
                        1. Choose Your Mode
                    </Text>
                    <Text>Decide whether you want to play Sudoku or solve a Sudoku puzzle.</Text>
                </Box>
                <Box textAlign="center">
                    <Text fontSize="lg" fontWeight="bold">
                        2. Fill in the Grid
                    </Text>
                    <Text>In both modes, start by filling in the Sudoku grid.</Text>
                </Box>
                <Box textAlign="center">
                    <Text fontSize="lg" fontWeight="bold">
                        3. Play or Solve
                    </Text>
                    <Text>Play against time or use algorithms to solve the puzzle and view the solution.</Text>
                </Box>
                <Box textAlign="center">
                    <Text fontSize="lg" fontWeight="bold">
                        4. Track Your Progress (Optional)
                    </Text>
                    <Text>Create an account to save your stats and achievements.</Text>
                </Box>
            </VStack>
        </Container>
    );
};

export default HowItWorks;
