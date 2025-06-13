"use client";

import { useSession } from "next-auth/react";

import { Spinner, Flex, Container } from "@chakra-ui/react";
import { useBreakpointValue } from "@chakra-ui/react";

import DesktopLayout from "./desktop-layout";
import MobileLayout from "./mobile-layout";

interface MainContentProps {
    headerHeight: number;
    isLeaderboardOpen: boolean;
    setIsLeaderboardOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainContent = ({
    headerHeight,
    isLeaderboardOpen,
    setIsLeaderboardOpen
}: MainContentProps) => {
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
                <MobileLayout
                    headerHeight={headerHeight}
                    isLeaderboardOpen={isLeaderboardOpen}
                    setIsLeaderboardOpen={setIsLeaderboardOpen}
                />
            )}
        </Container>
    );
};

export default MainContent;
