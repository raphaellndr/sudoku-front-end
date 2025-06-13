import { useEffect, useState } from "react";

import { FaTrophy } from "react-icons/fa";
import {
    Box,
    Button,
    Collapsible
} from "@chakra-ui/react";

type OpenChangeHandler = (details: { open: boolean }) => void;

interface LeaderboardButtonProps {
    onClick?: () => void;
}

const LeaderboardButton = ({ onClick }: LeaderboardButtonProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);

    const handleCollapsibleOpenChange: OpenChangeHandler = (details) => {
        setIsCollapsibleOpen(details.open);
    };

    useEffect(() => {
        setIsCollapsibleOpen(isHovered);
    }, [isHovered]);

    return (
        <Collapsible.Root open={isCollapsibleOpen} onOpenChange={handleCollapsibleOpenChange}>
            <Button
                variant="outline"
                colorScheme="yellow"
                borderRadius="full"
                height="56px"
                minWidth="56px"
                overflow="hidden"
                transition="all 0.7s ease"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={2}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
            >
                <FaTrophy />
                <Collapsible.Content>
                    <Box as="span" pl={2} whiteSpace="nowrap">
                        Leaderboard
                    </Box>
                </Collapsible.Content>
            </Button>
        </Collapsible.Root>
    );
};

export default LeaderboardButton;
