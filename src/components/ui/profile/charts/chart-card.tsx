import { Chart, useChart } from "@chakra-ui/charts";
import { Card, Heading } from "@chakra-ui/react";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

import { ChartsPeriod } from "@/types/types";

import { ChartDataPoint } from "./charts-body";

interface ChartCardProps {
    data: ChartDataPoint[];
    series: any;
    period: ChartsPeriod;
    heading: string;
};

const ChartCard: React.FC<ChartCardProps> = ({
    data,
    series,
    period,
    heading,
}) => {
    const chartData = useChart({
        data: data,
        series: series,
    });

    const formatXAxisLabel = (
        value: string,
    ): string => {
        if (period === "daily") {
            return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
        return value.length > 10 ? value.substring(0, 10) + "..." : value;
    };

    return (
        <Card.Root>
            <Card.Header>
                <Heading size="md">{heading}</Heading>
            </Card.Header>
            <Card.Body>
                <Chart.Root maxH="sm" chart={chartData}>
                    <LineChart data={chartData.data}>
                        <CartesianGrid stroke={chartData.color("border")} vertical={false} />
                        <XAxis
                            axisLine={false}
                            dataKey={chartData.key("period")}
                            tickFormatter={formatXAxisLabel}
                            stroke={chartData.color("border")}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                            stroke={chartData.color("border")}
                        />
                        <Tooltip
                            animationDuration={100}
                            cursor={false}
                            content={<Chart.Tooltip />}
                        />
                        <Legend content={<Chart.Legend interaction="hover" />} />
                        {chartData.series.map((item) => (
                            <Line
                                key={item.name}
                                isAnimationActive={false}
                                dataKey={chartData.key(item.name)}
                                stroke={chartData.color(item.color)}
                                strokeWidth={2}
                                fill={chartData.color("bg")}
                                opacity={chartData.getSeriesOpacity(item.name)}
                                type="bump"
                                dot={false}
                            />
                        ))}
                    </LineChart>
                </Chart.Root>
            </Card.Body>
        </Card.Root>
    );
};

export default ChartCard;
