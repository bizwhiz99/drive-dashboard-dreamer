
import React, { useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

interface CsvDataProviderProps {
  url: string;
  onDataLoaded: (data: any[]) => void;
  onError: (error: Error) => void;
  isUrlLoading: boolean;
  setIsUrlLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CsvDataProvider: React.FC<CsvDataProviderProps> = ({ 
  url, 
  onDataLoaded, 
  onError,
  isUrlLoading,
  setIsUrlLoading
}) => {
  useEffect(() => {
    if (isUrlLoading) {
      fetchCsvFromUrl(url);
    }
  }, [isUrlLoading, url]);
  
  useEffect(() => {
    // Load data on initial mount
    fetchCsvFromUrl(url);
  }, []);

  const fetchCsvFromUrl = async (csvUrl: string) => {
    try {
      // Convert Google Sheets URL to export format if needed
      const exportUrl = convertGoogleSheetUrlToExport(csvUrl);
      
      const response = await fetch(exportUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
      }
      
      const text = await response.text();
      const parsedData = parseCsvText(text);
      onDataLoaded(parsedData);
    } catch (error) {
      console.error('Error fetching or parsing CSV:', error);
      onError(error instanceof Error ? error : new Error('Unknown error occurred'));
    } finally {
      setIsUrlLoading(false);
    }
  };

  const convertGoogleSheetUrlToExport = (url: string): string => {
    // Check if it's a Google Sheets URL
    if (url.includes('docs.google.com/spreadsheets')) {
      // Convert to CSV export URL
      const idMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (idMatch && idMatch[1]) {
        const sheetId = idMatch[1];
        return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
      }
    }
    return url;
  };

  const parseCsvText = (csvText: string): any[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = parseCsvLine(lines[i]);
      
      if (values.length !== headers.length) {
        console.warn(`Line ${i} has ${values.length} values, but there are ${headers.length} headers.`);
        continue;
      }
      
      const entry: Record<string, any> = {};
      
      for (let j = 0; j < headers.length; j++) {
        entry[headers[j]] = values[j];
      }
      
      result.push(entry);
    }
    
    return result;
  };

  const parseCsvLine = (line: string): string[] => {
    const result = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    result.push(currentValue.trim());
    
    return result;
  };

  return null; // This is just a data provider, doesn't render anything
};

export default CsvDataProvider;
