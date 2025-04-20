import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { filterValidData } from "@/utils/dataProcessing";
import { formatDateMonthYear, safeFormatDate, formatNumberWithK } from "@/utils/formatters";

interface HousingUnitsChartProps {
  data: any[];
}

const HousingUnitsChart: React.FC<HousingUnitsChartProps> = ({ data }) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // Filter data to ensure all records have valid date, owned_units, and rental_units
  const validData = React.useMemo(() => {
    let filtered = filterValidData(data, ['owned_units', 'rental_units']);
    
    if (selectedCity !== 'all') {
      filtered = filtered.filter(item => item.city === selectedCity);
    }
    
    return filtered;
  }, [data, selectedCity]);

  // Get unique cities for the chart
  const cities = React.useMemo(() => {
    return Array.from(new Set(data.map(item => item.city)));
  }, [data]);

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <Legend 
          content={
            <ChartLegendContent 
              verticalAlign="top" 
              className="justify-start" 
            />
          }
        />
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1">
        <ChartContainer 
          config={{
            "owned_units": { color: "#8B5CF6", label: "Owned Units" },
            "rental_units": { color: "#F97316", label: "Rental Units" },
            "owned_units_Austin": { color: "#8B5CF6", label: "Owned Units (Austin)" },
            "rental_units_Austin": { color: "#F97316", label: "Rental Units (Austin)" },
            "owned_units_San Francisco": { color: "#0EA5E9", label: "Owned Units (San Francisco)" },
            "rental_units_San Francisco": { color: "#10B981", label: "Rental Units (San Francisco)" },
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              margin={{
                top: 10,
                right: 30,
                left: 60,
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
                interval="preserveStartEnd"
                minTickGap={30}
                type="category"
                allowDuplicatedCategory={false}
              />
              <YAxis 
                tickFormatter={formatNumberWithK}
                domain={[0, 'auto']}
                label={{ value: 'Housing Units', angle: -90, position: 'insideLeft', offset: -30 }}
                width={80}
                padding={{ top: 40, bottom: 20 }}
              />
              <Tooltip 
                content={<ChartTooltipContent />}
                labelFormatter={(label) => safeFormatDate(label, formatDateMonthYear)}
              />
              
              {selectedCity === 'all' ? (
                // Show data for all cities
                <>
                  {cities.map(city => (
                    <React.Fragment key={city}>
                      <Area
                        type="monotone"
                        dataKey="owned_units"
                        name={`Owned Units (${city})`}
                        data={validData.filter(item => item.city === city)}
                        stroke={city === 'Austin' ? "#8B5CF6" : "#0EA5E9"}
                        fill={city === 'Austin' ? "#8B5CF6" : "#0EA5E9"}
                        fillOpacity={0.5}
                      />
                      <Area
                        type="monotone"
                        dataKey="rental_units"
                        name={`Rental Units (${city})`}
                        data={validData.filter(item => item.city === city)}
                        stroke={city === 'Austin' ? "#F97316" : "#10B981"}
                        fill={city === 'Austin' ? "#F97316" : "#10B981"}
                        fillOpacity={0.5}
                      />
                    </React.Fragment>
                  ))}
                </>
              ) : (
                // Show data only for the selected city
                <>
                  <Area
                    type="monotone"
                    dataKey="owned_units"
                    name="Owned Units"
                    data={validData}
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="rental_units"
                    name="Rental Units"
                    data={validData}
                    stroke="#F97316"
                    fill="#F97316"
                    fillOpacity={0.5}
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default HousingUnitsChart;
