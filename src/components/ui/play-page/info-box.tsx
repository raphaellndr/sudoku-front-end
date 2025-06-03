import { Box, Flex, Text } from "@chakra-ui/react";

import { useColorModeValue } from "../color-mode";

interface InfoBoxProps {
    icon: React.ReactNode;
    statTitle: string;
    stat: string | number;
};

const InfoBox: React.FC<InfoBoxProps> = ({
    icon, statTitle, stat,
}) => {
    // Color mode values
    const cardBg = useColorModeValue("gray.50", "gray.700");
    const cardBorder = useColorModeValue("gray.200", "gray.600");

    return (
        <Box
            p={4}
            bg={cardBg}
            borderRadius="lg"
            w="full"
            border="1px solid"
            borderColor={cardBorder}
        >
            <Flex align="center" justify="center">
                {icon}
                <Text ml={3} fontSize="lg">
                    <Text as="span" fontWeight="bold">{statTitle}</Text> {stat}
                </Text>
            </Flex>
        </Box>
    );
};

export default InfoBox;
