const features = [
  {
    title: "AI-Powered Organization",
    description:
      "Automatically map, categorize, and deduplicate contacts for a cleaner, smarter database.",
    gradient: "from-blue-400 to-purple-400",
    hover: "group-hover:text-blue-200",
  },
  {
    title: "Seamless Team Collaboration",
    description: "Assign and manage contacts across your agents with ease.",
    gradient: "from-green-400 to-blue-400",
    hover: "group-hover:text-green-200",
  },
  {
    title: "Enterprise-Grade Security",
    description:
      "All your contact data is safely stored with Firebase and follows industry-standard security practices.",
    gradient: "from-purple-400 to-pink-400",
    hover: "group-hover:text-purple-200",
  },
];

export default function FeatureList() {
  return (
    <div className="space-y-6 xl:space-y-8">
      {features.map((feature, i) => (
        <div key={i} className="flex items-start group">
          <div
            className={`bg-gradient-to-r ${feature.gradient} w-2.5 xl:w-3 h-2.5 xl:h-3 rounded-full mt-2.5 mr-4 xl:mr-5 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-200`}
          />
          <div className="flex-1">
            <h3
              className={`text-white font-semibold mb-1 xl:mb-2 text-base xl:text-lg ${feature.hover} transition-colors duration-200`}
            >
              {feature.title}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
