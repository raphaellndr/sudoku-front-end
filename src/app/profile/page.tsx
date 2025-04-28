"use client";

import { Box, Flex, VStack, Separator } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";

import Header from "@/components/ui/home-page/header/header";
import Footer from "@/components/ui/home-page/footer/footer";
import ProfileAccordion from "@/components/ui/profile/profile-accordion";
import ProfileInformation from "@/components/ui/profile/profile-information";

export default function Home() {
    return (
        <Flex direction="column" minHeight="100vh">
            <ToastContainer />
            <Header />
            <Box flex="1" maxW={"100"}>
                <VStack margin="10">
                    <ProfileInformation />
                    <ProfileAccordion />
                </VStack>
            </Box>
            <Separator marginLeft="5" marginRight="5" />
            <Footer />
        </Flex>
    );
}