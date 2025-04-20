import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CsvDataProvider from "@/components/CsvDataProvider";
import LoadingIndicator from "@/components/LoadingIndicator";
import DashboardFilters from "@/components/dashboard/DashboardFilters";
import TimeSeriesTab from "@/components/dashboard/TimeSeriesTab";
import CorrelationsTab from "@/components/dashboard/CorrelationsTab";
import ScatterPlotsTab from "@/components/dashboard/ScatterPlotsTab";
import { processRawData } from "@/utils/dataProcessing";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [csvUrl, setCsvUrl] = useState<string>('https://docs.google.com/spreadsheets/d/1ewPYAHgZJc6jV_i8D1634_klao-D78UqK59AlNVylKk/edit?usp=sharing');
  const [isUrlLoading, setIsUrlLoading] = useState(false);

  const availableCities = React.useMemo(() => {
    if (!csvData.length) return [];
    return Array.from(new Set(csvData.map(item => item.city)));
  }, [csvData]);

  const applyFilters = React.useCallback(() => {
    let filtered = [...csvData];
    
    if (selectedCity !== 'all') {
      filtered = filtered.filter(item => item.city === selectedCity);
    }
    
    // Ensure dates are properly sorted in filtered data
    filtered.sort((a, b) => {
      if (a.date instanceof Date && b.date instanceof Date) {
        return a.date.getTime() - b.date.getTime();
      }
      return 0;
    });
    
    setFilteredData(filtered);
  }, [csvData, selectedCity]);

  useEffect(() => {
    if (csvData.length) {
      applyFilters();
    }
  }, [csvData, selectedCity, applyFilters]);

  const handleDataLoaded = (data: any[]) => {
    try {
      // Process the data and ensure all dates are properly converted to Date objects
      const processedData = processRawData(data);
      
      // Verify dates are valid
      const invalidDateCount = processedData.filter(
        item => !(item.date instanceof Date) || isNaN(item.date.getTime())
      ).length;
      
      if (invalidDateCount > 0) {
        console.warn(`Found ${invalidDateCount} records with invalid dates`);
      }
      
      // Sort data by date chronologically before setting state
      const sortedData = [...processedData].sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      );
      
      setCsvData(sortedData);
      setFilteredData(sortedData);
      setIsLoading(false);
      toast("Data loaded successfully", {
        description: `Loaded ${processedData.length} records from the CSV file.`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error processing data:", error);
      toast.error("Error processing data", {
        description: "Failed to process the loaded data. Check console for details.",
        duration: 5000,
      });
      setIsLoading(false);
    }
  };

  const handleError = (error: Error) => {
    setIsLoading(false);
    toast.error("Error loading data", {
      description: error.message,
      duration: 5000,
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Airbnb Impact on Housing Markets Dashboard</h1>
        <p className="text-muted-foreground">
          Analyzing how Airbnb activity correlates with housing indicators in Austin and San Francisco (2010-2023)
        </p>
      </div>

      <CsvDataProvider 
        url={csvUrl} 
        onDataLoaded={handleDataLoaded} 
        onError={handleError}
        isUrlLoading={isUrlLoading}
        setIsUrlLoading={setIsUrlLoading}
      />

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <DashboardFilters
            selectedCity={selectedCity}
            availableCities={availableCities}
            onCityChange={setSelectedCity}
          />

          <Tabs defaultValue="time-series" className="space-y-4">
            <TabsList className="grid grid-cols-3 w-full sm:w-[500px]">
              <TabsTrigger value="time-series">Time Series</TabsTrigger>
              <TabsTrigger value="scatter-plots">Scatter Plots</TabsTrigger>
              <TabsTrigger value="correlations">Correlations</TabsTrigger>
            </TabsList>

            <TabsContent value="time-series">
              <TimeSeriesTab data={filteredData} />
            </TabsContent>

            <TabsContent value="scatter-plots">
              <ScatterPlotsTab data={filteredData} />
            </TabsContent>

            <TabsContent value="correlations">
              <CorrelationsTab data={filteredData} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Dashboard;
