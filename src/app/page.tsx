"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Box, Separator, Show, Spinner, Flex, Button, Heading, Text } from "@chakra-ui/react";

import Footer from "@/components/ui/footer/footer";
import Header from "@/components/ui/header/header";
import HowItWorks from "@/components/ui/home-page/how-it-works";
import FeaturesGrid from "@/components/ui/home-page/features-grid";

const HomePage = () => {
    const { status } = useSession();
    const router = useRouter();

    const handleStartPlaying = () => router.push("/play");

    return (
        <Show when={status !== "loading"} fallback={<Spinner />}>
            <Flex direction="column" minHeight="100vh">
                <Header />

                <Box textAlign="center" py={10} px={6}>
                    <Heading as="h1" size="2xl" mb={2}>
                        Welcome to SudokuArena
                    </Heading>
                    <Text fontSize="xl" mb={6}>
                        Solve Sudoku puzzles and improve your skills!
                    </Text>
                </Box>

                <FeaturesGrid />

                <HowItWorks />

                <Box textAlign="center" py={10}>
                    <Button colorScheme="teal" size="lg" onClick={handleStartPlaying}>
                        Start Playing Now
                    </Button>
                </Box>

                <Separator marginLeft="5" marginRight="5" />
                <Footer />
            </Flex>
        </Show>
    );
};

export default HomePage;
