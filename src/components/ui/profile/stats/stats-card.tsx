import { Badge, Card, Flex, FormatNumber, Group, HStack, Icon, Stat, Text } from "@chakra-ui/react";

import { StatChangeEnum } from "@/types/enums";
import { getStatBadgeColor } from "@/utils/statBadgeColor";

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
    const statBadgeColor = getStatBadgeColor({
        statHasIncreased: statHasIncreased,
        percentageChange: percentageChange,
        changeType: StatChangeEnum.Values.increase
    });

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
                                minimumFractionDigits={2}
                            />
                        </Stat.ValueText>
                        <Badge
                            colorPalette={statBadgeColor}
                            background="transparent"
                            gap="0"
                            size="sm"
                        >
                            {statHasIncreased ? <Stat.UpIndicator /> : <Stat.DownIndicator />}
                            {percentageChange}%
                        </Badge>
                    </HStack>
                    <Stat.HelpText fontSize="xs">{helpText}</Stat.HelpText>
                </Stat.Root>
            </Card.Body>
        </Card.Root >
    );
};

export default StatCard;
