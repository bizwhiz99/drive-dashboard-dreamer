
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { filterValidData } from "@/utils/dataProcessing";
import { formatDateMonthYear, safeFormatDate } from "@/utils/formatters";

interface RentalRateChartProps {
  data: any[];
}

const RentalRateChart: React.FC<RentalRateChartProps> = ({ data }) => {
  const chartData = React.useMemo(() => {
    const validData = filterValidData(data, ['rental_rate']);
    return validData;
  }, [data]);

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>;
  }

  return (
    <ChartContainer 
      config={{
        "Austin": { color: "#8B5CF6" },
        "San Francisco": { color: "#F97316" },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
            label={{ value: 'Rental Rate (%)', angle: -90, position: 'insideLeft', offset: -40 }}
            width={80}
          />
          <Tooltip 
            content={<ChartTooltipContent />}
            labelFormatter={(label) => safeFormatDate(label, formatDateMonthYear)}
          />
          <Legend verticalAlign="bottom" height={36} />
          <Line
            type="monotone"
            dataKey="rental_rate"
            data={chartData.filter(item => item.city === 'Austin')}
            name="Austin"
            stroke="#8B5CF6"
            dot={false}
            isAnimationActive={false}
            connectNulls={true}
          />
          <Line
            type="monotone"
            dataKey="rental_rate"
            data={chartData.filter(item => item.city === 'San Francisco')}
            name="San Francisco"
            stroke="#F97316"
            dot={false}
            isAnimationActive={false}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default RentalRateChart;
