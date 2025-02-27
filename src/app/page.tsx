"use client";

import { RegistrationPage } from "@/components/ui/registration/registration-page";
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
      <RegistrationPage/>
    </Center>
  );
};

export default HomePage;
