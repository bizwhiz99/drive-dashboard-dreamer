
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ScatterPlot from "@/components/charts/ScatterPlot";

interface RelationshipsTabProps {
  data: any[];
}

const RelationshipsTab: React.FC<RelationshipsTabProps> = ({ data }) => {
  // Ensure we have valid data before passing to ScatterPlot
  const validData = React.useMemo(() => {
    return data.filter(item => 
      typeof item.airbnb_ratio === 'number' && 
      !isNaN(item.airbnb_ratio) && 
      typeof item.hpi === 'number' && 
      !isNaN(item.hpi)
    );
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Airbnb Ratio vs Housing Price Index</CardTitle>
        <CardDescription>Relationship between Airbnb's share of housing and price indices</CardDescription>
      </CardHeader>
      <CardContent className="h-96">
        <ScatterPlot data={validData} />
      </CardContent>
    </Card>
  );
};

export default RelationshipsTab;
