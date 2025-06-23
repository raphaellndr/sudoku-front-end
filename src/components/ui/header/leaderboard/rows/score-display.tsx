import { Text, VStack } from "@chakra-ui/react";

interface ScoreDisplayProps {
    totalScore: number;
    bestScore: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
    totalScore,
    bestScore
}) => {
    return (
        <VStack gap={0} align="end">
            <Text fontWeight="bold" fontSize="lg">
                {totalScore}
            </Text>
            <Text fontSize="xs" color="gray.500">
                Best: {bestScore}
            </Text>
        </VStack>
    );
};

export default ScoreDisplay;
