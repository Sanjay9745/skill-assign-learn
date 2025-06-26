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
  Settings,
  Trophy,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Pause,
  Music4,
  ArrowDownToLine,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import cdnUrl from "@/api/cdnUrl"
import axios from "axios"
import defaultSidebarData from "@/constants/defaultSidebarData"
import ProgressCircle from "./ProgressCircle"
import OverallProgressDisplay from "./OverallProgressDisplay"
import AudioPlayer from "./AudioPlayer"
import SidebarItem from "./SideBarItem"
import { useRouter } from "next/navigation"

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

export default function LearningPlatform() {
  const [sidebarState, setSidebarState] = useState<any[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
  const [isLoading, setIsLoading] = useState(false)
  const [iframeUrl, setIframeUrl] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showFullscreenControls, setShowFullscreenControls] = useState(false)

  const [isMounted, setIsMounted] = useState(false);

  const [autoScroll, setAutoScroll] = useState(false)
  const [audioAutoScroll, setAudioAutoScroll] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState(1)
  const [zoomLevel, setZoomLevel] = useState(1)

  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [totalChunks, setTotalChunks] = useState(0)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [audioCurrentTime, setAudioCurrentTime] = useState(0)
  const [audioPlaybackRate, setAudioPlaybackRate] = useState(1)
  const [audioLanguage, setAudioLanguage] = useState('english')
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState(true)
  const [isAudioLoading, setIsAudioLoading] = useState(false)
  const [audioLoadingProgress, setAudioLoadingProgress] = useState(0)
  const [canPlayAudio, setCanPlayAudio] = useState(false)
  const [audioBufferLength, setAudioBufferLength] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const fullscreenIframeRef = useRef<HTMLIFrameElement>(null)
  const mainIframeRef = useRef<HTMLIFrameElement>(null)

  const htmlAbortControllerRef = useRef<AbortController | null>(null);
  const audioAbortControllerRef = useRef<AbortController | null>(null);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (!isMounted) return;

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

  useEffect(() => {
    if (sidebarState.length > 0) {
      localStorage.setItem("sidebarData", JSON.stringify(sidebarState))
    }
  }, [sidebarState])

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

  useEffect(() => {
    if (!isMounted) return;
    
    const storedLanguage = localStorage.getItem("audioLanguage");
    if (storedLanguage) {
      setAudioLanguage(storedLanguage);
    }
  }, [isMounted]);

  useEffect(() => {
    if (audioLanguage) {
      localStorage.setItem("audioLanguage", audioLanguage);
    }
  }, [audioLanguage]);

  const fetchAndShowHtml = async (item: any) => {
    if (htmlAbortControllerRef.current) {
      htmlAbortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    htmlAbortControllerRef.current = abortController;

    if (!item?.href) {
      setIframeUrl(null);
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.get(`${cdnUrl}/page?coursePage=${item.href}`, { 
        responseType: "text",
        signal: abortController.signal
      });
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
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('HTML fetch request canceled:', item.href);
      } else {
        setIframeUrl(null);
        console.error("Error fetching HTML content for", item.href, error);
      }
    }
    setIsLoading(false);
  };
  
  const fetchAudioChunked = async (item: any) => {
    if (audioAbortControllerRef.current) {
      audioAbortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    audioAbortControllerRef.current = abortController;

    if (!item?.href) {
      setAudioUrl(null);
      setIsAudioPlayerVisible(false);
      setIsAudioLoading(false);
      setAudioChunks([]);
      setTotalChunks(0);
      setCanPlayAudio(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load();
    }

    setIsAudioLoading(true);
    setAudioLoadingProgress(0);
    setAudioUrl(null);
    setIsAudioPlaying(false);
    setAudioProgress(0);
    setAudioCurrentTime(0);
    setAudioDuration(0);
    setAudioChunks([]);
    setTotalChunks(0);
    setCanPlayAudio(false);

    try {
      const metaRes = await axios.head(`${cdnUrl}/audio?courseAudio=${item.href}-audio&language=${audioLanguage}`, {
        signal: abortController.signal
      });
      const contentLength = parseInt(metaRes.headers['content-length'] || '0');
      
      if (contentLength === 0) {
        throw new Error('No audio content available');
      }

      const chunkSize = Math.ceil(contentLength / 10);
      const totalChunks = Math.ceil(contentLength / chunkSize);
      setTotalChunks(totalChunks);

      let loadedChunks: Blob[] = [];
      for (let i = 0; i < totalChunks; i++) {
        if (abortController.signal.aborted) break;
        
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize - 1, contentLength - 1);
        
        const res = await axios.get(
          `${cdnUrl}/audio?courseAudio=${item.href}-audio&language=${audioLanguage}`,
          {
            responseType: "blob",
            signal: abortController.signal,
            headers: { 'Range': `bytes=${start}-${end}` }
          }
        );
        
        loadedChunks[i] = new Blob([res.data], { type: res.headers['content-type'] || "audio/mpeg" });
        setAudioChunks([...loadedChunks]);
        setAudioLoadingProgress(((i + 1) / totalChunks) * 100);

        if (i === 2 || (i === totalChunks - 1)) {
          updateAudioUrl(loadedChunks);
        }
      }
      setIsAudioPlayerVisible(true);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Chunked audio fetch request canceled:', item.href);
      } else {
        console.error("Error fetching audio:", error);
        setAudioUrl(null);
        setIsAudioPlayerVisible(false);
        setAudioChunks([]);
        setCanPlayAudio(false);
      }
    } finally {
      setIsAudioLoading(false);
    }
  };

  const updateAudioUrl = (chunks: Blob[]) => {
    const availableChunks = chunks.filter(Boolean);
    if (availableChunks.length === 0) return;
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    const combinedBlob = new Blob(availableChunks, { type: "audio/mpeg" });
    const url = URL.createObjectURL(combinedBlob);
    setAudioUrl(url);
    
    if (availableChunks.length >= 3 || availableChunks.length === totalChunks) {
      setCanPlayAudio(true);
      setIsAudioPlayerVisible(true);
    }
    setAudioBufferLength(availableChunks.length);
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setAudioCurrentTime(current);
      setAudioProgress((current / duration) * 100);
    }
  };

  const handleAudioPlayPause = () => {
    if (audioRef.current && canPlayAudio) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsAudioPlaying(false);
    setAudioProgress(100);
  };

  const handleAudioCanPlayThrough = () => {
    if (!canPlayAudio) setCanPlayAudio(true);
  };

  const handleAudioWaiting = () => {
  };

  const handleAudioCanPlay = () => {
    if (!canPlayAudio) setCanPlayAudio(true);
  };

  const handleAudioSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (parseFloat(e.target.value) / 100) * audioDuration;
      audioRef.current.currentTime = newTime;
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setAudioPlaybackRate(rate);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    if (newLanguage === audioLanguage) return;
    
    setAudioLanguage(newLanguage);
    if (selectedItem && selectedItem.href) {
      setTimeout(() => {
        fetchAudioChunked(selectedItem);
      }, 100);
    }
  };

  const handleItemSelect = (item: any) => {
    if(item.name === selectedItem?.name) return;
    setSelectedItem(item);
    if (windowWidth < 768) {
        setIsMobileMenuOpen(false)
    }
  };

  const markLessonCompleted = (item: any) => {
    setSidebarState(prev => {
      const updateProgress = (items: any[]): any[] =>
        items.map(child => {
          if (child.name === item.name && child.href === item.href) {
            return { ...child, progress: 100 };
          }
          if (child.children && child.children.length > 0) {
            return { ...child, children: updateProgress(child.children) };
          }
          return child;
        });
      return updateProgress(prev);
    });
  };

  const countLessons = (items: any[]): number =>
    items.reduce((count, item) => {
      if (item.children && item.children.length > 0) {
        return count + countLessons(item.children);
      }
      if (item.icon !== "certificate") {
        return count + 1;
      }
      return count;
    }, 0);

  const sumProgress = (items: any[]): number =>
    items.reduce((sum, item) => {
      if (item.children && item.children.length > 0) {
        return sum + sumProgress(item.children);
      }
      if (item.icon !== "certificate") {
        return sum + (item.progress || 0);
      }
      return sum;
    }, 0);

  const totalLessons = countLessons(sidebarState);
  const totalProgress = sumProgress(sidebarState);
  const overallProgress = totalLessons > 0 ? Math.round(totalProgress / totalLessons) : 0;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsAudioPlaying(false);
    setAudioProgress(0);
    setAudioCurrentTime(0);
    setAudioDuration(0);
    setIsAudioPlayerVisible(false);
    setIsAudioLoading(false);
    
    if (selectedItem && selectedItem.href) {
      fetchAndShowHtml(selectedItem);
      fetchAudioChunked(selectedItem);
    } else {
      setIframeUrl(null);
      setAudioUrl(null);
      setIsAudioPlayerVisible(false);
      setIsAudioLoading(false);
    }

    return () => {
      if (htmlAbortControllerRef.current) htmlAbortControllerRef.current.abort();
      if (audioAbortControllerRef.current) audioAbortControllerRef.current.abort();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [selectedItem?.href]);

  useEffect(() => {
    if (selectedItem && selectedItem.href && audioUrl) {
      fetchAudioChunked(selectedItem);
    }
  }, [audioLanguage]);

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3;

  const handleZoomIn = () => setZoomLevel(z => Math.min(z + 0.1, MAX_ZOOM));
  const handleZoomOut = () => setZoomLevel(z => Math.max(z - 0.1, MIN_ZOOM));
  const handleResetZoom = () => setZoomLevel(1);

  useEffect(() => {
    if (!iframeUrl) return;
    
    const iframe = isFullscreen ? fullscreenIframeRef.current : mainIframeRef.current;
    if (!iframe) return;

    let frameId: number;
    
    const scrollContent = () => {
      try {
        const doc = iframe.contentWindow?.document;
        if (!doc) return;
        
        const body = doc.body;
        const htmlEl = doc.documentElement;
        const scrollHeight = Math.max(body.scrollHeight, body.offsetHeight, htmlEl.clientHeight, htmlEl.scrollHeight, htmlEl.offsetHeight);
        const clientHeight = htmlEl.clientHeight;
        const maxScroll = Math.max(0, scrollHeight - clientHeight);
        let currentScroll = htmlEl.scrollTop || body.scrollTop;
        
        if (currentScroll < maxScroll) {
          let scrollIncrement = 0;
          
          if (audioAutoScroll && isAudioPlaying && audioDuration > 0) {
            const audioProgressRatio = audioCurrentTime / audioDuration;
            const targetScroll = audioProgressRatio * maxScroll;
            
            const diff = targetScroll - currentScroll;
            scrollIncrement = Math.max(0.5, Math.abs(diff) * 0.1) * Math.sign(diff);
          } else if (autoScroll) {
            scrollIncrement = 1.0 * scrollSpeed;
          }
          
          if (scrollIncrement !== 0) {
            currentScroll += scrollIncrement;
            currentScroll = Math.min(currentScroll, maxScroll);
            htmlEl.scrollTop = body.scrollTop = currentScroll;
            
            if (sidebarState && selectedItem && selectedItem.href && maxScroll > 0) {
              const percent = Math.min(100, Math.round((currentScroll / maxScroll) * 100));
              if (percent > (selectedItem.progress || 0)) {
                setSidebarState(prev => {
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
          }
          
          frameId = requestAnimationFrame(scrollContent);
        }
      } catch (e) {
        console.error('Auto-scroll error:', e);
      }
    };
    
    if (audioAutoScroll || autoScroll) {
      frameId = requestAnimationFrame(scrollContent);
    }
    
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [audioAutoScroll, autoScroll, isAudioPlaying, audioCurrentTime, audioDuration, scrollSpeed, iframeUrl, selectedItem, sidebarState, isFullscreen]);

  if (!isMounted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
                {sidebarState.map((item, index) => {
                  let isUnlocked = false;
                  if (item.icon === "certificate") {
                    isUnlocked = overallProgress > 50;
                  } else if (item.children && item.children.length > 0) {
                    if (index === 0) {
                      isUnlocked = true;
                    } else {
                      const prevItems = sidebarState.slice(0, index);
                      const prevCompleted = prevItems.every(prev =>
                        prev.children && prev.children.length > 0
                          ? prev.children.every((c: any) => (c.progress ?? 0) === 100)
                          : (prev.progress ?? 0) === 100
                      );
                      isUnlocked = prevCompleted;
                    }
                  } else {
                    if (index === 0) {
                      isUnlocked = true;
                    } else {
                      const prevItems = sidebarState.slice(0, index);
                      const prevCompleted = prevItems.every(prev =>
                        prev.children && prev.children.length > 0
                          ? prev.children.every((c: any) => (c.progress ?? 0) === 100)
                          : (prev.progress ?? 0) === 100
                      );
                      isUnlocked = prevCompleted;
                    }
                  }
                  return (
                    <SidebarItem
                        key={item.name}
                        item={item}
                        isUnlocked={isUnlocked}
                        onSelect={handleItemSelect}
                        selectedItem={selectedItem}
                        isCollapsed={isSidebarCollapsed}
                    />
                  );
                })}
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="md:hidden bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 flex-shrink-0 safe-area-inset-top" style={{ height: '10vh', minHeight: '60px' }}>
            <div className="h-full flex items-center justify-between px-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {nextLesson ? (
                  <>
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900">Up Next</p>
                      <p className="text-sm text-slate-700 font-medium truncate">{nextLesson.name}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900">Complete!</p>
                      <p className="text-sm text-slate-700 font-medium">Course Finished</p>
                    </div>
                  </>
                )}
              </div>
              <Button
                size="sm"
                onClick={() => {
                  if (selectedItem) markLessonCompleted(selectedItem);
                  if (nextLesson) {
                    handleItemSelect(nextLesson);
                  } else {
                    router.push("/certificate");
                  }
                }}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-1.5 rounded-lg text-xs flex-shrink-0"
              >
                {nextLesson ? 'Next' : 'Cert'}
                <ArrowRight className="ml-1 w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="flex-1 p-2 md:p-4 lg:p-6 xl:p-8 overflow-hidden pb-safe">
            <Card className="h-full shadow-xl border-0 overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="flex-1 relative">
                  {isFullscreen && (
                    <div className="fixed inset-0 z-50 flex flex-col bg-black">
                      <div className="absolute top-4 right-4 z-[52] flex items-center gap-2">
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="rounded-full shadow-lg bg-black/50 hover:bg-black/70 text-white border-white/20" 
                          onClick={() => setShowFullscreenControls(!showFullscreenControls)}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant={audioAutoScroll ? "default" : "secondary"} 
                          className="rounded-full shadow-lg bg-black/50 hover:bg-black/70 text-white border-white/20" 
                          onClick={() => setAudioAutoScroll(!audioAutoScroll)}
                        >
                          <Music4 className="w-5 h-5" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="rounded-full shadow-lg bg-black/50 hover:bg-black/70 text-white border-white/20" 
                          onClick={() => setIsFullscreen(false)}
                        >
                          <Minimize2 className="w-5 h-5" />
                        </Button>
                      </div>

                      {showFullscreenControls && (
                        <div className="absolute top-16 right-4 z-[52] bg-black/80 backdrop-blur-sm rounded-xl p-3 shadow-xl">
                          <div className="flex flex-col gap-2">
                            <Button 
                              size="icon" 
                              variant={autoScroll ? "default" : "secondary"} 
                              className="rounded-full" 
                              onClick={() => setAutoScroll(!autoScroll)}
                            >
                              <ArrowDownToLine className="w-5 h-5" />
                            </Button>
                            <select 
                              className="rounded-full px-3 py-2 bg-white/90 text-black text-sm border-0 focus:outline-none shadow-lg" 
                              value={scrollSpeed} 
                              onChange={e => setScrollSpeed(Number(e.target.value))}
                            >
                              <option value={0.5}>0.5x</option>
                              <option value={1}>1x</option>
                              <option value={1.5}>1.5x</option>
                              <option value={2}>2x</option>
                              <option value={3}>3x</option>
                            </select>
                            <Button 
                              size="icon" 
                              variant="secondary" 
                              className="rounded-full" 
                              onClick={handleZoomIn}
                            >
                              <ZoomIn className="w-5 h-5" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="secondary" 
                              className="rounded-full" 
                              onClick={handleZoomOut} 
                              disabled={zoomLevel <= MIN_ZOOM}
                            >
                              <ZoomOut className="w-5 h-5" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="secondary" 
                              className="rounded-full" 
                              onClick={handleResetZoom}
                            >
                              <RotateCcw className="w-5 h-5" />
                            </Button>
                            {nextLesson && (
                              <Button 
                                size="icon" 
                                variant="secondary" 
                                className="rounded-full" 
                                onClick={() => {
                                  handleItemSelect(nextLesson);
                                  setIsFullscreen(false);
                                  setAutoScroll(false);
                                  setAudioAutoScroll(false);
                                  setZoomLevel(1);
                                  setShowFullscreenControls(false);
                                }}
                              >
                                <ChevronRight className="w-5 h-5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {audioUrl && isAudioPlayerVisible && (
                        <div className="absolute bottom-4 left-4 right-4 z-[51] bg-black/80 backdrop-blur-sm rounded-xl p-3 text-white shadow-xl">
                          <AudioPlayer
                            isPlaying={isAudioPlaying}
                            progress={audioProgress}
                            currentTime={audioCurrentTime}
                            duration={audioDuration}
                            playbackRate={audioPlaybackRate}
                            audioLanguage={audioLanguage}
                            onPlayPause={handleAudioPlayPause}
                            onSeek={handleAudioSeek}
                            onRateChange={handlePlaybackRateChange}
                            onLanguageChange={handleLanguageChange}
                            onToggleAudioAutoScroll={() => setAudioAutoScroll(!audioAutoScroll)}
                            onToggleAutoScroll={() => setAutoScroll(!autoScroll)}
                            isAudioAutoScrollOn={audioAutoScroll}
                            isAutoScrollOn={autoScroll}
                            lessonName={selectedItem?.name}
                            isCompact={true}
                            onClose={() => setIsAudioPlayerVisible(false)}
                            isAudioLoading={isAudioLoading}
                            audioLoadingProgress={audioLoadingProgress}
                            canPlayAudio={canPlayAudio}
                            audioBufferLength={audioBufferLength}
                          />
                        </div>
                      )}

                      {audioUrl && !isAudioPlayerVisible && (
                        <div className="absolute bottom-6 left-6 z-[52]">
                          <Button 
                            size="icon" 
                            className="rounded-full shadow-xl w-14 h-14 bg-blue-600 hover:bg-blue-700" 
                            onClick={() => setIsAudioPlayerVisible(true)}
                          >
                            <Music4 className="text-white w-6 h-6" />
                          </Button>
                        </div>
                      )}

                      <div className="w-full h-full flex-1 overflow-auto">
                        {iframeUrl && (
                          <iframe
                            ref={fullscreenIframeRef}
                            src={iframeUrl}
                            title={selectedItem?.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              border: 'none',
                              transform: `scale(${zoomLevel})`,
                              transformOrigin: '0 0',
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {!isFullscreen && (
                    <>
                      <div className="absolute top-4 right-4 z-20">
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="rounded-full shadow-lg" 
                          onClick={() => setIsFullscreen(true)}
                        >
                          <Maximize2 className="w-5 h-5" />
                        </Button>
                      </div>
                      
                      {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : iframeUrl ? (
                        <iframe 
                          ref={mainIframeRef} 
                          src={iframeUrl} 
                          className="w-full h-full rounded-xl" 
                          title={selectedItem?.name} 
                          style={{ border: "none", minHeight: "300px" }} 
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full p-8 bg-gradient-to-br from-slate-50 to-blue-50">
                          <div className="text-center max-w-lg">
                            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl"><Play className="w-12 h-12 text-white" /></div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">{selectedItem?.name || "Ready to Learn?"}</h3>
                            <p className="text-slate-600 text-lg leading-relaxed">{selectedItem?.description || "Choose a topic from the sidebar to start your learning journey"}</p>
                          </div>
                        </div>
                      )}

                      {audioUrl && !isAudioPlayerVisible && (
                        <div className="absolute bottom-4 right-4 z-20">
                          <Button 
                            size="icon" 
                            className="rounded-full shadow-lg w-12 h-12 bg-blue-600 hover:bg-blue-700" 
                            onClick={() => setIsAudioPlayerVisible(true)}
                          >
                            <Music4 className="text-white w-5 h-5" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                  
                  {audioUrl && (
                    <audio 
                      key={`${audioUrl}-${audioLanguage}`}
                      ref={audioRef} 
                      src={audioUrl} 
                      onTimeUpdate={handleAudioTimeUpdate} 
                      onLoadedMetadata={handleAudioLoadedMetadata} 
                      onEnded={handleAudioEnded}
                      onPlay={() => setIsAudioPlaying(true)}
                      onPause={() => setIsAudioPlaying(false)}
                      onCanPlay={handleAudioCanPlay}
                      onCanPlayThrough={handleAudioCanPlayThrough}
                      onWaiting={handleAudioWaiting}
                      preload="auto"
                    />
                  )}
                </div>
              </div>
            </Card>
          </div>
          
          {audioUrl && !isFullscreen && isAudioPlayerVisible && (
            <div className="flex-shrink-0 z-30 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg safe-area-inset-bottom" 
                 style={{ 
                   minHeight: windowWidth < 768 ? '90px' : 'auto',
                   paddingBottom: windowWidth < 768 ? 'env(safe-area-inset-bottom)' : '0'
                 }}>
              <div className="p-3 md:p-4">
                <AudioPlayer
                  isPlaying={isAudioPlaying}
                  progress={audioProgress}
                  currentTime={audioCurrentTime}
                  duration={audioDuration}
                  playbackRate={audioPlaybackRate}
                  audioLanguage={audioLanguage}
                  onPlayPause={handleAudioPlayPause}
                  onSeek={handleAudioSeek}
                  onRateChange={handlePlaybackRateChange}
                  onLanguageChange={handleLanguageChange}
                  onToggleAudioAutoScroll={() => setAudioAutoScroll(!audioAutoScroll)}
                  onToggleAutoScroll={() => setAutoScroll(!autoScroll)}
                  isAudioAutoScrollOn={audioAutoScroll}
                  isAutoScrollOn={autoScroll}
                  lessonName={selectedItem?.name}
                  onClose={() => setIsAudioPlayerVisible(false)}
                  isAudioLoading={isAudioLoading}
                  audioLoadingProgress={audioLoadingProgress}
                  canPlayAudio={canPlayAudio}
                  audioBufferLength={audioBufferLength}
                  isMobile={windowWidth < 768}
                />
              </div>
            </div>
          )}

          <div className="hidden md:block bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-200 p-4 md:p-6 flex-shrink-0">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    {nextLesson ? (
                        <>
                            <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl flex items-center justify-center shrink-0"><Clock className="w-6 h-6 text-white" /></div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-900 mb-1">Up Next</p>
                                <p className="text-lg text-slate-700 font-medium truncate">{nextLesson.name}</p>
                            </div>
                        </>
                    ) : (
                         <>
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center shrink-0"><Trophy className="w-6 h-6 text-white" /></div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-900 mb-1">Congratulations!</p>
                                <p className="text-lg text-slate-700 font-medium">Course Complete</p>
                            </div>
                        </>
                    )}
                </div>
                <Button
                  onClick={() => {
                    if (selectedItem) {
                      markLessonCompleted(selectedItem);
                    }
                    if (nextLesson) {
                      handleItemSelect(nextLesson);
                    } else {
                      router.push("/certificate");
                    }
                  }}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 text-base w-full sm:w-auto"
                >
                    {nextLesson ? 'Continue Learning' : 'Claim Certificate'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .safe-area-inset-top { padding-top: env(safe-area-inset-top); }
        .safe-area-inset-bottom { padding-bottom: env(safe-area-inset-bottom); }
        .pb-safe { padding-bottom: calc(90px + env(safe-area-inset-bottom)); }
        
        @media (min-width: 768px) {
          .pb-safe { padding-bottom: 0; }
        }
        
        .slider::-webkit-slider-thumb { 
          appearance: none; height: 16px; width: 16px; border-radius: 50%; 
          background: #3b82f6; cursor: pointer; border: 2px solid white; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.2); 
        }
        .slider::-moz-range-thumb { 
          height: 16px; width: 16px; border-radius: 50%; background: #3b82f6; 
          cursor: pointer; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); 
        }
        .slider-compact::-webkit-slider-thumb { background: #fff; }
        .slider-compact::-moz-range-thumb { background: #fff; }
      `}</style>
    </div>
  )
}