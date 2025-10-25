"use client";

import { Zap, CheckCircle, Archive } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  title: string;
  description: string;
}

function FeatureCard({
  icon,
  iconBgColor,
  iconColor,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="text-center">
      <div
        className={`${iconBgColor} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4`}
      >
        <div className={iconColor}>{icon}</div>
      </div>
      <h3 className="font-semibold font-sans text-gray-900 mb-2">{title}</h3>
      <p className="text-sm font-sans text-gray-600">{description}</p>
    </div>
  );
}

export default function FeatureGrid() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "Smart AI Mapping",
      description:
        "Automatically detects and maps your columns to contact fields using intelligent pattern recognition.",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
      title: "Duplicate Detection",
      description:
        "Finds and merges duplicate contacts based on phone number or email address.",
    },
    {
      icon: <Archive className="w-6 h-6" />,
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "Custom Fields",
      description:
        "Support for custom contact fields with different data types and validation.",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-12">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          iconBgColor={feature.iconBgColor}
          iconColor={feature.iconColor}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
}
