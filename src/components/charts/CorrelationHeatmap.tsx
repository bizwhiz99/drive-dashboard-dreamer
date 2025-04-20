
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateCorrelations, filterValidData } from "@/utils/dataProcessing";

interface CorrelationHeatmapProps {
  data: any[];
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ data }) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // Fields to include in correlation heatmap
  const correlationFields = [
    'hpi', 
    'median_rent', 
    'rental_rate', 
    'airbnb_activity', 
    'airbnb_ratio', 
    'median_income', 
    'unemployment'
  ];

  // Better labels for the fields
  const fieldLabels: Record<string, string> = {
    hpi: 'Housing Price Index',
    median_rent: 'Median Rent',
    rental_rate: 'Rental Rate',
    airbnb_activity: 'Airbnb Activity',
    airbnb_ratio: 'Airbnb Ratio',
    median_income: 'Median Income',
    unemployment: 'Unemployment'
  };

  // Filter data by city if needed
  const filteredData = React.useMemo(() => {
    if (selectedCity === 'all') {
      return filterValidData(data, correlationFields);
    }
    return filterValidData(data.filter(item => item.city === selectedCity), correlationFields);
  }, [data, selectedCity]);

  // Calculate correlations
  const correlations = React.useMemo(() => {
    if (filteredData.length === 0) return {};
    return calculateCorrelations(filteredData, correlationFields);
  }, [filteredData]);

  // Get unique cities for the selector
  const cities = React.useMemo(() => {
    return Array.from(new Set(data.map(item => item.city)));
  }, [data]);

  // Color function for correlation cells
  const getColorForCorrelation = (value: number): string => {
    const absValue = Math.abs(value);
    
    if (value > 0) {
      // Positive correlation - blue spectrum
      if (absValue >= 0.7) return 'bg-blue-700 text-white';
      if (absValue >= 0.5) return 'bg-blue-500 text-white';
      if (absValue >= 0.3) return 'bg-blue-300';
      if (absValue >= 0.1) return 'bg-blue-100';
      return 'bg-gray-100';
    } else {
      // Negative correlation - red spectrum
      if (absValue >= 0.7) return 'bg-red-700 text-white';
      if (absValue >= 0.5) return 'bg-red-500 text-white';
      if (absValue >= 0.3) return 'bg-red-300';
      if (absValue >= 0.1) return 'bg-red-100';
      return 'bg-gray-100';
    }
  };

  if (Object.keys(correlations).length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No data available for correlation analysis</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 w-48">
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger>
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
      
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-[200px_repeat(7,1fr)]">
            {/* Empty top-left cell */}
            <div className="border p-2 font-bold bg-background"></div>
            
            {/* Header row */}
            {correlationFields.map(field => (
              <div key={field} className="border p-2 font-bold bg-muted text-center text-xs">
                {fieldLabels[field]}
              </div>
            ))}
            
            {/* Data rows */}
            {correlationFields.map(rowField => (
              <React.Fragment key={rowField}>
                {/* Row label */}
                <div className="border p-2 font-bold bg-muted">
                  {fieldLabels[rowField]}
                </div>
                
                {/* Correlation cells */}
                {correlationFields.map(colField => {
                  const correlation = correlations[rowField]?.[colField] || 0;
                  return (
                    <div 
                      key={`${rowField}-${colField}`} 
                      className={`border p-2 text-center ${getColorForCorrelation(correlation)}`}
                    >
                      {correlation.toFixed(2)}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-700"></div>
          <span className="text-sm">Strong positive correlation (0.7 to 1.0)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-700"></div>
          <span className="text-sm">Strong negative correlation (-0.7 to -1.0)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-300"></div>
          <span className="text-sm">Moderate positive correlation (0.3 to 0.7)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-300"></div>
          <span className="text-sm">Moderate negative correlation (-0.3 to -0.7)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-100"></div>
          <span className="text-sm">Weak or no correlation (-0.3 to 0.3)</span>
        </div>
      </div>
    </div>
  );
};

export default CorrelationHeatmap;
