
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { filterValidData } from "@/utils/dataProcessing";
import { formatDateMonthYear, safeFormatDate } from "@/utils/formatters";

const SF_COLOR_OWNERSHIP = "#F97316"; // orange
const SF_COLOR_RENTAL = "#3B82F6"; // blue

interface OwnershipRentalRatesChartProps {
  data: any[];
}

/**
 * One chart for San Francisco:
 * - Ownership Rate (solid orange line)
 * - Rental Rate (dashed blue line)
 * Y axis: 0-1 (rates divided by 100). 
 * X axis: Time (date).
 */
const OwnershipRentalRatesChart: React.FC<OwnershipRentalRatesChartProps> = ({ data }) => {
  // Only SF valid data and rates divided by 100
  const chartData = React.useMemo(() => {
    const filtered = filterValidData(
      data.filter(item => item.city === "San Francisco"),
      ["ownership_rate", "rental_rate"]
    );
    return filtered
      .map(item => ({
        ...item,
        ownership_rate: typeof item.ownership_rate === "number" ? item.ownership_rate / 100 : null,
        rental_rate: typeof item.rental_rate === "number" ? item.rental_rate / 100 : null,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No data available
      </div>
    );
  }

  // Calculate domain for x-axis from data dates
  const dateDomain = React.useMemo(() => {
    if (chartData.length === 0) return [0, 1] as [number, number];
    const dates = chartData.map(d => d.date.getTime());
    return [Math.min(...dates), Math.max(...dates)] as [number, number];
  }, [chartData]);

  return (
    <ChartContainer
      config={{
        "Ownership Rate": { color: SF_COLOR_OWNERSHIP },
        "Rental Rate": { color: SF_COLOR_RENTAL }
      }}
      className="h-96"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 60, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => safeFormatDate(value, formatDateMonthYear)}
            angle={-45}
            textAnchor="end"
            height={60}
            interval="preserveStartEnd"
            minTickGap={30}
            type="number"
            domain={dateDomain}
            scale="time"
          />
          <YAxis
            domain={[0, 1]}
            label={{
              value: "Rate",
              angle: -90,
              position: "insideLeft",
              offset: -40,
            }}
            width={80}
            tickFormatter={v => (v * 100).toFixed(0) + "%"}
          />
          <Tooltip
            content={<ChartTooltipContent />}
            labelFormatter={(label) => safeFormatDate(label, formatDateMonthYear)}
            formatter={(value, name, props) =>
              typeof value === "number"
                ? `${(value * 100).toFixed(1)}%`
                : value
            }
          />
          <Legend verticalAlign="bottom" height={36} />
          <Line
            type="monotone"
            dataKey="ownership_rate"
            name="Ownership Rate"
            stroke={SF_COLOR_OWNERSHIP}
            dot={false}
            isAnimationActive={false}
            connectNulls={true}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="rental_rate"
            name="Rental Rate"
            stroke={SF_COLOR_RENTAL}
            strokeDasharray="8 4"
            dot={false}
            isAnimationActive={false}
            connectNulls={true}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default OwnershipRentalRatesChart;
