import {
    Box,
    Heading,
    Text,
    Grid,
    GridItem,
    Icon,
    Flex,
    Card,
} from "@chakra-ui/react";
import {
    MdOutlineGridOn,
    MdFilterNone,
    MdOutlineNumbers
} from "react-icons/md";
import { IconType } from "react-icons";

import { useColorModeValue } from "../color-mode";

interface RuleCardProps {
    icon: IconType;
    title: string;
    children: React.ReactNode;
    color: string;
}

const RuleCard: React.FC<RuleCardProps> = ({ icon, title, children, color }) => {
    const cardBg = useColorModeValue("white", "gray.800");
    const iconBg = useColorModeValue(`${color}.50`, `${color}.900`);

    return (
        <GridItem>
            <Card.Root
                variant="outline"
                bg={cardBg}
                borderRadius="lg"
                borderTop="4px solid"
                borderColor={color}
                boxShadow="md"
                height="100%"
            >
                <Card.Header pb={2}>
                    <Flex align="center">
                        <Box
                            p={2}
                            borderRadius="lg"
                            bg={iconBg}
                            mr={3}
                        >
                            <Icon as={icon} boxSize={6} color={color} />
                        </Box>
                        <Heading size="md">{title}</Heading>
                    </Flex>
                </Card.Header>
                <Card.Body pt={0}>
                    <Text>
                        {children}
                    </Text>
                </Card.Body>
            </Card.Root>
        </GridItem>
    );
};

const RulesSection: React.FC = () => {
    return (
        <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={6}
        >
            <RuleCard
                icon={MdOutlineGridOn}
                title="Fill the Grid"
                color="blue.500"
            >
                The objective is to fill a 9×9 grid with digits so that each column, each row, and each of
                the nine 3×3 subgrids contain all of the digits from 1 to 9.
            </RuleCard>

            <RuleCard
                icon={MdFilterNone}
                title="Single Solution"
                color="purple.500"
            >
                The puzzle setter provides a partially completed grid, which for a well-posed
                puzzle has a single solution. Start with the provided numbers and logically
                deduce the rest.
            </RuleCard>

            <RuleCard
                icon={MdOutlineNumbers}
                title="No Repeats"
                color="teal.500"
            >
                You can only use each digit from 1 to 9 once in each row, column, and 3×3 subgrid.
                If a number appears once in a row, it cannot appear again in that same row.
            </RuleCard>
        </Grid>
    );
};

export default RulesSection;
