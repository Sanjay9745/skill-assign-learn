import { cn } from "@/lib/utils"
import { Award, CheckCircle, ChevronDown, ChevronRight, Code, Globe, Lock, Network, Palette, Server, Shield, Zap } from "lucide-react"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const iconMap = {
    networking: Network,
    "tcp-ip": Server,
    "http-https": Globe,
    dns: Network,
    "network-security": Shield,
    html: Code,
    css: Palette,
    js: Zap,
    certificate: Award,
  }
  
  
function SidebarItem({
    item,
    level = 0,
    isUnlocked = true,
    onSelect,
    selectedItem,
    isCollapsed,
  }: {
    item: any
    level?: number
    isUnlocked?: boolean
    onSelect: (item: any) => void
    selectedItem: any
    isCollapsed: boolean
  }) {
    const [isExpanded, setIsExpanded] = useState(level === 0)
    const hasChildren = item.children && item.children.length > 0
    const Icon = iconMap[item.icon as keyof typeof iconMap] || Code
    const isSelected = selectedItem?.name === item.name
  
    const isCertificate = item.icon === "certificate"
    let childrenUnlocked = isUnlocked;
    if (hasChildren && level > 0) {
      childrenUnlocked = true; // categories inside categories: always unlocked if parent unlocked
    }
    if (!hasChildren && level > 0 && Array.isArray(item.parentChildren)) {
      // For leaf child, only unlock if all previous siblings are completed
      const idx = item.parentChildren.findIndex((c: any) => c.name === item.name);
      if (idx === 0) {
        childrenUnlocked = isUnlocked;
      } else {
        const prevCompleted = item.parentChildren.slice(0, idx).every((c: any) => (c.progress ?? 0) === 100);
        childrenUnlocked = isUnlocked && prevCompleted;
      }
    }

    // Helper to count all leaf lessons (not categories/certificates)
    const countLessons = (items: any[]): number =>
      items.reduce((count, i) => {
        if (i.children && i.children.length > 0) {
          return count + countLessons(i.children);
        }
        if (i.icon !== "certificate") {
          return count + 1;
        }
        return count;
      }, 0);

    // Helper to sum progress of all leaf lessons
    const sumProgress = (items: any[]): number =>
      items.reduce((sum, i) => {
        if (i.children && i.children.length > 0) {
          return sum + sumProgress(i.children);
        }
        if (i.icon !== "certificate") {
          return sum + (i.progress || 0);
        }
        return sum;
      }, 0);

    // Calculate correct percentage for categories (level 0 with children)
    let displayProgress = item.progress || 0;
    if (level === 0 && item.children && item.children.length > 0) {
      const totalLessons = countLessons(item.children);
      const totalProgress = sumProgress(item.children);
      displayProgress = totalLessons > 0 ? Math.round(totalProgress / totalLessons) : 0;
    }
  
    const handleClick = () => {
      if (isUnlocked) {
        onSelect(item)
        if (hasChildren && !isCollapsed) {
          setIsExpanded(!isExpanded)
        }
      }
    }
  
    if (isCollapsed) {
      return (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "relative flex items-center justify-center p-3 my-1 rounded-xl cursor-pointer transition-all duration-300",
                  "hover:bg-slate-100 hover:shadow-md",
                  isSelected && "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105",
                  !isUnlocked && "opacity-50 cursor-not-allowed",
                )}
                onClick={handleClick}
              >
                {isUnlocked ? (
                  <Icon className={cn("w-5 h-5", isSelected ? "text-white" : "text-gray-600")} />
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
                {isUnlocked && displayProgress === 100 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-white border-2 shadow-xl p-4 rounded-xl max-w-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  {displayProgress === 100 && <CheckCircle className="w-4 h-4 text-green-500" />}
                </div>
                <p className="text-xs text-gray-600">{item.description}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-500",
                        displayProgress >= 100 ? "bg-green-500" :
                          displayProgress >= 80 ? "bg-blue-500" :
                            displayProgress >= 50 ? "bg-yellow-500" : "bg-red-500"
                      )}
                      style={{ width: `${displayProgress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{displayProgress}%</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }
  
    return (
      <div className="w-full">
        <div
          className={cn(
            "group flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300",
            "hover:bg-slate-50 hover:shadow-md",
            isSelected && "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]",
            !isUnlocked && "opacity-50 cursor-not-allowed",
            level > 0 && "ml-8 pl-4 border-l-2 border-slate-200 relative bg-white",
          )}
          onClick={handleClick}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 relative">
              {isUnlocked ? (
                <Icon className={cn("w-5 h-5 transition-colors", isSelected ? "text-white" : "text-gray-600 group-hover:text-blue-600")} />
              ) : (
                <Lock className="w-5 h-5 text-gray-400" />
              )}
              {isUnlocked && typeof displayProgress === "number" && displayProgress === 100 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={cn("font-semibold text-sm truncate transition-colors", isSelected ? "text-white" : "text-slate-900 group-hover:text-slate-700", !isUnlocked && "text-slate-500")}>
                {item.name}
              </h3>
              {level === 0 && (
                <p className={cn("text-xs truncate mt-1 transition-colors", isSelected ? "text-blue-100" : "text-slate-500")}>
                  {item.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isUnlocked && level === 0 && typeof displayProgress === "number" && (
              <div className="flex items-center gap-2">
                <div className="w-12 bg-gray-200 rounded-full h-1.5">
                  <div
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-500",
                      displayProgress >= 100 ? "bg-green-400" :
                        displayProgress >= 80 ? "bg-blue-400" :
                          displayProgress >= 50 ? "bg-yellow-400" : "bg-red-400"
                    )}
                    style={{ width: `${displayProgress}%` }}
                  />
                </div>
                <span className={cn("text-xs font-medium", isSelected ? "text-blue-100" : "text-gray-600")}>
                  {displayProgress}%
                </span>
              </div>
            )}
            {hasChildren && (
              <div className="ml-2">
                {isExpanded ? (
                  <ChevronDown className={cn("w-4 h-4 transition-colors", isSelected ? "text-white" : "text-gray-400")} />
                ) : (
                  <ChevronRight className={cn("w-4 h-4 transition-colors", isSelected ? "text-white" : "text-gray-400")} />
                )}
              </div>
            )}
          </div>
        </div>
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.children.map((child: any, idx: number) => (
              <SidebarItem
                key={child.name}
                item={{ ...child, parentChildren: item.children }}
                level={level + 1}
                isUnlocked={childrenUnlocked && (idx === 0 || item.children.slice(0, idx).every((c: any) => (c.progress ?? 0) === 100))}
                onSelect={onSelect}
                selectedItem={selectedItem}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

export default SidebarItem