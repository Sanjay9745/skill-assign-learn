import { CheckCircle } from "lucide-react";

function ProgressCircle({
    progress,
    size = 48,
    showLabel = true,
  }: {
    progress: number;
    size?: number;
    showLabel?: boolean;
  }) {
    const strokeWidth = size <= 32 ? 3 : 4
    const radius = (size - strokeWidth * 2) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (progress / 100) * circumference
  
    const getProgressConfig = () => {
      if (progress >= 100) return {
        color: "#059669",
        bgColor: "#d1fae5",
      }
      if (progress >= 80) return {
        color: "#2563eb",
        bgColor: "#dbeafe",
      }
      if (progress >= 50) return {
        color: "#d97706",
        bgColor: "#fef3c7",
      }
      return {
        color: "#dc2626",
        bgColor: "#fee2e2",
      }
    }
  
    const config = getProgressConfig()
  
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={config.bgColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={config.color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            {progress === 100 ? (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            ) : (
              <span className="font-bold text-xs" style={{ color: config.color }}>
                {progress}%
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
export default ProgressCircle