
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
 * Two charts for San Francisco:
 * - Ownership Rate Chart (orange line)
 * - Rental Rate Chart (blue line)
 * Y axis: 0-100 (percentage). 
 * X axis: Time (date).
 */
const OwnershipRentalRatesChart: React.FC<OwnershipRentalRatesChartProps> = ({ data }) => {
  // Only SF valid data
  const chartData = React.useMemo(() => {
    const filtered = filterValidData(
      data.filter(item => item.city === "San Francisco"),
      ["ownership_rate", "rental_rate"]
    );
    return filtered
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
  
  // Find the max value for ownership_rate and rental_rate to set Y axis
  const maxOwnershipRate = Math.max(...chartData.map(d => d.ownership_rate || 0));
  const maxRentalRate = Math.max(...chartData.map(d => d.rental_rate || 0));
  
  // Calculate Y domain with proper padding
  const yDomainOwnership = [0, Math.ceil(maxOwnershipRate / 10) * 10 || 100];
  const yDomainRental = [0, Math.ceil(maxRentalRate / 10) * 10 || 100];

  return (
    <div className="grid grid-cols-1 gap-8">
      {/* Ownership Rate Chart */}
      <ChartContainer
        config={{
          "Ownership Rate": { color: SF_COLOR_OWNERSHIP },
        }}
        className="h-80"
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
              domain={yDomainOwnership}
              label={{
                value: "Ownership Rate (%)",
                angle: -90,
                position: "insideLeft",
                offset: -40,
              }}
              width={80}
              tickFormatter={v => `${v}%`}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip
              content={<ChartTooltipContent />}
              labelFormatter={(label) => safeFormatDate(label, formatDateMonthYear)}
              formatter={(value, name, props) =>
                typeof value === "number"
                  ? `${value.toFixed(1)}%`
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
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Rental Rate Chart */}
      <ChartContainer
        config={{
          "Rental Rate": { color: SF_COLOR_RENTAL },
        }}
        className="h-80"
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
              domain={yDomainRental}
              label={{
                value: "Rental Rate (%)",
                angle: -90,
                position: "insideLeft",
                offset: -40,
              }}
              width={80}
              tickFormatter={v => `${v}%`}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip
              content={<ChartTooltipContent />}
              labelFormatter={(label) => safeFormatDate(label, formatDateMonthYear)}
              formatter={(value, name, props) =>
                typeof value === "number"
                  ? `${value.toFixed(1)}%`
                  : value
              }
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
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default OwnershipRentalRatesChart;
