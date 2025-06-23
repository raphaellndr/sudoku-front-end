import { Badge, Text } from "@chakra-ui/react";
import { FaAward, FaMedal, FaTrophy } from "react-icons/fa";

const RANK_ICONS = {
    0: <FaTrophy size={20} color="#FFD700" />,
    1: <FaMedal size={20} color="#C0C0C0" />,
    2: <FaAward size={20} color="#CD7F32" />,
} as const;

const RANK_COLORS = {
    1: "yellow",
    2: "gray",
    3: "orange"
} as const;

interface RankDisplayProps {
    position: number;
}

const RankDisplay: React.FC<RankDisplayProps> = ({ position }) => {
    const rank = position + 1;

    if (rank <= 3) {
        const colorScheme = RANK_COLORS[rank as keyof typeof RANK_COLORS];
        const icon = RANK_ICONS[position as keyof typeof RANK_ICONS];

        return (
            <Badge
                variant="subtle"
                colorScheme={colorScheme}
                display="flex"
                alignItems="center"
                gap={1}
                px={2}
                py={1}
                borderRadius="full"
            >
                {icon}
                #{rank}
            </Badge>
        );
    }

    return (
        <Text
            fontWeight="semibold"
            color="gray.600"
            fontSize="sm"
            minW="8"
            textAlign="center"
        >
            #{rank}
        </Text>
    );
};

export default RankDisplay;
