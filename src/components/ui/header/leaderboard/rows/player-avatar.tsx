import { Avatar, Box, Text, HStack } from "@chakra-ui/react";

interface PlayerAvatarProps {
    username: string;
    totalGames: number;
    size?: "sm" | "md" | "lg";
    showGamesCount?: boolean;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
    username,
    totalGames,
    size = "lg",
    showGamesCount = true
}) => {
    return (
        <HStack gap={3}>
            <Avatar.Root size={size}>
                <Avatar.Fallback name={username} />
            </Avatar.Root>
            <Box>
                <Text fontWeight="medium">
                    {username}
                </Text>
                {showGamesCount && (
                    <Text fontSize="xs" color="gray.500">
                        {totalGames} games played
                    </Text>
                )}
            </Box>
        </HStack>
    );
};

export default PlayerAvatar;
