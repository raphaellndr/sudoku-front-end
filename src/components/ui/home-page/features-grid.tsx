import { Container, SimpleGrid } from "@chakra-ui/react";

import CustomCard from "../custom-card";

const FeaturesGrid = () => {
    return (
        <Container maxW="container.lg" py={10}>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={10}>
                <CustomCard
                    title="Play Sudokus"
                    description="Create your own Sudoku puzzle and play with it! Compete against time, get hints when stuck, and check your results."
                    rootProps={{
                        _hover: {
                            shadow: "lg",
                            transform: "translateY(-5px)",
                            transition: "all 0.2s ease-in-out",
                        }
                    }}
                />
                <CustomCard
                    title="Solve Sudokus"
                    description="Fill in a grid and solve it using various algorithms. View solution and solving time."
                    rootProps={{
                        _hover: {
                            shadow: "lg",
                            transform: "translateY(-5px)",
                            transition: "all 0.2s ease-in-out",
                        }
                    }}
                />
                <CustomCard
                    title="User Stats"
                    description="Create an account to track your progress and achievements."
                    rootProps={{
                        _hover: {
                            shadow: "lg",
                            transform: "translateY(-5px)",
                            transition: "all 0.2s ease-in-out",
                        }
                    }}
                />
            </SimpleGrid>
        </Container>
    );
};

export default FeaturesGrid;
