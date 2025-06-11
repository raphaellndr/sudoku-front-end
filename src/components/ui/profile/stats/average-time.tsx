import { Badge, Card, HStack, Stat } from "@chakra-ui/react";

interface AverageTimeProps {
    value: number;
    evolution?: number | null;
    evolutionPercentage?: number | null;
    helpText: string;
};

const AverageTime: React.FC<AverageTimeProps> = ({
    value,
    evolution,
    evolutionPercentage,
    helpText,
}) => {
    const totalSeconds = Math.round(value);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const statHasIncreased = evolution !== undefined && evolution !== null ? evolution >= 0 : false;

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
                        {helpText !== "" && (
                            <Badge
                                background="transparent"
                                gap="0"
                                size="sm"
                            >
                                <>
                                    {statHasIncreased ? (
                                        <Stat.UpIndicator color={evolutionPercentage === 0 ? "gray" : undefined} />
                                    ) : (
                                        <Stat.DownIndicator />
                                    )}
                                    {evolutionPercentage}%
                                </>
                            </Badge>
                        )}
                    </HStack>
                    <Stat.HelpText fontSize="xs">{helpText}</Stat.HelpText>
                </Stat.Root>
            </Card.Body>
        </Card.Root>
    );
};

export default AverageTime;
