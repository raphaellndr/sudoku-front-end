import {
    Box,
    Text,
    Circle,
    Flex,
    Heading,
    Grid,
    GridItem,
} from "@chakra-ui/react";
import {
    LuPlay,
    LuCheck,
    LuClock
} from "react-icons/lu";
import { PiCursorClick } from "react-icons/pi";
import { IconType } from "react-icons";

import { useColorModeValue } from "../../color-mode";

interface TimelineItemProps {
    icon: IconType;
    title: string;
    children: React.ReactNode;
    step: number;
    color: string;
    isLast?: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ icon, title, children, step, color, isLast = false }) => {
    const stepBg = useColorModeValue("gray.100", "gray.700");
    const stepColor = useColorModeValue("gray.700", "gray.200");
    const textColor = useColorModeValue("gray.600", "gray.300");
    const lineColor = useColorModeValue("gray.200", "gray.600");

    return (
        <Flex>
            <Flex direction="column" align="center" mr={4}>
                <Circle size="42px" bg={color} color="white" mb={2}>
                    <Box as={icon} boxSize="20px" />
                </Circle>
                {!isLast && (
                    <Box
                        w="2px"
                        bg={lineColor}
                        flex="1"
                        h="full"
                    />
                )}
            </Flex>

            <Box pb={isLast ? 0 : 6}>
                <Flex align="center" mb={1}>
                    <Heading size="sm">{title}</Heading>
                    <Circle
                        size="22px"
                        bg={stepBg}
                        color={stepColor}
                        fontSize="xs"
                        fontWeight="bold"
                        ml={2}
                    >
                        {step}
                    </Circle>
                </Flex>
                <Text color={textColor} fontSize="sm">
                    {children}
                </Text>
            </Box>
        </Flex>
    );
};

const HowToPlayTimeline: React.FC = () => {
    return (
        <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={6}
        >
            <GridItem>
                <TimelineItem
                    icon={PiCursorClick}
                    title="Fill in the Grid"
                    step={1}
                    color="blue.400"
                >
                    Start by filling in the Sudoku grid with numbers. You can create your own puzzle or use a pre-filled grid to get started quickly.
                </TimelineItem>

                <TimelineItem
                    icon={LuPlay}
                    title="Start Playing"
                    step={2}
                    color="green.400"
                >
                    Once you have filled in the grid, click the "Start Playing" button to begin the game. The puzzle will be validated and solved in the background.
                </TimelineItem>

                <TimelineItem
                    icon={LuClock}
                    title="Gameplay"
                    step={3}
                    color="purple.400"
                >
                    Once the puzzle is validated, the game will start. You will see a timer and several buttons to help you solve the puzzle at your own pace.
                </TimelineItem>

                <TimelineItem
                    icon={LuCheck}
                    title="Completion"
                    step={4}
                    color="teal.400"
                    isLast
                >
                    When you successfully complete the puzzle, a celebration dialog will appear showing your time and score. Start a new puzzle by clicking "New puzzle".
                </TimelineItem>
            </GridItem>
        </Grid>
    );
};

export default HowToPlayTimeline;
