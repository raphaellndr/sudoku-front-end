import { useSession } from "next-auth/react";
import { Avatar, Card, Flex, HStack, Spinner, Text, VStack } from "@chakra-ui/react";

const ProfileInformation = () => {
    const { data: session } = useSession();

    if (!session || !session.user) {
        return (
            <Flex justify="center" align="center" height="300px">
                <Spinner size="xl" color="blue.500" />
            </Flex>
        );
    }

    return (
        <Card.Root borderRadius="full">
            <Card.Body>
                <HStack gap={4}>
                    <Avatar.Root size="xl">
                        <Avatar.Fallback name={session.user.username ? session.user.username : ""} />
                    </Avatar.Root>
                    <VStack align="start">
                        <Text fontSize="2xl" fontWeight="bold">{session?.user?.username}</Text>
                        <Text fontSize="md" color="gray.500">{session?.user?.email}</Text>
                    </VStack>
                </HStack>
            </Card.Body>
        </Card.Root>
    );
};

export default ProfileInformation;