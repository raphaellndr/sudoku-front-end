"use client";

import { VStack, Box } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";

import PageHeader from "@/components/ui/play-page/page-header";
import PageFooter from "@/components/ui/play-page/page-footer";
import MainContent from "@/components/ui/play-page/main-content";
import { useHeaderHeight } from "@/hooks/useHeaderHeight";
import { useLeaderboardState } from "@/hooks/useLeaderboardState";

export default function Home() {
    const { headerRef, headerHeight } = useHeaderHeight();
    const { isLeaderboardOpen, setIsLeaderboardOpen } = useLeaderboardState();

    const buttonTop = headerHeight + 16;

    return (
        <VStack minHeight="100vh" gap={0}>
            <ToastContainer />

            <PageHeader ref={headerRef} />

            <Box
                flex="1"
                width="100%"
                px={4}
                pt={`${buttonTop}px`}
                position="relative"
            >
                <MainContent
                    headerHeight={headerHeight}
                    isLeaderboardOpen={isLeaderboardOpen}
                    setIsLeaderboardOpen={setIsLeaderboardOpen}
                />
            </Box>

            <PageFooter />
        </VStack>
    );
}
