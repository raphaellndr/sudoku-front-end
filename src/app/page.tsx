"use client";

import { useSession } from 'next-auth/react';
import { Box, Separator, Show, Spinner, Flex } from '@chakra-ui/react';
import { ToastContainer } from 'react-toastify';

import Footer from '@/components/ui/home-page/footer/footer';
import Header from '@/components/ui/home-page/header/header';

const HomePage = () => {
    const { status } = useSession()

    return (
        <Show
            when={status !== "loading"}
            fallback={<Spinner />}
        >
            <Flex direction="column" minHeight="100vh">
                <ToastContainer />
                <Header />
                <Box flex="1"></Box>
                <Separator marginLeft="5" marginRight="5" />
                <Footer />
            </Flex>
        </Show>
    );
};

export default HomePage;