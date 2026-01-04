"use client";

import { Check, Target, Zap } from "lucide-react";

interface FeatureItemProps {
  iconName: "check" | "target" | "zap";
  title: string;
  description: string;
}

const iconMap = {
  check: Check,
  target: Target,
  zap: Zap,
} as const;

export default function FeatureItem({
  iconName,
  title,
  description,
}: FeatureItemProps) {
  const IconComponent = iconMap[iconName];

  return (
    <div className="text-center">
      <div className="flex justify-center mb-2">
        {IconComponent && (
          <IconComponent className="w-8 h-8 text-white" />
        )}
      </div>
      <div className="text-gray-400 text-sm font-light mb-2">{title}</div>
      <div className="text-gray-300 text-sm font-light">{description}</div>
    </div>
  );
}

