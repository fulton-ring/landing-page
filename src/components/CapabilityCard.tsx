import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Database,
  TrendingUp,
  LayoutDashboard,
  Network,
  Settings,
  Cloud,
} from "lucide-react";

interface CapabilityCardProps {
  number: string;
  title: string;
  description: string;
  bulletPoints: string[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "01": Database, // Data Orchestration
  "02": TrendingUp, // Spatial & Time Series
  "03": LayoutDashboard, // Interactive Dashboards
  "04": Network, // Knowledge Graph
  "05": Settings, // Automated Decision Systems
  "06": Cloud, // Infrastructure & DevOps
};

export default function CapabilityCard({
  number,
  title,
  description,
  bulletPoints,
}: CapabilityCardProps) {
  const IconComponent = iconMap[number] || Database;

  return (
    <Card className="transition-all hover:shadow-xl flex flex-col h-full border-0">
      <CardHeader className="flex-shrink-0">
        <div className="mb-4 flex justify-center">
          <IconComponent className="w-12 h-12 text-gray-900" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight capability-title text-center">
          {title}
        </h3>
      </CardHeader>

      <CardContent className="flex flex-col">
        <p className="text-gray-600 font-light leading-relaxed capability-description mb-4">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
