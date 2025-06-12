import { Award, Brain, GraduationCap, Play, Sparkles, Target } from "lucide-react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import ProgressCircle from "./ProgressCircle"
import { cn } from "@/lib/utils"

function OverallProgressDisplay({ progress, onCertificateClick }: { progress: number, onCertificateClick?: () => void }) {
  const getProgressLevel = () => {
    if (progress >= 90) return {
      label: "Expert",
      color: "text-purple-700",
      bg: "bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200",
      icon: GraduationCap
    }
    if (progress >= 75) return {
      label: "Advanced",
      color: "text-blue-700",
      bg: "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200",
      icon: Target
    }
    if (progress >= 50) return {
      label: "Intermediate",
      color: "text-emerald-700",
      bg: "bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200",
      icon: Brain
    }
    if (progress >= 25) return {
      label: "Beginner",
      color: "text-amber-700",
      bg: "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200",
      icon: Sparkles
    }
    return {
      label: "Getting Started",
      color: "text-slate-700",
      bg: "bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200",
      icon: Play
    }
  }

  const level = getProgressLevel()
  const LevelIcon = level.icon

  return (
    <div className="flex items-center gap-4">
      <ProgressCircle progress={progress} size={48} />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-slate-900">{progress}%</span>
          <Badge variant="outline" className={cn("text-xs px-3 py-1 border-2 font-medium", level.bg, level.color)}>
            <LevelIcon className="w-3 h-3 mr-1" />
            {level.label}
          </Badge>
          {progress > 50 && (
            <Button
              size="sm"
              variant="outline"
              className="ml-2 px-2 py-1 border-green-500 text-green-700 bg-green-50 hover:bg-green-100 flex items-center gap-1"
              onClick={onCertificateClick}
            >
              <Award className="w-4 h-4" />
              Certificate
            </Button>
          )}
        </div>
        <p className="text-sm text-slate-600 font-medium">Overall Progress</p>
      </div>
    </div>
  )
}

export default OverallProgressDisplay