import { Badge, FormatNumber, HStack, Stat, Card } from "@chakra-ui/react";

const GamesPlayed = () => {
    return (
        <Card.Root size="sm" variant="subtle">
            <Card.Body>
                <Stat.Root>
                    <Stat.Label fontSize="sm" color="fg.muted">Games Played</Stat.Label>
                    <HStack>
                        <Stat.ValueText fontSize="2xl" fontWeight="bold">
                            <FormatNumber value={25} />
                        </Stat.ValueText>
                        <Badge colorPalette="blue" gap="0" size="sm">
                            <Stat.UpIndicator />
                            8%
                        </Badge>
                    </HStack>
                    <Stat.HelpText fontSize="xs">since last month</Stat.HelpText>
                </Stat.Root>
            </Card.Body>
        </Card.Root>
    );
};

export default GamesPlayed;
