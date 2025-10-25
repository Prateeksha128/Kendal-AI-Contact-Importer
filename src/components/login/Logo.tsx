import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
  variant?: "light" | "dark";
  containerClass?: string;
}

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

export default function Logo({
  size = "md",
  className = "",
  showText = true,
  variant = "light",
  containerClass = "",
}: LogoProps) {
  const { width, height, textSize, spacing } = config[size];
  const textColor = variant === "light" ? "text-white" : "text-gray-900";

  return (
    <div className={`flex items-center ${className}`}>
      <div className={containerClass}>
        <Image
          src="/logo.png"
          alt="Kendal Logo"
          width={width}
          height={height}
        />
      </div>
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
