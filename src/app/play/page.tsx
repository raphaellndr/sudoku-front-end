"use client";

import { Box, Flex, Separator } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";

import PageHeader from "@/components/ui/play-page/page-header";
import MainContent from "@/components/ui/play-page/main-content";
import { useHeaderHeight } from "@/hooks/useHeaderHeight";
import { useLeaderboardState } from "@/hooks/useLeaderboardState";
import Footer from "@/components/ui/footer/footer";

export default function Home() {
    const { headerRef, headerHeight } = useHeaderHeight();
    const { isLeaderboardOpen, setIsLeaderboardOpen } = useLeaderboardState();

    const buttonTop = headerHeight + 16;

    return (
        <Flex direction="column" minHeight="100vh">
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

            <Separator marginLeft="5" marginRight="5" marginTop="5" />
            <Footer />
        </Flex>
    );
}
