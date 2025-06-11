import { Chart, useChart } from "@chakra-ui/charts";
import { Card, Heading } from "@chakra-ui/react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

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
    const dataChart = useChart({
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
                <Chart.Root maxH="sm" chart={dataChart}>
                    <LineChart data={dataChart.data}>
                        <CartesianGrid stroke={dataChart.color("border")} vertical={false} />
                        <XAxis
                            axisLine={false}
                            dataKey={dataChart.key("period")}
                            tickFormatter={formatXAxisLabel}
                            stroke={dataChart.color("border")}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                            stroke={dataChart.color("border")}
                        />
                        <Tooltip
                            animationDuration={100}
                            cursor={false}
                            content={<Chart.Tooltip />}
                        />
                        {dataChart.series.map((item) => (
                            <Line
                                key={item.name}
                                isAnimationActive={false}
                                dataKey={dataChart.key(item.name)}
                                stroke={dataChart.color(item.color)}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                        ))}
                    </LineChart>
                </Chart.Root>
            </Card.Body>
        </Card.Root>
    );
};

export default ChartCard;
