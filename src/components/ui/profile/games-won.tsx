import { Badge, Card, FormatNumber, HStack, Stat } from "@chakra-ui/react";

const GamesWon = () => {
    return (
        <Card.Root size="sm" variant="subtle">
            <Card.Body>
                <Stat.Root>
                    <Stat.Label fontSize="sm" color="fg.muted">Games Won</Stat.Label>
                    <HStack>
                        <Stat.ValueText fontSize="2xl" fontWeight="bold">
                            <FormatNumber value={17} />
                        </Stat.ValueText>
                        <Badge colorPalette="green" gap="0" size="sm">
                            <Stat.UpIndicator />
                            12%
                        </Badge>
                    </HStack>
                    <Stat.HelpText fontSize="xs">since last month</Stat.HelpText>
                </Stat.Root>
            </Card.Body>
        </Card.Root>
    );
};

export default GamesWon;
