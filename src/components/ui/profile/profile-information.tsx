import { useSession } from "next-auth/react";
import { Avatar, HStack, Text, VStack } from "@chakra-ui/react";

const ProfileInformation = () => {
    const { data: session } = useSession();

    return (
        <HStack gap={4}>
            <Avatar.Root size="xl">
                <Avatar.Fallback name={session?.user?.username} />
            </Avatar.Root>
            <VStack align="start">
                <Text fontSize="2xl" fontWeight="bold">{session?.user?.username}</Text>
                <Text fontSize="md" color="gray.500">{session?.user?.email}</Text>
            </VStack>
        </HStack>
    );
};

export default ProfileInformation;