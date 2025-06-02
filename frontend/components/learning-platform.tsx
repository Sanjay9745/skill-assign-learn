"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
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
      glowColor: "rgba(5, 150, 105, 0.2)",
    }
    if (progress >= 80) return {
      color: "#2563eb",
      bgColor: "#dbeafe", 
      glowColor: "rgba(37, 99, 235, 0.2)",
    }
    if (progress >= 50) return {
      color: "#d97706",
      bgColor: "#fef3c7",
      glowColor: "rgba(217, 119, 6, 0.2)",
    }
    return {
      color: "#dc2626",
      bgColor: "#fee2e2",
      glowColor: "rgba(220, 38, 38, 0.2)",
    }
  }

  const config = getProgressConfig()

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <defs>
          <filter id={`glow-${size}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
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
          filter={`url(#glow-${size})`}
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
          {/* Certificate unlocked badge */}
          {progress > 50 && (
            <Button
              size="sm"
              variant="outline"
              className="ml-2 px-2 py-1 border-green-500 text-green-700 bg-green-50 hover:bg-green-100 flex items-center gap-1"
              onClick={onCertificateClick}
            >
              <Award className="w-4 h-4" />
              Certificate Unlocked
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
  // If parent is unlocked, all children should be unlocked too
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
            <h3
              className={cn(
                "font-semibold text-sm truncate transition-colors",
                isSelected ? "text-white" : "text-slate-900 group-hover:text-slate-700",
                !isUnlocked && "text-slate-500",
              )}
            >
              {item.name}
            </h3>
            {level === 0 && (
              <p className={cn(
                "text-xs truncate mt-1 transition-colors", 
                isSelected ? "text-blue-100" : "text-slate-500"
              )}>
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
          {item.children.map((child: any, index: number) => (
            <SidebarItem
              key={child.name}
              item={child}
              level={level + 1}
              isUnlocked={isUnlocked} // Pass parent's unlock status to children
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
      acc.push(item)
      if (item.children && item.children.length > 0) {
        acc.push(...flattenItems(item.children))
      }
      return acc
    }, [])
  }

  const allItems = flattenItems(data)
  const currentIndex = allItems.findIndex((item) => item.name === currentItem.name)

  if (currentIndex !== -1 && currentIndex < allItems.length - 1) {
    return allItems[currentIndex + 1]
  }

  return null
}

export default function LearningPlatform() {
  const [sidebarState, setSidebarState] = useState<any[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)
  const [isLoading, setIsLoading] = useState(false)
  const [iframeUrl, setIframeUrl] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // --- Auto-scroll state for fullscreen ---
  const [autoScroll, setAutoScroll] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState(1) // 1 = normal, 2 = fast, 0.5 = slow
  const [zoomLevel, setZoomLevel] = useState(1) // Add zoom level state

  // --- Zoom functions ---
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2)) // Max zoom 200%
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5)) // Min zoom 50%
  }

  const handleZoomReset = () => {
    setZoomLevel(1) // Reset to 100%
  }

  // --- Certificate navigation handler ---
  const handleCertificateClick = () => {
    window.location.href = "/certificate"
  }

  useEffect(() => {
    const defaultSidebarData = [
      {
        name: "Networking",
        progress: 0,
        description: "Learn about networking concepts, protocols, and technologies.",
        icon: "networking",
        children: [
          {
            name: "How the Internet Really Works",
            progress: 0,
            description: "Understanding the physical internet infrastructure and data flow.",
            icon: "tcp-ip",
            href: "/networking/networking-part-1",
            children: [],
          },
          {
            name: "Advanced Networking Concepts",
            progress: 0,
            description: "Protocols, ports, DNS, and network troubleshooting tools.",
            icon: "http-https",
            href: "/networking/networking-part-2",
            children: [],
          },
          {
            name: "The Future of Connected Technology",
            progress: 0,
            description: "Network programming, cloud computing, IoT, and future technologies.",
            icon: "dns",
            href: "/networking/networking-part-3",
            children: [],
          }
        ],
      },
      {
        name: "HTML",
        progress: 0,
        description: "Master HTML fundamentals and semantic markup.",
        icon: "html",
        children: [
          {
            name: "HTML Basics",
            progress: 0,
            description: "The Building Blocks of the Web - tags, structure, and elements.",
            icon: "html",
            href: "/html/html-part-1",
            children: [],
          },
          {
            name: "Lists & Tables",
            progress: 0,
            description: "Organizing data with HTML lists and table structures.",
            icon: "html",
            href: "/html/html-part-2",
            children: [],
          },
          {
            name: "HTML Forms",
            progress: 0,
            description: "Gathering user input with interactive forms and controls.",
            icon: "html",
            href: "/html/html-part-3",
            children: [],
          },
          {
            name: "Media & Semantics",
            progress: 0,
            description: "Images, audio, video, and semantic HTML elements.",
            icon: "html",
            href: "/html/html-part-4",
            children: [],
          },
          {
            name: "Linking Files",
            progress: 0,
            description: "Connecting CSS, JavaScript, and other external resources.",
            icon: "html",
            href: "/html/html-part-5",
            children: [],
          },
        ],
      },
      {
        name: "CSS",
        progress: 0,
        description: "Style your web pages with modern CSS techniques.",
        icon: "css",
        children: [
          {
            name: "CSS Fundamentals",
            progress: 0,
            description: "Selectors, properties, colors, typography, and the box model.",
            icon: "css",
            href: "/css/css-part-1",
            children: [],
          },
          {
            name: "Advanced Layout & Design",
            progress: 0,
            description: "Flexbox, Grid, responsive design, and modern CSS techniques.",
            icon: "css",
            href: "/css/css-part-2",
            children: [],
          },
        ],
      },
      {
        name: "JavaScript",
        progress: 0,
        description: "Add interactivity with JavaScript programming.",
        icon: "js",
        children: [
          {
            name: "JS Basics",
            progress: 0,
            description: "Variables, data types, arrays, and objects fundamentals.",
            icon: "js",
            href: "/js/js-part-1",
            children: [],
          },
          {
            name: "Decisions & Loops",
            progress: 0,
            description: "Control flow with if statements, loops, and functions.",
            icon: "js",
            href: "/js/js-part-2",
            children: [],
          },
          {
            name: "Super Functions & Arrow Syntax",
            progress: 0,
            description: "Advanced functions, arrow functions, and function types.",
            icon: "js",
            href: "/js/js-part-3",
            children: [],
          },
          {
            name: "Arrays - Data Collection Toolkit",
            progress: 0,
            description: "Array methods, manipulation, and advanced techniques.",
            icon: "js",
            href: "/js/js-part-4",
            children: [],
          },
          {
            name: "DOM Magic",
            progress: 0,
            description: "Manipulating web pages with the Document Object Model.",
            icon: "js",
            href: "/js/js-part-5",
            children: [],
          },
          {
            name: "Memory Management & References",
            progress: 0,
            description: "Understanding object references and memory management.",
            icon: "js",
            href: "/js/js-part-6",
            children: [],
          },
          {
            name: "Async JavaScript & Event Loop",
            progress: 0,
            description: "Asynchronous programming and understanding the event loop.",
            icon: "js",
            href: "/js/js-part-7",
            children: [],
          },
          {
            name: "Promises & Async/Await",
            progress: 0,
            description: "Modern asynchronous JavaScript patterns and error handling.",
            icon: "js",
            href: "/js/js-part-8",
            children: [],
          },
          {
            name: "Deep Dive into APIs",
            progress: 0,
            description: "Understanding and working with web APIs and data exchange.",
            icon: "js",
            href: "/js/js-part-9",
            children: [],
          },
          {
            name: "Mastering Fetch API",
            progress: 0,
            description: "Making HTTP requests and handling API responses.",
            icon: "js",
            href: "/js/js-part-10",
            children: [],
          },
          {
            name: "Spread, Rest & Copying",
            progress: 0,
            description: "Advanced syntax and memory management techniques.",
            icon: "js",
            href: "/js/js-part-11",
            children: [],
          },
          {
            name: "The Grand Finale",
            progress: 0,
            description: "Celebrating your JavaScript journey and next steps.",
            icon: "js",
            href: "/js/js-part-12",
            children: [],
          },
        ],
      },
      {
        name: "Certificate",
        progress: 0,
        description: "Earn your completion certificate.",
        icon: "certificate",
        href: "/certificate",
        children: [],
      },
    ]
    const stored = typeof window !== "undefined" ? localStorage.getItem("sidebarData") : null
    if (stored) {
      setSidebarState(JSON.parse(stored))
      // Show the first parent item instead of first child
      setSelectedItem(JSON.parse(stored)[0])
    } else {
      setSidebarState(defaultSidebarData)
      // Show the first parent item instead of first child
      setSelectedItem(defaultSidebarData[0])
    }
  }, [])

  useEffect(() => {
    if (sidebarState.length > 0) {
      localStorage.setItem("sidebarData", JSON.stringify(sidebarState))
    }
  }, [sidebarState])

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(false)
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  function updateProgressForLesson(lessonHref: string) {
    function update(items: any[]): [any[], boolean] {
      let updated = false
      const newItems = items.map(item => {
        if (item.href === lessonHref) {
          if (item.progress < 100) {
            updated = true
            return { ...item, progress: 100 }
          }
          return item
        }
        if (item.children && item.children.length > 0) {
          const [newChildren, childUpdated] = update(item.children)
          if (childUpdated) {
            const avg = Math.round(
              newChildren.reduce((acc, c) => acc + c.progress, 0) / newChildren.length
            )
            updated = true
            return { ...item, children: newChildren, progress: avg }
          }
        }
        return item
      })
      return [newItems, updated]
    }
    const [newSidebar, changed] = update(sidebarState)
    if (changed) setSidebarState(newSidebar)
  }

  useEffect(() => {
    if (!iframeUrl || !selectedItem?.href) return

    let iframe: HTMLIFrameElement | null = null
    let scrollHandler: (() => void) | null = null

    function attachScrollListener() {
      iframe = document.querySelector('iframe[src="' + iframeUrl + '"]')
      if (!iframe) return

      iframe.onload = () => {
        try {
          const doc = iframe!.contentDocument || iframe!.contentWindow?.document
          if (!doc) return
          const onScroll = () => {
            const scrollTop = doc.documentElement.scrollTop || doc.body.scrollTop
            const scrollHeight = doc.documentElement.scrollHeight || doc.body.scrollHeight
            const clientHeight = doc.documentElement.clientHeight || doc.body.clientHeight
            if (scrollTop + clientHeight >= scrollHeight - 20) {
              updateProgressForLesson(selectedItem.href)
            }
          }
          doc.addEventListener("scroll", onScroll)
          scrollHandler = () => doc.removeEventListener("scroll", onScroll)
        } catch (e) {
        }
      }
    }

    attachScrollListener()
    return () => {
      if (scrollHandler) scrollHandler()
    }
  }, [iframeUrl, selectedItem?.href])

  // --- Auto-scroll effect for fullscreen ---
  useEffect(() => {
    if (!isFullscreen || !iframeUrl || !autoScroll) return

    let iframe: HTMLIFrameElement | null = document.querySelector('.fullscreen-iframe')
    let interval: NodeJS.Timeout | null = null

    function startAutoScroll() {
      if (!iframe) return
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (!doc) return
        interval = setInterval(() => {
          const el = doc.scrollingElement || doc.documentElement || doc.body
          if (!el) return
          el.scrollBy({ top: 2 * scrollSpeed, behavior: "smooth" })
          // Stop at bottom
          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
            setAutoScroll(false)
            clearInterval(interval!)
          }
        }, 16)
      } catch (e) {
        // cross-origin, ignore
      }
    }

    startAutoScroll()
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isFullscreen, iframeUrl, autoScroll, scrollSpeed])

  const fetchAndShowHtml = async (item: any) => {
    if (!item?.href) {
      setIframeUrl(null)
      return
    }
    setIsLoading(true)
    try {
      const res = await axios.get(`${cdnUrl}/page?coursePage=${item.href}`, { responseType: "text" })
      
      // Inject viewport meta tags and zoom styles into the HTML content
      let htmlContent = res.data
      
      // Check if viewport meta tags already exist
      if (!htmlContent.includes('name="viewport"')) {
        // Find the head tag and inject viewport meta tags and zoom styles
        const headMatch = htmlContent.match(/<head[^>]*>/i)
        if (headMatch) {
          const headTag = headMatch[0]
          const viewportMetasAndStyles = `
    <meta name="viewport" content="width=1024">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        zoom: 0.9;
        -webkit-transform: scale(0.9);
        -webkit-transform-origin: 0 0;
        -moz-transform: scale(0.9);
        -moz-transform-origin: 0 0;
        -o-transform: scale(0.9);
        -o-transform-origin: 0 0;
        transform: scale(0.9);
        transform-origin: 0 0;
      }
      @media (max-width: 768px) {
        body {
          zoom: 0.7;
          -webkit-transform: scale(0.7);
          -moz-transform: scale(0.7);
          -o-transform: scale(0.7);
          transform: scale(0.7);
        }
      }
    </style>`
          
          htmlContent = htmlContent.replace(headTag, headTag + viewportMetasAndStyles)
        } else {
          // If no head tag found, add it with viewport meta tags and zoom styles
          const htmlMatch = htmlContent.match(/<html[^>]*>/i)
          if (htmlMatch) {
            const htmlTag = htmlMatch[0]
            const headWithViewportAndStyles = `
  <head>
    <meta name="viewport" content="width=1024">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        zoom: 0.9;
        -webkit-transform: scale(0.9);
        -webkit-transform-origin: 0 0;
        -moz-transform: scale(0.9);
        -moz-transform-origin: 0 0;
        -o-transform: scale(0.9);
        -o-transform-origin: 0 0;
        transform: scale(0.9);
        transform-origin: 0 0;
      }
      @media (max-width: 768px) {
        body {
          zoom: 0.7;
          -webkit-transform: scale(0.7);
          -moz-transform: scale(0.7);
          -o-transform: scale(0.7);
          transform: scale(0.7);
        }
      }
    </style>
  </head>`
            
            htmlContent = htmlContent.replace(htmlTag, htmlTag + headWithViewportAndStyles)
          }
        }
      }
      
      const blob = new Blob([htmlContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      setIframeUrl(url)
    } catch {
      setIframeUrl(null)
    }
    setIsLoading(false)
  }

  const handleItemSelect = (item: any) => {
    setSelectedItem(item)
    fetchAndShowHtml(item)
    if (windowWidth < 768) {
      setIsMobileMenuOpen(false)
    }
  }

  const handleNextLesson = () => {
    const nextLesson = findNextLesson(selectedItem, sidebarState)
    if (nextLesson) {
      setIsLoading(true)
      setTimeout(() => {
        setSelectedItem(nextLesson)
        fetchAndShowHtml(nextLesson)
        setIsLoading(false)
      }, 500)
    } else {-
      handleCertificateClick()
    }
  }

  // --- Fullscreen next lesson handler ---
  const handleFullscreenNext = () => {
    if (nextLesson) {
      setIsFullscreen(false)
      setTimeout(() => {
        setSelectedItem(nextLesson)
        fetchAndShowHtml(nextLesson)
      }, 300)
    }
  }

  const overallProgress = sidebarState.length
    ? Math.round(sidebarState.reduce((acc, item) => acc + item.progress, 0) / sidebarState.length)
    : 0

  const nextLesson = findNextLesson(selectedItem, sidebarState)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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

            <div className="flex items-center gap-4">
              <div className="hidden lg:block">
                <OverallProgressDisplay progress={overallProgress} onCertificateClick={handleCertificateClick} />
              </div>

              <div className="lg:hidden">
                <ProgressCircle progress={overallProgress} size={36} />
                {/* Show certificate unlocked on mobile */}
                {overallProgress > 50 && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="ml-2 border-green-500 text-green-700 bg-green-50 hover:bg-green-100"
                    onClick={handleCertificateClick}
                  >
                    <Award className="w-5 h-5" />
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="hidden sm:inline-flex">
                  <User className="w-3 h-3 mr-1" />
                  Sanjay
                </Badge>

                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <aside
          className={cn(
            "bg-white/90 backdrop-blur-md shadow-xl border-r border-slate-200 flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
            "md:relative md:translate-x-0",
            "fixed inset-y-0 left-0 z-50 transform",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
            isSidebarCollapsed ? "md:w-20" : "w-80 md:w-80",
          )}
        >
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 flex items-center justify-between">
              <div className={cn("transition-all duration-300", isSidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100")}>
                <h2 className="font-semibold text-gray-900">Course Content</h2>
                <p className="text-xs text-gray-500">{overallProgress}% Complete</p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {sidebarState.map((item, index) => (
                <SidebarItem
                  key={item.name}
                  item={item}
                  isUnlocked={item.icon === "certificate" ? overallProgress > 50 : (index === 0 || sidebarState[index - 1]?.progress >= 70)}
                  onSelect={handleItemSelect}
                  selectedItem={selectedItem}
                  isCollapsed={isSidebarCollapsed}
                />
              ))}
            </div>

            {!isSidebarCollapsed && (
              <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start text-sm">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-4 md:p-8 overflow-auto">
            <Card className="h-full shadow-xl border-0 overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="flex-1 relative min-h-[500px]">
                  {/* --- Fullscreen overlay --- */}
                  {isFullscreen && (
                    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                      {/* Controls */}
                      <div className="absolute top-2 right-2 md:top-4 md:right-4 z-50 flex gap-1 md:gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full shadow-lg w-8 h-8 md:w-10 md:h-10"
                          onClick={() => setIsFullscreen(false)}
                          aria-label="Exit Fullscreen"
                        >
                          <Minimize2 className="w-4 h-4 md:w-6 md:h-6" />
                        </Button>
                        <Button
                          size="icon"
                          variant={autoScroll ? "default" : "secondary"}
                          className="rounded-full shadow-lg w-8 h-8 md:w-10 md:h-10"
                          onClick={() => setAutoScroll(!autoScroll)}
                          aria-label="Auto Scroll"
                        >
                          <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M12 5v14m0 0l-4-4m4 4l4-4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Button>
                        <select
                          className="rounded-lg px-1 py-1 md:px-2 md:py-1 bg-white text-xs md:text-sm border border-gray-300 focus:outline-none h-8 md:h-10"
                          value={scrollSpeed}
                          onChange={e => setScrollSpeed(Number(e.target.value))}
                          aria-label="Scroll Speed"
                        >
                          <option value={0.5}>0.5x</option>
                          <option value={1}>1x</option>
                          <option value={2}>2x</option>
                          <option value={3}>3x</option>
                        </select>
                        {nextLesson && (
                          <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full shadow-lg w-8 h-8 md:w-10 md:h-10"
                            onClick={handleFullscreenNext}
                            aria-label="Next Lesson"
                          >
                            <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                          </Button>
                        )}
                        {/* Certificate unlocked in fullscreen */}
                        {overallProgress > 50 && (
                          <Button
                            size="icon"
                            variant="outline"
                            className="rounded-full shadow-lg border-green-500 text-green-700 bg-green-50 hover:bg-green-100 w-8 h-8 md:w-10 md:h-10"
                            onClick={handleCertificateClick}
                            aria-label="Certificate"
                          >
                            <Award className="w-4 h-4 md:w-6 md:h-6" />
                          </Button>
                        )}
                      </div>

                      {/* Zoom Controls */}
                      <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 z-50 flex flex-col gap-1 md:gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full shadow-lg w-8 h-8 md:w-10 md:h-10"
                          onClick={handleZoomIn}
                          aria-label="Zoom In"
                        >
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                            <line x1="11" y1="8" x2="11" y2="14"/>
                            <line x1="8" y1="11" x2="14" y2="11"/>
                          </svg>
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full shadow-lg w-8 h-8 md:w-10 md:h-10"
                          onClick={handleZoomOut}
                          aria-label="Zoom Out"
                        >
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                            <line x1="8" y1="11" x2="14" y2="11"/>
                          </svg>
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full shadow-lg w-8 h-8 md:w-10 md:h-10 text-xs"
                          onClick={handleZoomReset}
                          aria-label="Reset Zoom"
                        >
                          <span className="text-xs font-bold">{Math.round(zoomLevel * 100)}%</span>
                        </Button>
                      </div>

                      <div className="w-full h-full flex items-center justify-center p-0">
                        {iframeUrl ? (
                          <iframe
                            src={iframeUrl}
                            className="w-full h-full fullscreen-iframe"
                            title={selectedItem?.name}
                            style={{ 
                              border: "none",
                              width: "100vw",
                              height: "100vh",
                              transform: `scale(${zoomLevel})`,
                              transformOrigin: "center center"
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full p-6 md:p-12 bg-gradient-to-br from-slate-50 to-blue-50 w-full">
                            <div className="text-center max-w-lg">
                              <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-2xl">
                                <Play className="w-8 h-8 md:w-12 md:h-12 text-white" />
                              </div>
                              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 md:mb-4">
                                {selectedItem?.name || "Ready to Learn?"}
                              </h3>
                              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                                {selectedItem?.description || "Choose a topic from the sidebar to start your learning journey"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Fullscreen button (only show if iframe is present and not already fullscreen) */}
                  {!isFullscreen && iframeUrl && (
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full shadow w-8 h-8 md:w-10 md:h-10"
                        onClick={() => setIsFullscreen(true)}
                        aria-label="Fullscreen"
                      >
                        <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
                      </Button>
                    </div>
                  )}

                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 md:mb-6"></div>
                        <p className="text-slate-600 text-base md:text-lg font-medium">Loading lesson...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-xl overflow-hidden">
                      {selectedItem?.href && iframeUrl ? (
                        <iframe
                          src={iframeUrl}
                          className="w-full h-full"
                          title={selectedItem.name}
                          style={{ 
                            border: "none",
                            minHeight: "500px"
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full p-6 md:p-12 bg-gradient-to-br from-slate-50 to-blue-50">
                          <div className="text-center max-w-lg">
                            <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-2xl">
                              <Play className="w-8 h-8 md:w-12 md:h-12 text-white" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 md:mb-4">
                              {selectedItem?.name || "Ready to Learn?"}
                            </h3>
                            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                              {selectedItem?.description || "Choose a topic from the sidebar to start your learning journey"}
                            </p>
                            <div className="flex items-center justify-center gap-4 text-slate-500">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="font-medium text-sm md:text-base">Interactive Content</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="font-medium text-sm md:text-base">Expert-Crafted</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4 md:p-8 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      {nextLesson ? (
                        <>
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl flex items-center justify-center">
                            <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-xs md:text-sm font-bold text-slate-900 mb-1">Up Next</p>
                            <p className="text-base md:text-lg text-slate-700 font-medium">{nextLesson.name}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-xs md:text-sm font-bold text-slate-900 mb-1">Congratulations!</p>
                            <p className="text-base md:text-lg text-slate-700 font-medium">Course Complete</p>
                          </div>
                        </>
                      )}
                    </div>
                    <Button
                      onClick={handleNextLesson}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 md:px-8 py-2 md:py-3 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 text-sm md:text-base"
                    >
                      {nextLesson ? 'Continue Learning' : 'Course Complete'}
                      <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
