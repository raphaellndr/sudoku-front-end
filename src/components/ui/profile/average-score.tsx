import { Badge, FormatNumber, HStack, Stat, Card } from "@chakra-ui/react";

const AverageScore = () => {
    return (
        <Card.Root size="sm" variant="subtle">
            <Card.Body>
                <Stat.Root>
                    <Stat.Label fontSize="sm" color="fg.muted">Average Score</Stat.Label>
                    <HStack>
                        <Stat.ValueText fontSize="2xl" fontWeight="bold">
                            <FormatNumber value={1370} />
                        </Stat.ValueText>
                        <Badge colorPalette="orange" gap="0" size="sm">
                            <Stat.UpIndicator />
                            3%
                        </Badge>
                    </HStack>
                    <Stat.HelpText fontSize="xs">per game</Stat.HelpText>
                </Stat.Root>
            </Card.Body>
        </Card.Root>
    );
};

export default AverageScore;
