
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
const SF_COLOR_RENTAL = "#3B82F6"; // blue for distinction

interface OwnershipRentalRatesChartProps {
  data: any[];
}

/**
 * Two separate charts for San Francisco:
 * - Ownership Rate (%)
 * - Rental Rate (%)
 * Y axis scaled by multiplying original decimal data points by 100.
 * X axis is a proper time series with date numeric scale.
 */
const OwnershipRentalRatesChart: React.FC<OwnershipRentalRatesChartProps> = ({ data }) => {
  // Filter for SF only, valid ownership & rental rate and valid date, multiply rates by 100, sort by date asc
  const chartData = React.useMemo(() => {
    const filtered = filterValidData(
      data.filter(item => item.city === "San Francisco"),
      ["ownership_rate", "rental_rate"]
    );
    return filtered
      .map(item => ({
        ...item,
        ownership_rate: typeof item.ownership_rate === "number" ? item.ownership_rate * 100 : null,
        rental_rate: typeof item.rental_rate === "number" ? item.rental_rate * 100 : null,
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

  // Calculate domain for x-axis from data dates for better scale accuracy
  const dateDomain = React.useMemo(() => {
    if (chartData.length === 0) return [0, 1] as [number, number]; // Provide default numeric values
    const dates = chartData.map(d => d.date.getTime());
    return [Math.min(...dates), Math.max(...dates)] as [number, number];
  }, [chartData]);

  return (
    <div className="space-y-12 h-full">
      <ChartContainer
        config={{ "San Francisco - Ownership": { color: SF_COLOR_OWNERSHIP } }}
        className="h-72"
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
              domain={[0, 100]}
              label={{
                value: "Ownership Rate (%)",
                angle: -90,
                position: "insideLeft",
                offset: -40,
              }}
              width={80}
            />
            <Tooltip
              content={<ChartTooltipContent />}
              labelFormatter={(label) => safeFormatDate(label, formatDateMonthYear)}
              formatter={(value) => (typeof value === "number" ? `${value.toFixed(1)}%` : value)}
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
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ChartContainer
        config={{ "San Francisco - Rental": { color: SF_COLOR_RENTAL } }}
        className="h-72"
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
              domain={[0, 100]}
              label={{
                value: "Rental Rate (%)",
                angle: -90,
                position: "insideLeft",
                offset: -40,
              }}
              width={80}
            />
            <Tooltip
              content={<ChartTooltipContent />}
              labelFormatter={(label) => safeFormatDate(label, formatDateMonthYear)}
              formatter={(value) => (typeof value === "number" ? `${value.toFixed(1)}%` : value)}
            />
            <Legend verticalAlign="bottom" height={36} />
            <Line
              type="monotone"
              dataKey="rental_rate"
              name="Rental Rate"
              stroke={SF_COLOR_RENTAL}
              dot={false}
              isAnimationActive={false}
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default OwnershipRentalRatesChart;
