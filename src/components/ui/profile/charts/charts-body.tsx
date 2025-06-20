import {
    Accordion,
    Card,
    Flex,
    Heading,
    Spinner,
    Tabs,
} from "@chakra-ui/react";
import { LuRefreshCw, LuCalendar, LuClock } from "react-icons/lu";

import useCharts from "@/hooks/use-charts";

import ChartsDisplay from "./charts-display";
import TooltipIconButton from "../../tooltip-icon-button";

const ChartsBody = () => {
    const {
        status,
        isRefreshing,
        selectedPeriod,
        chartsData,
        handleRefresh,
        handlePeriodChange
    } = useCharts();

    if (status === "loading") {
        return (
            <Flex justify="center" align="center" height="300px">
                <Spinner size="xl" color="blue.500" />
            </Flex>
        );
    }

    return (
        <Accordion.ItemBody>
            <Card.Root>
                <Card.Header>
                    <Flex justify="space-between" align="center">
                        <Heading size="lg" color="fg.emphasized">
                            Your Game Charts
                        </Heading>
                        <TooltipIconButton
                            leftIcon={isRefreshing ? (
                                <Spinner size="sm" />
                            ) : (
                                <LuRefreshCw />
                            )}
                            tooltipText={isRefreshing ? "Charts are being refreshed" : "Refresh charts"}
                            variant="ghost"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                        />
                    </Flex>
                </Card.Header>
                <Card.Body>
                    <Tabs.Root
                        defaultValue="daily"
                        value={selectedPeriod}
                        onValueChange={(d) => handlePeriodChange(d.value)}
                    >
                        <Tabs.List>
                            <Tabs.Trigger value="daily">
                                <LuClock />
                                Daily (30 days)
                            </Tabs.Trigger>
                            <Tabs.Trigger value="monthly">
                                <LuCalendar />
                                Monthly (12 months)
                            </Tabs.Trigger>
                        </Tabs.List>

                        <Tabs.Content value="daily">
                            {chartsData.daily.isLoading ? (
                                <Flex justify="center" align="center" height="300px">
                                    <Spinner size="xl" color="blue.500" />
                                </Flex>
                            ) : chartsData.daily.data ? (
                                <ChartsDisplay data={chartsData.daily.data} period="daily" />
                            ) : (
                                <Flex justify="center" align="center" height="300px">
                                    <Heading size="md" color="fg.muted">
                                        No daily data available
                                    </Heading>
                                </Flex>
                            )}
                        </Tabs.Content>

                        <Tabs.Content value="monthly">
                            {chartsData.monthly.isLoading ? (
                                <Flex justify="center" align="center" height="300px">
                                    <Spinner size="xl" color="blue.500" />
                                </Flex>
                            ) : chartsData.monthly.data ? (
                                <ChartsDisplay data={chartsData.monthly.data} period="monthly" />
                            ) : (
                                <Flex justify="center" align="center" height="300px">
                                    <Heading size="md" color="fg.muted">
                                        No monthly data available
                                    </Heading>
                                </Flex>
                            )}
                        </Tabs.Content>
                    </Tabs.Root>
                </Card.Body>
            </Card.Root>
        </Accordion.ItemBody>
    );
};

export default ChartsBody;
