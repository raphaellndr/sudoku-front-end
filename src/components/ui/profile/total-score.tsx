import { Badge, FormatNumber, HStack, Stat, Card } from "@chakra-ui/react";

const TotalScore = () => {
    return (
        <Card.Root size="sm" variant="subtle">
            <Card.Body>
                <Stat.Root>
                    <Stat.Label fontSize="sm" color="fg.muted">Total Score</Stat.Label>
                    <HStack>
                        <Stat.ValueText fontSize="2xl" fontWeight="bold">
                            <FormatNumber value={34250} />
                        </Stat.ValueText>
                        <Badge colorPalette="purple" gap="0" size="sm">
                            <Stat.UpIndicator />
                            15%
                        </Badge>
                    </HStack>
                    <Stat.HelpText fontSize="xs">all time total</Stat.HelpText>
                </Stat.Root>
            </Card.Body>
        </Card.Root>
    );
};

export default TotalScore;
