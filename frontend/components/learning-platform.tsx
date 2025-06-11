"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Network,
  Globe,
  Shield,
  Server,
  Code,
  Palette,
  Zap,
  Award,
  User,
  BookOpen,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Play,
  CheckCircle,
  Clock,
  Home,
  Settings,
  LogOut,
  Trophy,
  Star,
  GraduationCap,
  Target,
  Brain,
  Sparkles,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Pause,
  Music4,
  ArrowDownToLine,
} from "lucide-react"
import { cn } from "@/lib/utils"
import cdnUrl from "@/api/cdnUrl"
import axios from "axios"

// Icon mapping
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

// Enhanced Progress Circle Component
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

// Enhanced Overall Progress Display
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

// Enhanced Sidebar Item Component
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
  const childrenUnlocked = isUnlocked || item.progress >= 70 || isCertificate

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
              {isUnlocked && item.progress === 100 && (
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
                {item.progress === 100 && <CheckCircle className="w-4 h-4 text-green-500" />}
              </div>
              <p className="text-xs text-gray-600">{item.description}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-500",
                      item.progress >= 100 ? "bg-green-500" :
                        item.progress >= 80 ? "bg-blue-500" :
                          item.progress >= 50 ? "bg-yellow-500" : "bg-red-500"
                    )}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700">{item.progress}%</span>
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
            {isUnlocked && typeof item.progress === "number" && item.progress === 100 && (
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
          {isUnlocked && level === 0 && typeof item.progress === "number" && (
            <div className="flex items-center gap-2">
              <div className="w-12 bg-gray-200 rounded-full h-1.5">
                <div
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    item.progress >= 100 ? "bg-green-400" :
                      item.progress >= 80 ? "bg-blue-400" :
                        item.progress >= 50 ? "bg-yellow-400" : "bg-red-400"
                  )}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <span className={cn("text-xs font-medium", isSelected ? "text-blue-100" : "text-gray-600")}>
                {item.progress}%
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
          {item.children.map((child: any) => (
            <SidebarItem
              key={child.name}
              item={child}
              level={level + 1}
              isUnlocked={childrenUnlocked}
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

// Find next lesson function
function findNextLesson(currentItem: any, data: any[]): any | null {
  const flattenItems = (items: any[]): any[] => {
    return items.reduce((acc: any[], item) => {
      acc.push(item);
      if (item.children && item.children.length > 0) {
        acc.push(...flattenItems(item.children));
      }
      return acc;
    }, []);
  };

  const allItems = flattenItems(data);
  const currentIndex = allItems.findIndex((item) => item.name === currentItem?.name);

  if (currentIndex !== -1 && currentIndex < allItems.length - 1) {
    return allItems[currentIndex + 1];
  }
  return null;
}

// Compact, reusable Audio Player Component
function AudioPlayer({
  isPlaying,
  progress,
  currentTime,
  duration,
  playbackRate,
  onPlayPause,
  onSeek,
  onRateChange,
  onToggleAutoScroll,
  isAutoScrollOn,
  lessonName,
  isCompact = false,
  onClose,
}: {
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  playbackRate: number;
  onPlayPause: () => void;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRateChange: (rate: number) => void;
  onToggleAutoScroll?: () => void;
  isAutoScrollOn?: boolean;
  lessonName?: string;
  isCompact?: boolean;
  onClose?: () => void;
}) {

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isCompact) {
    return (
        <div className="flex items-center gap-3">
          <Button size="icon" variant={isPlaying ? "default" : "secondary"} className="w-8 h-8 rounded-full flex-shrink-0" onClick={onPlayPause}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium truncate">{lessonName}</span>
              <span className="text-xs opacity-75 flex-shrink-0">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
            <input type="range" min="0" max="100" value={progress} onChange={onSeek} className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-compact" />
          </div>
           <div className="flex items-center gap-1 flex-shrink-0">
            {[1, 1.5, 2].map((rate) => (
              <Button key={rate} size="sm" variant={playbackRate === rate ? "default" : "ghost"} className="px-2 py-1 text-xs h-6 min-w-[30px]" onClick={() => onRateChange(rate)}>{rate}x</Button>
            ))}
          </div>
        </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-3">
        <Button size="icon" variant={isPlaying ? "default" : "secondary"} className="w-10 h-10 rounded-full flex-shrink-0" onClick={onPlayPause}>
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>
        <div className="w-full flex-1 sm:mx-3">
            <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm font-medium text-gray-700 truncate">{lessonName}</span>
                <span className="text-xs text-gray-500 flex-shrink-0">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
            <input type="range" min="0" max="100" value={progress} onChange={onSeek} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"/>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
            {onToggleAutoScroll && (
              <TooltipProvider><Tooltip><TooltipTrigger asChild>
                 <Button size="icon" variant={isAutoScrollOn ? "default" : "ghost"} className="w-9 h-9 rounded-full" onClick={onToggleAutoScroll}><ArrowDownToLine className="w-4 h-4" /></Button>
              </TooltipTrigger><TooltipContent><p>Toggle Auto-Scroll</p></TooltipContent></Tooltip></TooltipProvider>
            )}
            <div className="flex items-center gap-1">
                {[0.5, 1, 1.5, 2].map(rate => (
                    <Button key={rate} size="sm" variant={playbackRate === rate ? "default" : "ghost"} className="px-2 py-1 text-xs h-7 min-w-[35px]" onClick={() => onRateChange(rate)}>{rate}x</Button>
                ))}
            </div>
            {onClose && <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full" onClick={onClose}><X className="w-4 h-4" /></Button>}
        </div>
    </div>
  )
}


export default function LearningPlatform() {
  const [sidebarState, setSidebarState] = useState<any[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
  const [isLoading, setIsLoading] = useState(false)
  const [iframeUrl, setIframeUrl] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // FIX: State to manage hydration and prevent SSR mismatch
  const [isMounted, setIsMounted] = useState(false);

  // Unified Auto-scroll and Zoom State
  const [autoScroll, setAutoScroll] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState(1)
  const [zoomLevel, setZoomLevel] = useState(1)

  // Audio player state
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [audioCurrentTime, setAudioCurrentTime] = useState(0)
  const [audioPlaybackRate, setAudioPlaybackRate] = useState(1)
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)
  // Add ref for fullscreen iframe
  const fullscreenIframeRef = useRef<HTMLIFrameElement>(null)

  // FIX: Set mount state to true only on the client after initial render
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Load initial data from localStorage or defaults
  useEffect(() => {
    if (!isMounted) return; // Don't run on server or first client render

    const defaultSidebarData = [
        {
          name: "Networking",
          progress: 0,
          description: "Learn about networking concepts, protocols, and technologies.",
          icon: "networking",
          children: [
            { name: "How the Internet Really Works", progress: 0, description: "Understanding the physical internet infrastructure and data flow.", icon: "tcp-ip", href: "/networking/networking-part-1", children: [] },
            { name: "Advanced Networking Concepts", progress: 0, description: "Protocols, ports, DNS, and network troubleshooting tools.", icon: "http-https", href: "/networking/networking-part-2", children: [] },
            { name: "The Future of Connected Technology", progress: 0, description: "Network programming, cloud computing, IoT, and future technologies.", icon: "dns", href: "/networking/networking-part-3", children: [] }
          ],
        },
        {
          name: "HTML", progress: 0, description: "Master HTML fundamentals and semantic markup.", icon: "html",
          children: [
            { name: "HTML Basics", progress: 0, description: "The Building Blocks of the Web - tags, structure, and elements.", icon: "html", href: "/html/html-part-1", children: [] },
            { name: "Lists & Tables", progress: 0, description: "Organizing data with HTML lists and table structures.", icon: "html", href: "/html/html-part-2", children: [] },
            { name: "HTML Forms", progress: 0, description: "Gathering user input with interactive forms and controls.", icon: "html", href: "/html/html-part-3", children: [] },
            { name: "Media & Semantics", progress: 0, description: "Images, audio, video, and semantic HTML elements.", icon: "html", href: "/html/html-part-4", children: [] },
            { name: "Linking Files", progress: 0, description: "Connecting CSS, JavaScript, and other external resources.", icon: "html", href: "/html/html-part-5", children: [] },
          ],
        },
        {
          name: "CSS", progress: 0, description: "Style your web pages with modern CSS techniques.", icon: "css",
          children: [
            { name: "CSS Fundamentals", progress: 0, description: "Selectors, properties, colors, typography, and the box model.", icon: "css", href: "/css/css-part-1", children: [] },
            { name: "Advanced Layout & Design", progress: 0, description: "Flexbox, Grid, responsive design, and modern CSS techniques.", icon: "css", href: "/css/css-part-2", children: [] },
          ],
        },
        {
          name: "JavaScript", progress: 0, description: "Add interactivity with JavaScript programming.", icon: "js",
          children: [
            { name: "JS Basics", progress: 0, description: "Variables, data types, arrays, and objects fundamentals.", icon: "js", href: "/js/js-part-1", children: [] },
            { name: "Decisions & Loops", progress: 0, description: "Control flow with if statements, loops, and functions.", icon: "js", href: "/js/js-part-2", children: [] },
            { name: "Super Functions & Arrow Syntax", progress: 0, description: "Advanced functions, arrow functions, and function types.", icon: "js", href: "/js/js-part-3", children: [] },
            { name: "Arrays - Data Collection Toolkit", progress: 0, description: "Array methods, manipulation, and advanced techniques.", icon: "js", href: "/js/js-part-4", children: [] },
            { name: "DOM Magic", progress: 0, description: "Manipulating web pages with the Document Object Model.", icon: "js", href: "/js/js-part-5", children: [] },
            { name: "Memory Management & References", progress: 0, description: "Understanding object references and memory management.", icon: "js", href: "/js/js-part-6", children: [] },
            { name: "Async JavaScript & Event Loop", progress: 0, description: "Asynchronous programming and understanding the event loop.", icon: "js", href: "/js/js-part-7", children: [] },
            { name: "Promises & Async/Await", progress: 0, description: "Modern asynchronous JavaScript patterns and error handling.", icon: "js", href: "/js/js-part-8", children: [] },
            { name: "Deep Dive into APIs", progress: 0, description: "Understanding and working with web APIs and data exchange.", icon: "js", href: "/js/js-part-9", children: [] },
            { name: "Mastering Fetch API", progress: 0, description: "Making HTTP requests and handling API responses.", icon: "js", href: "/js/js-part-10", children: [] },
            { name: "Spread, Rest & Copying", progress: 0, description: "Advanced syntax and memory management techniques.", icon: "js", href: "/js/js-part-11", children: [] },
            { name: "The Grand Finale", progress: 0, description: "Celebrating your JavaScript journey and next steps.", icon: "js", href: "/js/js-part-12", children: [] },
          ],
        },
        { name: "Certificate", progress: 0, description: "Earn your completion certificate.", icon: "certificate", href: "/certificate", children: [] },
    ];
    const stored = localStorage.getItem("sidebarData");
    let dataToUse = defaultSidebarData;
    if (stored) {
      try {
        dataToUse = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse sidebar data from localStorage", e);
      }
    }
    setSidebarState(dataToUse);
    
    if (!selectedItem) {
        const firstItem = dataToUse[0];
        const firstLesson = firstItem?.children?.length > 0 ? firstItem.children[0] : firstItem;
        setSelectedItem(firstLesson);
    }
  }, [isMounted]);
  
  // Persist sidebar state to localStorage
  useEffect(() => {
    if (sidebarState.length > 0) {
      localStorage.setItem("sidebarData", JSON.stringify(sidebarState))
    }
  }, [sidebarState])

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
        setWindowWidth(window.innerWidth);
        if(window.innerWidth >= 768) {
            setIsMobileMenuOpen(false);
        }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])
  
  const fetchAndShowHtml = async (item: any) => {
    if (!item?.href) {
      setIframeUrl(null);
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.get(`${cdnUrl}/page?coursePage=${item.href}`, { responseType: "text" });
      const responsiveStyles = `
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          :root { --line-height-base: 1.7; --font-size-base: 1.1rem; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: var(--line-height-base);
            font-size: var(--font-size-base);
            color: #2d3748;
            padding: clamp(1rem, 5vw, 2.5rem);
            box-sizing: border-box;
            overflow-x: hidden;
            background-color: #fff;
          }
          img, video, iframe { max-width: 100%; height: auto; border-radius: 8px; }
          h1, h2, h3 { line-height: 1.2; margin-top: 1.5em; margin-bottom: 0.5em; color: #1a202c; }
          pre { white-space: pre-wrap; word-wrap: break-word; font-size: 0.9em; background-color: #f7fafc; padding: 1em; border-radius: 8px; overflow-x: auto; border: 1px solid #e2e8f0;}
          code { font-family: 'Courier New', Courier, monospace; }
        </style>
      `;

      let htmlContent = res.data;
      if (!htmlContent.includes('<head>')) {
        htmlContent = `<html><head></head><body>${htmlContent}</body></html>`
      }
      htmlContent = htmlContent.replace(/<head[^>]*>/i, `$&${responsiveStyles}`);
      
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      setIframeUrl(url);
    } catch {
      setIframeUrl(null);
    }
    setIsLoading(false);
  };
  
  const fetchAudio = async (item: any) => {
    if (!item?.href) {
      setAudioUrl(null);
      return;
    }
    try {
      const res = await axios.get(`${cdnUrl}/audio?courseAudio=${item.href}-audio`, { responseType: "blob" });
      const audioBlob = new Blob([res.data], { type: "audio/wav" });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    } catch (error) {
      console.log("No audio found for this lesson.");
      setAudioUrl(null);
    }
  };

  const handleAudioPlayPause = () => {
    if (audioRef.current) {
      if (isAudioPlaying) audioRef.current.pause();
      else audioRef.current.play();
    }
  };

  const handleAudioTimeUpdate = () => { if (audioRef.current) { const current = audioRef.current.currentTime; const duration = audioRef.current.duration; setAudioCurrentTime(current); setAudioProgress((current / duration) * 100); }};
  const handleAudioLoadedMetadata = () => { if (audioRef.current) setAudioDuration(audioRef.current.duration); };
  const handleAudioEnded = () => { setIsAudioPlaying(false); };
  const handleAudioSeek = (e: React.ChangeEvent<HTMLInputElement>) => { if (audioRef.current) { const newTime = (parseFloat(e.target.value) / 100) * audioDuration; audioRef.current.currentTime = newTime; }};
  const handlePlaybackRateChange = (rate: number) => { if (audioRef.current) { audioRef.current.playbackRate = rate; setAudioPlaybackRate(rate); }};
  
  const handleItemSelect = (item: any) => {
    if(item.name === selectedItem?.name) return;
    setSelectedItem(item);
    if (windowWidth < 768) {
        setIsMobileMenuOpen(false)
    }
  };
  
  useEffect(() => {
    if (selectedItem) {
        fetchAndShowHtml(selectedItem);
        fetchAudio(selectedItem);
    }
  }, [selectedItem?.href]);

  // --- Auto-scroll logic for fullscreen (with progress) ---
  useEffect(() => {
    if (!isFullscreen || !autoScroll) return;

    let frameId: number;
    const scrollStep = () => {
      const iframe = fullscreenIframeRef.current;
      if (iframe && iframe.contentWindow) {
        try {
          const doc = iframe.contentWindow.document;
          const maxScroll = doc.body.scrollHeight - doc.documentElement.clientHeight;
          const currentScroll = doc.documentElement.scrollTop || doc.body.scrollTop;
          if (currentScroll < maxScroll) {
            const speed = 1.5 * scrollSpeed; // px per frame, adjust as needed
            doc.documentElement.scrollTop = doc.body.scrollTop = currentScroll + speed;
            // Progress logic: update selectedItem's progress if not 100%
            if (sidebarState && selectedItem && selectedItem.href) {
              const percent = Math.min(100, Math.round(((currentScroll + speed) / maxScroll) * 100));
              if (percent > (selectedItem.progress || 0)) {
                setSidebarState(prev => {
                  // Deep update progress for selectedItem
                  const updateProgress = (items: any[]): any[] =>
                    items.map(item => {
                      if (item.name === selectedItem.name && item.href === selectedItem.href) {
                        return { ...item, progress: percent }
                      }
                      if (item.children && item.children.length > 0) {
                        return { ...item, children: updateProgress(item.children) }
                      }
                      return item
                    });
                  return updateProgress(prev);
                });
              }
            }
            frameId = requestAnimationFrame(scrollStep);
          }
        } catch (e) {
          // Cross-origin, do nothing
        }
      }
    };
    frameId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(frameId);
    // eslint-disable-next-line
  }, [isFullscreen, autoScroll, scrollSpeed, iframeUrl, selectedItem, sidebarState]);

  // FIX: Show a loading screen until the component is mounted on the client
  if (!isMounted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const overallProgress = sidebarState.length > 0
    ? Math.round(sidebarState.reduce((acc, item) => acc + (item.progress || 0), 0) / sidebarState.filter(item => item.icon !== 'certificate').length)
    : 0;

  const nextLesson = findNextLesson(selectedItem, sidebarState);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
       <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-bold text-gray-900">Skill Assign</h1>
                            <p className="text-xs text-gray-500">Master Technology Skills</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden lg:block">
                        <OverallProgressDisplay progress={overallProgress} onCertificateClick={() => {}} />
                    </div>
                    <div className="lg:hidden flex items-center gap-2">
                        <ProgressCircle progress={overallProgress} size={36} />
                        {overallProgress > 50 && (
                            <Button size="icon" variant="outline" className="border-green-500 text-green-700 bg-green-50 hover:bg-green-100 w-9 h-9" onClick={() => {}}>
                                <Award className="w-5 h-5" />
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="hidden sm:inline-flex">
                            <User className="w-3 h-3 mr-1" /> Sanjay
                        </Badge>
                        <Button size="icon" variant="outline" className="w-9 h-9">
                            <Settings className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}
        <aside
          className={cn(
            "bg-white/90 backdrop-blur-md shadow-xl border-r border-slate-200 flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
            "md:relative md:translate-x-0",
            "fixed inset-y-0 left-0 z-50 transform h-full",
            isMobileMenuOpen ? "translate-x-0 w-80" : "-translate-x-full",
            isSidebarCollapsed ? "md:w-20" : "md:w-80",
          )}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 flex items-center justify-between">
                <div className={cn("transition-opacity duration-300", isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100")}>
                    <h2 className="font-semibold text-gray-900">Course Content</h2>
                    <p className="text-xs text-gray-500">{overallProgress}% Complete</p>
                </div>
                <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                    {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {sidebarState.map((item, index) => (
                    <SidebarItem
                        key={item.name}
                        item={item}
                        isUnlocked={item.icon === "certificate" ? overallProgress > 50 : (index === 0 || (sidebarState[index - 1]?.progress ?? 0) >= 70)}
                        onSelect={handleItemSelect}
                        selectedItem={selectedItem}
                        isCollapsed={isSidebarCollapsed}
                    />
                ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
            <Card className="h-full shadow-xl border-0 overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="flex-1 relative min-h-[500px]">
                  {isFullscreen && (
                    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                        <div className="absolute top-4 right-4 z-[52] flex gap-2">
                            <Button size="icon" variant="secondary" className="rounded-full shadow-lg" onClick={() => setIsFullscreen(false)}><Minimize2 /></Button>
                            <Button size="icon" variant={autoScroll ? "default" : "secondary"} className="rounded-full shadow-lg" onClick={() => setAutoScroll(!autoScroll)}><ArrowDownToLine /></Button>
                            <select className="rounded-full px-2 bg-white text-sm border border-gray-300 focus:outline-none h-10" value={scrollSpeed} onChange={e => setScrollSpeed(Number(e.target.value))}>
                                <option value={0.5}>0.5x</option><option value={1}>1x</option><option value={2}>2x</option><option value={3}>3x</option>
                            </select>
                            {nextLesson && (<Button size="icon" variant="secondary" className="rounded-full shadow-lg" onClick={() => {}}><ChevronRight /></Button>)}
                        </div>
                        <div className="absolute bottom-20 right-4 z-[52] flex flex-col gap-2">
                            <Button size="icon" variant="secondary" className="rounded-full shadow-lg" onClick={() => {}}><ZoomIn /></Button>
                            <Button size="icon" variant="secondary" className="rounded-full shadow-lg" onClick={() => {}}><ZoomOut /></Button>
                            <Button size="icon" variant="secondary" className="rounded-full shadow-lg" onClick={() => {}}><RotateCcw className="w-5 h-5" /></Button>
                        </div>
                        
                        {/* Audio Player in Fullscreen with hide/show */}
                        {audioUrl && isAudioPlayerVisible && (
                          <div className="absolute bottom-4 left-4 right-4 z-[51] bg-black/70 backdrop-blur-sm rounded-xl p-3 text-white flex items-center">
                             <AudioPlayer
                                isPlaying={isAudioPlaying}
                                progress={audioProgress}
                                currentTime={audioCurrentTime}
                                duration={audioDuration}
                                playbackRate={audioPlaybackRate}
                                onPlayPause={handleAudioPlayPause}
                                onSeek={handleAudioSeek}
                                onRateChange={handlePlaybackRateChange}
                                lessonName={selectedItem?.name}
                                isCompact={true}
                                onClose={() => setIsAudioPlayerVisible(false)}
                              />
                          </div>
                        )}
                        {audioUrl && !isAudioPlayerVisible && (
                          <div className="absolute bottom-8 left-8 z-[52]">
                            <Button size="icon" className="rounded-full shadow-lg w-12 h-12" onClick={() => setIsAudioPlayerVisible(true)}><Music4 /></Button>
                          </div>
                        )}

                        {iframeUrl && (
                          <iframe
                            ref={fullscreenIframeRef}
                            src={iframeUrl}
                            className="w-full h-full"
                            title={selectedItem?.name}
                            style={{ border: "none" }}
                          />
                        )}
                    </div>
                  )}

                  {!isFullscreen && iframeUrl && (
                    <div className="absolute top-4 right-4 z-20">
                      <Button size="icon" variant="secondary" className="rounded-full shadow-lg" onClick={() => setIsFullscreen(true)}><Maximize2 /></Button>
                    </div>
                  )}

                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
                  ) : iframeUrl ? (
                    <iframe src={iframeUrl} className="w-full h-full rounded-xl" title={selectedItem?.name} style={{ border: "none", minHeight: "500px" }} />
                  ) : (
                    <div className="flex items-center justify-center h-full p-8 bg-gradient-to-br from-slate-50 to-blue-50">
                        <div className="text-center max-w-lg">
                            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl"><Play className="w-12 h-12 text-white" /></div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">{selectedItem?.name || "Ready to Learn?"}</h3>
                            <p className="text-slate-600 text-lg leading-relaxed">{selectedItem?.description || "Choose a topic from the sidebar to start your learning journey"}</p>
                        </div>
                    </div>
                  )}
                  
                  {audioUrl && !isFullscreen && isAudioPlayerVisible && (
                    <div className="absolute bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 shadow-lg">
                       <AudioPlayer
                          isPlaying={isAudioPlaying}
                          progress={audioProgress}
                          currentTime={audioCurrentTime}
                          duration={audioDuration}
                          playbackRate={audioPlaybackRate}
                          onPlayPause={handleAudioPlayPause}
                          onSeek={handleAudioSeek}
                          onRateChange={handlePlaybackRateChange}
                          onToggleAutoScroll={() => setAutoScroll(!autoScroll)}
                          isAutoScrollOn={autoScroll}
                          lessonName={selectedItem?.name}
                          onClose={() => setIsAudioPlayerVisible(false)}
                        />
                    </div>
                  )}

                  {audioUrl && !isFullscreen && !isAudioPlayerVisible && (
                    <div className="absolute bottom-4 right-4 z-20">
                         <Button size="icon" className="rounded-full shadow-lg w-12 h-12" onClick={() => setIsAudioPlayerVisible(true)}><Music4 /></Button>
                    </div>
                  )}
                  
                  {audioUrl && (
                    <audio 
                      ref={audioRef} 
                      src={audioUrl} 
                      onTimeUpdate={handleAudioTimeUpdate} 
                      onLoadedMetadata={handleAudioLoadedMetadata} 
                      onEnded={handleAudioEnded}
                      onPlay={() => setIsAudioPlaying(true)}
                      onPause={() => setIsAudioPlaying(false)}
                      />
                  )}
                </div>

                <div className="p-4 md:p-6 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {nextLesson ? (
                            <>
                                <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl flex items-center justify-center shrink-0"><Clock className="w-6 h-6 text-white" /></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 mb-1">Up Next</p>
                                    <p className="text-lg text-slate-700 font-medium">{nextLesson.name}</p>
                                </div>
                            </>
                        ) : (
                             <>
                                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center shrink-0"><Trophy className="w-6 h-6 text-white" /></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 mb-1">Congratulations!</p>
                                    <p className="text-lg text-slate-700 font-medium">Course Complete</p>
                                </div>
                            </>
                        )}
                    </div>
                    <Button onClick={() => {}} disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 text-base w-full sm:w-auto">
                        {nextLesson ? 'Continue Learning' : 'Claim Certificate'}
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
      <style jsx>{`
        .slider::-webkit-slider-thumb { appearance: none; height: 16px; width: 16px; border-radius: 50%; background: #3b82f6; cursor: pointer; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        .slider::-moz-range-thumb { height: 16px; width: 16px; border-radius: 50%; background: #3b82f6; cursor: pointer; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        .slider-compact::-webkit-slider-thumb { background: #fff; }
        .slider-compact::-moz-range-thumb { background: #fff; }
      `}</style>
    </div>
  )
}