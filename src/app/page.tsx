"use client";

import { Button, Center } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import RegistrationForm from "@/components/ui/registration/registration-form";

const HomePage = () => {
  return (
    <Center height="100vh">
      <RegistrationForm />
    </Center>
  );
};

export default HomePage;
