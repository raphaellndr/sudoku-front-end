import { Badge, Card, FormatNumber, HStack, Stat } from "@chakra-ui/react";

interface StatCardProps {
    label: string;
    statValue: number;
    numberStyle?: Intl.NumberFormatOptionsStyle;
    statHasIncreased: boolean;
    percentageChange: number;
    helpText: string;
};

const StatCard: React.FC<StatCardProps> = ({
    label,
    statValue,
    numberStyle,
    statHasIncreased,
    percentageChange,
    helpText,
}) => {
    return (
        <Card.Root size="sm" variant="subtle">
            <Card.Body>
                <Stat.Root>
                    <Stat.Label fontSize="sm" color="fg.muted">{label}</Stat.Label>
                    <HStack>
                        <Stat.ValueText fontSize="2xl" fontWeight="bold">
                            <FormatNumber
                                value={statValue}
                                style={numberStyle ? numberStyle : "decimal"}
                                maximumFractionDigits={2}
                                minimumFractionDigits={numberStyle === "percent" ? 2 : undefined}
                            />
                        </Stat.ValueText>
                        {helpText !== "" && (
                            <Badge
                                background="transparent"
                                gap="0"
                                size="sm"
                            >
                                <>
                                    {statHasIncreased ? (
                                        <Stat.UpIndicator color={percentageChange === 0 ? "gray" : undefined} />
                                    ) : (
                                        <Stat.DownIndicator />
                                    )}
                                    {percentageChange}%
                                </>
                            </Badge>
                        )}
                    </HStack>
                    <Stat.HelpText fontSize="xs">{helpText}</Stat.HelpText>
                </Stat.Root>
            </Card.Body>
        </Card.Root >
    );
};

export default StatCard;
