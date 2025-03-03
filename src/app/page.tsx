"use client";

import { RegistrationPage } from "@/components/ui/registration/registration-page";
import { Button, Center } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  return (
    <Center height="100vh">
      <RegistrationPage />
    </Center>
  );
};

export default HomePage;
