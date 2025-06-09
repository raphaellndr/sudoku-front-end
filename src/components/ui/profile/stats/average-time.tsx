import { Badge, Card, HStack, Stat } from "@chakra-ui/react";

interface AverageTimeProps {
    value: number;
}

const AverageTime: React.FC<AverageTimeProps> = ({ value }) => {
    const totalSeconds = Math.round(value);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return (
        <Card.Root size="sm" variant="subtle">
            <Card.Body>
                <Stat.Root>
                    <Stat.Label fontSize="sm" color="fg.muted">
                        Average Time Per Game
                    </Stat.Label>
                    <HStack>
                        <Stat.ValueText fontSize="2xl" fontWeight="bold" alignItems="baseline">
                            {hours !== 0 && (
                                <>
                                    {hours}<Stat.ValueUnit>hr</Stat.ValueUnit>
                                </>
                            )}
                            {minutes !== 0 && (
                                <>
                                    {minutes}<Stat.ValueUnit>min</Stat.ValueUnit>
                                </>
                            )}
                            {secs}<Stat.ValueUnit>sec</Stat.ValueUnit>
                        </Stat.ValueText>
                        <Badge background="transparent" gap="0" size="sm">
                            {true ? <Stat.UpIndicator /> : <Stat.DownIndicator />}
                            {3}%
                        </Badge>
                    </HStack>
                    <Stat.HelpText fontSize="xs">since last month</Stat.HelpText>
                </Stat.Root>
            </Card.Body>
        </Card.Root>
    );
};

export default AverageTime;
