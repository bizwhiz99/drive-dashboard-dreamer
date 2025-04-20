
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { getMostRecentDataByCity, filterValidData } from "@/utils/dataProcessing";

interface OwnershipRateChartProps {
  data: any[];
}

const OwnershipRateChart: React.FC<OwnershipRateChartProps> = ({ data }) => {
  // Get the most recent data for each city
  const chartData = React.useMemo(() => {
    const validData = filterValidData(data, ['ownership_rate', 'rental_rate']);
    const mostRecent = getMostRecentDataByCity(validData);
    
    // Format for chart - convert rates to percentages
    return mostRecent.map(item => ({
      city: item.city,
      ownership_rate: item.ownership_rate * 100, // Convert to percentage
      rental_rate: item.rental_rate * 100, // Convert to percentage
      year: item.year,
      quarter: item.quarter,
      date: item.date
    }));
  }, [data]);
  
  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>;
  }

  return (
    <ChartContainer 
      config={{
        "ownership_rate": { color: "#8B5CF6" }, // Purple for ownership rate
        "rental_rate": { color: "#F97316" }, // Orange for rental rate
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="city" 
            label={{ value: 'City', position: 'insideBottom', offset: -5 }} 
          />
          <YAxis 
            label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }}
            domain={[0, 100]}
            width={80}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="ownership_rate" name="Ownership Rate" fill="#8B5CF6" />
          <Bar dataKey="rental_rate" name="Rental Rate" fill="#F97316" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default OwnershipRateChart;
