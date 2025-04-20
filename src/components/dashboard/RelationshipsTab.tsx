
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ScatterPlot from "@/components/charts/ScatterPlot";

interface RelationshipsTabProps {
  data: any[];
}

const RelationshipsTab: React.FC<RelationshipsTabProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Airbnb Ratio vs Housing Price Index</CardTitle>
        <CardDescription>Relationship between Airbnb's share of housing and price indices</CardDescription>
      </CardHeader>
      <CardContent className="h-96">
        <ScatterPlot data={data} />
      </CardContent>
    </Card>
  );
};

export default RelationshipsTab;
