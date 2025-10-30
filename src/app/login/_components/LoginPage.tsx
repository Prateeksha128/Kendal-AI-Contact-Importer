import Image from "next/image";
import GoogleButton from "./GoogleButton";

// Logo Component
function Logo({
  size = "md",
  className = "",
  showText = true,
  variant = "light",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
  variant?: "light" | "dark";
}) {
  const config = {
    sm: { width: 28, height: 28, textSize: "text-lg", spacing: "ml-2" },
    md: { width: 36, height: 36, textSize: "text-xl", spacing: "ml-3" },
    lg: {
      width: 44,
      height: 44,
      textSize: "text-2xl xl:text-3xl",
      spacing: "ml-3",
    },
  };

  const { width, height, textSize, spacing } = config[size];
  const textColor = variant === "light" ? "text-white" : "text-gray-900";

  return (
    <div className={`flex items-center ${className}`}>
      <Image src="/logo.png" alt="Kendal Logo" width={width} height={height} />
      {showText && (
        <div className={spacing}>
          <h1
            className={`${textSize} font-bold font-sans ${textColor} tracking-tight`}
          >
            Kendal AI
          </h1>
          {size !== "sm" && (
            <p
              className={`text-xs font-medium font-sans opacity-50 ${
                variant === "light" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              AI-POWERED CRM
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Features List
function FeatureList() {
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


// Main Login Page Component
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-r from-slate-950 to-slate-800 p-6 text-center">
        <Logo size="sm" className="justify-center mb-4" />
        <h2 className="text-xl font-bold text-white">
          Smart Contact Management
        </h2>
        <p className="text-sm text-gray-300 mt-2">
          AI-powered intelligence for your contacts
        </p>
      </div>

      {/* Left Panel - Desktop */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950 flex-col px-8 xl:px-12 py-6">
        <div className="flex items-center mb-12 xl:mb-16">
          <Logo size="lg" />
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <div className="mb-8 xl:mb-12">
            <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4 xl:mb-6 leading-tight">
              Smart Contact Management
            </h2>
            <p className="text-lg xl:text-xl text-gray-300 mb-6 xl:mb-8 leading-relaxed">
              Effortlessly import, organize, and manage your contacts with
              AI-powered intelligence.
            </p>
            <div className="w-12 xl:w-16 h-1 bg-white/30 rounded"></div>
          </div>

          <FeatureList />
        </div>

        <div className="text-center pt-4 mt-6 border-t border-white/10">
          <p className="text-gray-400 text-xs xl:text-sm font-medium">
            Copyright Kendal AI. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg lg:shadow-2xl p-6 sm:p-8 lg:p-12 border border-gray-100 relative overflow-hidden">
            <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20"></div>

            <div className="relative">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="mb-3 lg:mb-4">
                  <div className="w-12 lg:w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 lg:mb-3 tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-gray-600 text-sm lg:text-lg">
                  Access your smart contacts dashboard
                </p>
              </div>

              <GoogleButton />

              {/* Terms */}
              <div className="mt-6 text-center">
                <p className="text-xs lg:text-sm text-gray-500 leading-relaxed px-2">
                  By signing in, you agree to our{" "}
                  <span className="text-slate-700 hover:text-slate-900 hover:underline cursor-pointer font-medium transition-colors">
                    Terms
                  </span>{" "}
                  and{" "}
                  <span className="text-slate-700 hover:text-slate-900 hover:underline cursor-pointer font-medium transition-colors">
                    Privacy
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
