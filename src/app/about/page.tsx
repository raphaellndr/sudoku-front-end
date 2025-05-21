"use client";

import { Box, Container, Flex, Separator, VStack } from "@chakra-ui/react";

import Header from "@/components/ui/header/header";
import Footer from "@/components/ui/footer/footer";
import AboutHeader from "@/components/ui/about-page/about-header";
import AboutSections from "@/components/ui/about-page/about-sections";

export default function Home() {
    return (
        <Flex direction="column" minHeight="100vh">
            <Header />
            <Box flex="1" maxW={"100"}>
                <Container maxW="container.lg">
                    <VStack gap={8} align="stretch" marginTop="5" marginBottom="10">
                        <AboutHeader />
                        <AboutSections />
                    </VStack>
                </Container>
            </Box>
            <Separator marginLeft="5" marginRight="5" />
            <Footer />
        </Flex>
    );
};
