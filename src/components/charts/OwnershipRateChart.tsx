
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface OwnershipRateChartProps {
  data: any[];
}

const OwnershipRateChart: React.FC<OwnershipRateChartProps> = ({ data }) => {
  // Get the most recent data for each city
  const mostRecentData = React.useMemo(() => {
    const cityMap = new Map<string, any>();
    
    data.forEach(item => {
      const city = item.city;
      const existingItem = cityMap.get(city);
      
      // If we don't have an entry for this city yet, or this entry is more recent
      if (!existingItem || 
          (item.year > existingItem.year) || 
          (item.year === existingItem.year && item.quarter > existingItem.quarter)) {
        cityMap.set(city, item);
      }
    });
    
    // Transform for chart
    return Array.from(cityMap.values()).map(item => ({
      city: item.city,
      ownership_rate: parseFloat(item.ownership_rate) || 0,
      rental_rate: parseFloat(item.rental_rate) || 0,
      year: item.year,
      quarter: item.quarter
    }));
  }, [data]);
  
  if (data.length === 0) {
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
          data={mostRecentData}
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
