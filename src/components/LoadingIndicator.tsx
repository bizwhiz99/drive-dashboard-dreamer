
import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 w-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      <p className="mt-4 text-lg font-medium text-muted-foreground">Loading data...</p>
      <p className="text-sm text-muted-foreground mt-2">Please wait while we fetch and process the CSV data</p>
    </div>
  );
};

export default LoadingIndicator;
