"use client";

import { useSession } from "next-auth/react";

import { Spinner, Flex, Container } from "@chakra-ui/react";
import { useBreakpointValue } from "@chakra-ui/react";

import DesktopLayout from "./desktop-layout";
import MobileLayout from "./mobile-layout";

const MainContent = () => {
    const { status } = useSession();
    const isLargeScreen = useBreakpointValue({ base: false, lg: true });

    if (status === "loading") {
        return (
            <Container maxW="container.xl">
                <Flex justify="center" align="center" height="300px">
                    <Spinner size="xl" color="blue.500" />
                </Flex>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl">
            {isLargeScreen ? (
                <DesktopLayout />
            ) : (
                <MobileLayout />
            )}
        </Container>
    );
};

export default MainContent;
