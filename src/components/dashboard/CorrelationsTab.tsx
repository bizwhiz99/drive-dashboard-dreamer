
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CorrelationHeatmap from "@/components/charts/CorrelationHeatmap";

interface CorrelationsTabProps {
  data: any[];
}

const CorrelationsTab: React.FC<CorrelationsTabProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Correlation Heatmap</CardTitle>
        <CardDescription>Correlation strength between key housing market metrics</CardDescription>
      </CardHeader>
      <CardContent className="h-[600px]">
        <CorrelationHeatmap data={data} />
      </CardContent>
    </Card>
  );
};

export default CorrelationsTab;
