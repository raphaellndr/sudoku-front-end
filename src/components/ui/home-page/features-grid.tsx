import { Container, SimpleGrid } from "@chakra-ui/react";

import { Feature } from "./feature";

const FeaturesGrid = () => {
    return (
        <Container maxW="container.lg" py={10}>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={10}>
                <Feature
                    title="Play Sudokus"
                    description="Create your own Sudoku puzzle and play with it! Compete against time, get hints when stuck, and check your results."
                />
                <Feature
                    title="Solve Sudokus"
                    description="Fill in a grid and solve it using various algorithms. View solution and solving time."
                />
                <Feature
                    title="User Stats"
                    description="Create an account to track your progress and achievements."
                />
            </SimpleGrid>
        </Container>
    );
};

export default FeaturesGrid;
