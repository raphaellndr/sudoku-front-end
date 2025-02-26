"use client";

import { Button, Box, Heading, Center, Spinner } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <Spinner size="lg"></Spinner>
  }

  // Is user is already authenticated, redirect to profile page
  if (session) {
    router.push("/profile")
  }

  const handleLogin = () => {
    signIn(undefined, { callbackUrl: '/profile' });
  };

  return (
    <Center height="100vh">
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
        <Heading mb={4}>You are not authenticated.</Heading>
        <Button colorScheme="teal" onClick={handleLogin}>
          Sign in
        </Button>
      </Box>
    </Center>
  );
};

export default HomePage;
