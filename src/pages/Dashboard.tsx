
import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CsvDataProvider from "@/components/CsvDataProvider";
import LoadingIndicator from "@/components/LoadingIndicator";
import DashboardFilters from "@/components/dashboard/DashboardFilters";
import KeyMetricsTab from "@/components/dashboard/KeyMetricsTab";
import ComparisonsTab from "@/components/dashboard/ComparisonsTab";
import RelationshipsTab from "@/components/dashboard/RelationshipsTab";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('all');
  const [csvUrl, setCsvUrl] = useState<string>('https://docs.google.com/spreadsheets/d/1ewPYAHgZJc6jV_i8D1634_klao-D78UqK59AlNVylKk/edit?usp=sharing');
  const [isUrlLoading, setIsUrlLoading] = useState(false);

  const availableYears = React.useMemo(() => {
    if (!csvData.length) return [];
    const years = Array.from(new Set(csvData.map(item => item.year)));
    return years.sort((a, b) => a - b);
  }, [csvData]);

  const availableCities = React.useMemo(() => {
    if (!csvData.length) return [];
    return Array.from(new Set(csvData.map(item => item.city)));
  }, [csvData]);

  const applyFilters = React.useCallback(() => {
    let filtered = [...csvData];
    
    if (selectedCity !== 'all') {
      filtered = filtered.filter(item => item.city === selectedCity);
    }
    
    if (selectedYear !== 'all') {
      filtered = filtered.filter(item => item.year === parseInt(selectedYear));
    }
    
    if (selectedQuarter !== 'all') {
      filtered = filtered.filter(item => item.quarter === parseInt(selectedQuarter));
    }
    
    setFilteredData(filtered);
  }, [csvData, selectedCity, selectedYear, selectedQuarter]);

  useEffect(() => {
    if (csvData.length) {
      applyFilters();
    }
  }, [csvData, selectedCity, selectedYear, selectedQuarter, applyFilters]);

  const handleDataLoaded = (data: any[]) => {
    const processedData = data.map(item => ({
      ...item,
      date: new Date(item.date),
      year: parseInt(item.year),
      quarter: parseInt(item.quarter),
      airbnb_activity: parseFloat(item.airbnb_activity),
      airbnb_ratio: parseFloat(item.airbnb_ratio),
      hpi: parseFloat(item.hpi),
      median_rent: parseFloat(item.median_rent),
      owned_units: parseFloat(item.owned_units),
      rental_units: parseFloat(item.rental_units),
      ownership_rate: parseFloat(item.ownership_rate),
      rental_rate: parseFloat(item.rental_rate),
      unemployment: parseFloat(item.unemployment),
      median_income: parseFloat(item.median_income),
    }));
    
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
            selectedYear={selectedYear}
            selectedQuarter={selectedQuarter}
            availableCities={availableCities}
            availableYears={availableYears}
            onCityChange={setSelectedCity}
            onYearChange={setSelectedYear}
            onQuarterChange={setSelectedQuarter}
          />

          <Tabs defaultValue="key-metrics" className="space-y-4">
            <TabsList>
              <TabsTrigger value="key-metrics">Key Metrics</TabsTrigger>
              <TabsTrigger value="comparisons">City Comparisons</TabsTrigger>
              <TabsTrigger value="relationships">Relationships</TabsTrigger>
            </TabsList>

            <TabsContent value="key-metrics">
              <KeyMetricsTab data={filteredData} />
            </TabsContent>

            <TabsContent value="comparisons">
              <ComparisonsTab data={filteredData} allData={csvData} />
            </TabsContent>

            <TabsContent value="relationships">
              <RelationshipsTab data={filteredData} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Dashboard;
