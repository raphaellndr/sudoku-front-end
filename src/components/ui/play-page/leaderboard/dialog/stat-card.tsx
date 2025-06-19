import { Card, Text } from "@chakra-ui/react";

interface StatCardProps {
    value: string | number;
    label: string;
    color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    value,
    label,
    color = "blue.600"
}) => {
    return (
        <Card.Root size="sm" variant="outline" flex={1}>
            <Card.Body textAlign="center" py={4}>
                <Text fontSize="2xl" fontWeight="bold" color={color}>
                    {value}
                </Text>
                <Text fontSize="sm" color="gray.600">{label}</Text>
            </Card.Body>
        </Card.Root>
    );
};

export default StatCard;
