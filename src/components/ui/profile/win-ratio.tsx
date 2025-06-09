import { Badge, FormatNumber, HStack, Stat, Card } from "@chakra-ui/react";

const WinRatio = () => {
    return (
        <Card.Root size="sm" variant="subtle">
            <Card.Body>
                <Stat.Root>
                    <Stat.Label fontSize="sm" color="fg.muted">Win Ratio</Stat.Label>
                    <HStack>
                        <Stat.ValueText fontSize="2xl" fontWeight="bold">
                            <FormatNumber value={0.68} style="percent" />
                        </Stat.ValueText>
                        <Badge colorPalette="green" gap="0" size="sm">
                            <Stat.UpIndicator />
                            5%
                        </Badge>
                    </HStack>
                    <Stat.HelpText fontSize="xs">since last month</Stat.HelpText>
                </Stat.Root>
            </Card.Body>
        </Card.Root>
    );
};

export default WinRatio;
