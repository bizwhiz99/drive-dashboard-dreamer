
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
    
    setFilteredData(filtered);
  }, [csvData, selectedCity]);

  useEffect(() => {
    if (csvData.length) {
      applyFilters();
    }
  }, [csvData, selectedCity, applyFilters]);

  const handleDataLoaded = (data: any[]) => {
    const processedData = processRawData(data);
    
    setCsvData(processedData);
    setFilteredData(processedData);
    setIsLoading(false);
    toast("Data loaded successfully", {
      description: `Loaded ${processedData.length} records from the CSV file.`,
      duration: 3000,
    });
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
