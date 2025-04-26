
import React from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { filterValidData } from "@/utils/dataProcessing";
import { formatDateMonthYear, safeFormatDate } from "@/utils/formatters";

interface MedianRentChartProps {
  data: any[];
}

const MedianRentChart: React.FC<MedianRentChartProps> = ({ data }) => {
  // Filter data to ensure all records have valid date and median_rent values
  const validData = React.useMemo(() => {
    return filterValidData(data, ['median_rent']);
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

  // Define custom tick formatter to only show December of each year
  const customTickFormatter = (tickItem: any) => {
    if (tickItem instanceof Date) {
      // Only show December months (11 because months are 0-indexed)
      if (tickItem.getMonth() === 11) {
        return `Dec ${tickItem.getFullYear()}`;
      }
      return '';
    }
    return '';
  };

  // Define custom tick values (December of each year)
  const getDecemberTicks = React.useCallback(() => {
    if (!validData || validData.length === 0) return [];
    
    // Get all unique years
    const years = Array.from(
      new Set(
        validData.map(item => 
          item.date instanceof Date ? item.date.getFullYear() : null
        ).filter(Boolean)
      )
    );
    
    // For each year, find a data point from December or closest to it
    return years.map(year => {
      // Find all dates in this year
      const datesInYear = validData
        .filter(item => item.date instanceof Date && item.date.getFullYear() === year)
        .map(item => item.date);
        
      // Try to find December
      const decDate = datesInYear.find(date => date.getMonth() === 11);
      if (decDate) return decDate;
      
      // If no December, return the last date in that year
      if (datesInYear.length > 0) {
        return datesInYear.sort((a, b) => b.getTime() - a.getTime())[0];
      }
      
      return null;
    }).filter(Boolean);
  }, [validData]);

  if (validData.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>;
  }

  const decemberTicks = getDecemberTicks();

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
            tickFormatter={customTickFormatter}
            angle={-45} 
            textAnchor="end" 
            height={60}
            ticks={decemberTicks}
            type="category"
            allowDuplicatedCategory={false}
          />
          <YAxis 
            width={80}
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
                dataKey="median_rent"
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

export default MedianRentChart;
