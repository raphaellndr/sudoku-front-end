import {
    Accordion,
    Card,
    Flex,
    Heading,
    Spinner,
    Tabs,
} from "@chakra-ui/react";
import { LuRefreshCw, LuCalendarDays, LuCalendar, LuTrendingUp, LuClock } from "react-icons/lu";
import { useSession } from "next-auth/react";
import { IoBarChartOutline } from "react-icons/io5";

import { useStats } from "@/hooks/use-stats";

import StatsGrid from "./stats-grid";
import TooltipIconButton from "../../tooltip-icon-button";

const StatsBody = () => {
    const { status } = useSession();
    const {
        statsData,
        selectedPeriod,
        isRefreshing,
        handlePeriodChange,
        handleRefresh
    } = useStats();

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
                            Your Game Statistics
                        </Heading>
                        <TooltipIconButton
                            leftIcon={isRefreshing ? (
                                <Spinner size="sm" />
                            ) : (
                                <LuRefreshCw />
                            )}
                            tooltipText={isRefreshing ? "Stats are being refreshed" : "Refresh stats"}
                            variant="ghost"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                        />
                    </Flex>
                </Card.Header>
                <Card.Body>
                    <Tabs.Root
                        defaultValue="monthly"
                        value={selectedPeriod}
                        onValueChange={(d) => handlePeriodChange(d.value)}
                    >
                        <Tabs.List>
                            <Tabs.Trigger value="daily">
                                <LuClock />
                                Today
                            </Tabs.Trigger>
                            <Tabs.Trigger value="weekly">
                                <LuCalendarDays />
                                This Week
                            </Tabs.Trigger>
                            <Tabs.Trigger value="monthly">
                                <LuCalendar />
                                This Month
                            </Tabs.Trigger>
                            <Tabs.Trigger value="yearly">
                                <LuTrendingUp />
                                This Year
                            </Tabs.Trigger>
                            <Tabs.Trigger value="allTime">
                                <IoBarChartOutline />
                                All Time
                            </Tabs.Trigger>
                        </Tabs.List>

                        {(['daily', 'weekly', 'monthly', 'yearly', 'allTime'] as const).map((period) => (
                            <Tabs.Content key={period} value={period}>
                                <StatsGrid
                                    currentStats={statsData[period].current}
                                    previousStats={statsData[period].previous}
                                    isLoading={statsData[period].isLoading}
                                    period={period}
                                />
                            </Tabs.Content>
                        ))}
                    </Tabs.Root>
                </Card.Body>
            </Card.Root>
        </Accordion.ItemBody>
    );
};

export default StatsBody;
