
import React from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { filterValidData } from "@/utils/dataProcessing";
import { formatDateMonthYear, safeFormatDate, formatNumberWithK } from "@/utils/formatters";

interface MedianIncomeChartProps {
  data: any[];
}

const MedianIncomeChart: React.FC<MedianIncomeChartProps> = ({ data }) => {
  // Filter data to ensure all records have valid date and median_income values
  const validData = React.useMemo(() => {
    return filterValidData(data, ['median_income']);
    // The filterValidData function now handles date validation and sorting
  }, [data]);

  // Get unique cities for the chart
  const cities = React.useMemo(() => {
    return Array.from(new Set(validData.map(item => item.city)));
  }, [validData]);

  const cityColors: Record<string, string> = {
    "San Francisco": "#8B5CF6", // Vivid purple
    "Austin": "#F97316", // Bright orange
  };

  if (validData.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>;
  }

  return (
    <ChartContainer 
      config={{
        "San Francisco": { color: cityColors["San Francisco"] },
        "Austin": { color: cityColors["Austin"] }
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => safeFormatDate(value, formatDateMonthYear)}
            angle={-45} 
            textAnchor="end" 
            height={60}
            interval={4}  // Updated to 4 for consistent tick interval
            minTickGap={30}
            type="category"
            allowDuplicatedCategory={false}
          />
          <YAxis 
            width={80}
            tickFormatter={formatNumberWithK}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            content={<ChartTooltipContent />}
            labelFormatter={(label) => safeFormatDate(label, formatDateMonthYear)}
          />
          <Legend verticalAlign="top" />
          
          {cities.map((city) => {
            // Get city data and ensure it's sorted
            const cityData = validData
              .filter(item => item.city === city);
              
            return (
              <Line
                key={city}
                type="monotone"
                dataKey="median_income"
                data={cityData}
                name={city}
                stroke={cityColors[city] || "#8884d8"}
                activeDot={{ r: 8 }}
                dot={{ r: 2 }}
                strokeWidth={2}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default MedianIncomeChart;
