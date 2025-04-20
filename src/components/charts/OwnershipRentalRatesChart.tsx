
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

const SF_COLOR = "#F97316";

interface OwnershipRentalRatesChartProps {
  data: any[];
}

/**
 * Shows only San Francisco, with two time series lines:
 * - Ownership Rate (%)
 * - Rental Rate (%)
 * Ownership: solid line
 * Rental: dashed line
 * X axis: date (time series)
 * Y axis: percent (0–100)
 */
const OwnershipRentalRatesChart: React.FC<OwnershipRentalRatesChartProps> = ({ data }) => {
  // 1. Filter for SF only, valid ownership & rental rate, valid date
  // 2. Multiply rates by 100 -> percentage
  // 3. Sort by date asc
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

  // Legend: Only for these two lines (SF)
  const legendPayload = [
    {
      value: "Ownership Rate",
      color: SF_COLOR,
      type: "line" as const,
      strokeDasharray: "solid",
    },
    {
      value: "Rental Rate",
      color: SF_COLOR,
      type: "line" as const,
      strokeDasharray: "5 5",
    }
  ];

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ChartContainer
      config={{
        "San Francisco - Ownership": { color: SF_COLOR },
        "San Francisco - Rental": { color: SF_COLOR },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 60,
            bottom: 50,
          }}
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
            domain={["auto", "auto"]}
            scale="time"
          />
          <YAxis
            domain={[0, 100]}
            label={{
              value: "Rate (%)",
              angle: -90,
              position: "insideLeft",
              offset: -40,
            }}
            width={80}
          />
          <Tooltip
            content={<ChartTooltipContent />}
            labelFormatter={(label) => safeFormatDate(label, formatDateMonthYear)}
            formatter={(value) =>
              typeof value === "number" ? `${value.toFixed(1)}%` : value
            }
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ paddingTop: 18 }}
            payload={legendPayload}
          />
          {/* Ownership Rate (SF) */}
          <Line
            type="monotone"
            dataKey="ownership_rate"
            name="Ownership Rate"
            stroke={SF_COLOR}
            strokeDasharray="solid"
            dot={false}
            isAnimationActive={false}
            connectNulls={true}
          />
          {/* Rental Rate (SF) */}
          <Line
            type="monotone"
            dataKey="rental_rate"
            name="Rental Rate"
            stroke={SF_COLOR}
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive={false}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default OwnershipRentalRatesChart;
