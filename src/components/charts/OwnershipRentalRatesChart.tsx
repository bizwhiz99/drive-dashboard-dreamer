import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { filterValidData } from "@/utils/dataProcessing";
import { formatDateMonthYear, safeFormatDate } from "@/utils/formatters";

// Assign colors and dash styles for each city and rate type
const CITY_COLORS = {
  Austin: "#8B5CF6",
  "San Francisco": "#F97316"
};
const RATE_TYPES = [
  { key: "ownership_rate", label: "Ownership Rate", dash: "solid" },
  { key: "rental_rate", label: "Rental Rate", dash: "5 5" }
];

interface OwnershipRentalRatesChartProps {
  data: any[];
}

const OwnershipRentalRatesChart: React.FC<OwnershipRentalRatesChartProps> = ({ data }) => {
  // Only keep data rows with all needed fields + valid date
  const chartData = React.useMemo(
    () =>
      filterValidData(
        data,
        ["ownership_rate", "rental_rate"]
      ),
    [data]
  );

  const legendPayload = [
    ...Object.keys(CITY_COLORS).flatMap((city) =>
      RATE_TYPES.map((type) => ({
        value: `${city} - ${type.label}`,
        color: CITY_COLORS[city as keyof typeof CITY_COLORS],
        type: "line",
        strokeDasharray: type.dash
      }))
    )
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
        "Austin - Ownership": { color: CITY_COLORS["Austin"] },
        "Austin - Rental": { color: CITY_COLORS["Austin"] },
        "San Francisco - Ownership": { color: CITY_COLORS["San Francisco"] },
        "San Francisco - Rental": { color: CITY_COLORS["San Francisco"] },
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
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ paddingTop: 18 }}
            payload={legendPayload}
          />
          {/* Austin - Ownership Rate */}
          <Line
            type="monotone"
            dataKey="ownership_rate"
            data={chartData.filter((item) => item.city === "Austin")}
            name="Austin - Ownership Rate"
            stroke={CITY_COLORS["Austin"]}
            strokeDasharray="solid"
            dot={false}
            isAnimationActive={false}
            connectNulls={true}
          />
          {/* Austin - Rental Rate */}
          <Line
            type="monotone"
            dataKey="rental_rate"
            data={chartData.filter((item) => item.city === "Austin")}
            name="Austin - Rental Rate"
            stroke={CITY_COLORS["Austin"]}
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive={false}
            connectNulls={true}
          />
          {/* SF - Ownership Rate */}
          <Line
            type="monotone"
            dataKey="ownership_rate"
            data={chartData.filter((item) => item.city === "San Francisco")}
            name="San Francisco - Ownership Rate"
            stroke={CITY_COLORS["San Francisco"]}
            strokeDasharray="solid"
            dot={false}
            isAnimationActive={false}
            connectNulls={true}
          />
          {/* SF - Rental Rate */}
          <Line
            type="monotone"
            dataKey="rental_rate"
            data={chartData.filter((item) => item.city === "San Francisco")}
            name="San Francisco - Rental Rate"
            stroke={CITY_COLORS["San Francisco"]}
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
