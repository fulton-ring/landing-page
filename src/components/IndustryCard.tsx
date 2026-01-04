"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Zap, Factory, Home, Shield, Store, MapPin } from "lucide-react";

interface IndustryCardProps {
  iconName: "Zap" | "Factory" | "Home" | "Shield" | "Store" | "MapPin";
  title: string;
  description: string;
  bulletPoints: string[];
}

const iconMap = {
  Zap,
  Factory,
  Home,
  Shield,
  Store,
  MapPin,
} as const;

export default function IndustryCard({
  iconName,
  title,
  description,
  bulletPoints,
}: IndustryCardProps) {
  const IconComponent = iconMap[iconName];

  return (
    <Card className="hover:shadow-xl transition-all flex flex-col h-full border-0">
      <CardHeader className="flex-shrink-0">
        <div className="mb-4 flex justify-center">
          {IconComponent && (
            <IconComponent className="w-12 h-12 text-gray-900" />
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 text-center leading-tight industry-title">
          {title}
        </h3>
      </CardHeader>

      <CardContent className="flex flex-col">
        <p className="text-gray-600 font-light leading-relaxed text-center industry-description mb-4">
          {description}
        </p>

        <ul className="text-sm text-gray-500 space-y-2 font-light text-left">
          {bulletPoints.map((point, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
