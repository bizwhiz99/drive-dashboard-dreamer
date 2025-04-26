/**
 * Utility functions for processing data for charts
 */

/**
 * Process raw CSV data to ensure all numeric values are properly parsed
 */
export const processRawData = (data: any[]): any[] => {
  return data.map(item => {
    // Calculate airbnb_ratio if not present or zero
    let airbnb_ratio = parseFloat(item.airbnb_ratio);
    
    // If airbnb_ratio is missing or zero, and we have airbnb_activity and total_units,
    // calculate it as airbnb_activity / total_units
    if ((isNaN(airbnb_ratio) || airbnb_ratio === 0) && 
        !isNaN(parseFloat(item.airbnb_activity)) && 
        !isNaN(parseFloat(item.total_units || item["total units"])) &&
        parseFloat(item.total_units || item["total units"]) > 0) {
      
      airbnb_ratio = parseFloat(item.airbnb_activity) / parseFloat(item.total_units || item["total units"]);
    }

    return {
      ...item,
      date: new Date(item.date),
      year: parseInt(item.year),
      quarter: parseInt(item.quarter),
      population: parseFloat(item.population),
      median_income: parseFloat(item.median_income),
      total_units: parseFloat(item.total_units || item["total units"]),
      occupied_units: parseFloat(item.occupied_units || item["occupied units"]),
      owned_units: parseFloat(item.owned_units || item["owned units"]),
      rental_units: parseFloat(item.rental_units || item["rental units"]),
      ownership_rate: parseFloat(item.ownership_rate),
      rental_rate: parseFloat(item.rental_rate),
      median_rent: parseFloat(item.median_rent),
      unemployment: parseFloat(item.unemployment),
      airbnb_activity: parseFloat(item.airbnb_activity),
      airbnb_ratio: airbnb_ratio, // Use the calculated value or parsed value
      hpi: parseFloat(item.hpi),
    };
  });
};

/**
 * Filter data to only include valid numerical values for the specified fields
 */
export const filterValidData = (data: any[], fields: string[]): any[] => {
  console.log(`Filtering data for fields: ${fields.join(', ')}`);
  
  // First ensure all date objects are valid
  const dataWithValidDates = data.filter(item => 
    item.date instanceof Date && !isNaN(item.date.getTime())
  );
  
  console.log(`Data with valid dates: ${dataWithValidDates.length}`);
  
  // Then filter for valid numeric fields
  const filtered = dataWithValidDates.filter(item => 
    fields.every(field => 
      typeof item[field] === 'number' && !isNaN(item[field]) && item[field] !== 0
    )
  );
  
  console.log(`Final filtered data count: ${filtered.length}`);
  
  return filtered.sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort by date chronologically
};

/**
 * Get the most recent data for each city
 */
export const getMostRecentDataByCity = (data: any[]): any[] => {
  // First ensure all items have valid dates
  const dataWithValidDates = data.filter(item => 
    item.date instanceof Date && !isNaN(item.date.getTime())
  );
  
  const cityMap = new Map<string, any>();
  
  dataWithValidDates.forEach(item => {
    const city = item.city;
    const existingItem = cityMap.get(city);
    
    // If we don't have an entry for this city yet, or this entry is more recent
    if (!existingItem || (item.date > existingItem.date)) {
      cityMap.set(city, item);
    }
  });
  
  return Array.from(cityMap.values());
};

/**
 * Calculate correlations between different metrics
 */
export const calculateCorrelations = (data: any[], fields: string[]): Record<string, Record<string, number>> => {
  const correlations: Record<string, Record<string, number>> = {};
  
  // Initialize correlations object
  fields.forEach(field1 => {
    correlations[field1] = {};
    fields.forEach(field2 => {
      correlations[field1][field2] = field1 === field2 ? 1.0 : 0.0;
    });
  });
  
  // Calculate correlations
  fields.forEach(field1 => {
    fields.forEach(field2 => {
      if (field1 !== field2) {
        const validPairs = data.filter(item => 
          typeof item[field1] === 'number' && !isNaN(item[field1]) &&
          typeof item[field2] === 'number' && !isNaN(item[field2])
        );
        
        if (validPairs.length > 0) {
          // Pearson correlation
          const n = validPairs.length;
          const values1 = validPairs.map(item => item[field1]);
          const values2 = validPairs.map(item => item[field2]);
          
          const sum1 = values1.reduce((a, b) => a + b, 0);
          const sum2 = values2.reduce((a, b) => a + b, 0);
          
          const sum1Sq = values1.reduce((a, b) => a + b * b, 0);
          const sum2Sq = values2.reduce((a, b) => a + b * b, 0);
          
          const pSum = values1.reduce((a, b, i) => a + b * values2[i], 0);
          
          const num = pSum - (sum1 * sum2 / n);
          const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
          
          const correlation = den === 0 ? 0 : num / den;
          correlations[field1][field2] = Math.round(correlation * 100) / 100;
        }
      }
    });
  });
  
  return correlations;
};
