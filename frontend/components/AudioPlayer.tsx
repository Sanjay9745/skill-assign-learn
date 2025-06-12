import { ArrowDownToLine, Pause, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  isAudioLoading, // New prop
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
  isAudioLoading?: boolean; // New prop type
}) {

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isCompact) {
    return (
        <div className="flex items-center gap-2 sm:gap-3 w-full">
          <Button 
            size="icon" 
            variant={isPlaying ? "default" : "secondary"} 
            className="w-8 h-8 rounded-full flex-shrink-0" 
            onClick={onPlayPause}
            disabled={isAudioLoading}
          >
            {isAudioLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : (isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />)}
          </Button>
          <div className="flex-1 min-w-0"> {/* Added min-w-0 for better truncation */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-sm font-medium truncate">{lessonName}</span>
              <span className="text-xs opacity-75 flex-shrink-0">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
            <input type="range" min="0" max="100" value={isAudioLoading ? 0 : progress} onChange={onSeek} disabled={isAudioLoading} className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-compact" />
          </div>
           <div className="flex items-center gap-1 flex-shrink-0">
            {[1, 1.5, 2].map((rate) => (
              <Button key={rate} size="sm" variant={playbackRate === rate ? "default" : "ghost"} className="px-1.5 py-0.5 text-xs h-6 min-w-[28px]" onClick={() => onRateChange(rate)} disabled={isAudioLoading}>{rate}x</Button>
            ))}
             {onClose && (
                <Button size="icon" variant="ghost" className="w-6 h-6 rounded-full ml-1 flex-shrink-0" onClick={onClose}>
                    <X className="w-3 h-3" />
                </Button>
            )}
          </div>
        </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-3">
        <Button 
            size="icon" 
            variant={isPlaying ? "default" : "secondary"} 
            className="w-10 h-10 rounded-full flex-shrink-0" 
            onClick={onPlayPause}
            disabled={isAudioLoading}
        >
            {isAudioLoading ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : (isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />)}
        </Button>
        <div className="w-full flex-1 sm:mx-3">
            <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm font-medium text-gray-700 truncate">{lessonName}</span>
                <span className="text-xs text-gray-500 flex-shrink-0">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
            <input type="range" min="0" max="100" value={isAudioLoading ? 0 : progress} onChange={onSeek} disabled={isAudioLoading} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"/>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
            {onToggleAutoScroll && (
              <TooltipProvider><Tooltip><TooltipTrigger asChild>
                 <Button size="icon" variant={isAutoScrollOn ? "default" : "ghost"} className="w-9 h-9 rounded-full" onClick={onToggleAutoScroll}><ArrowDownToLine className="w-4 h-4" /></Button>
              </TooltipTrigger><TooltipContent><p>Toggle Auto-Scroll</p></TooltipContent></Tooltip></TooltipProvider>
            )}
            <div className="flex items-center gap-1">
                {[0.5, 1, 1.5, 2].map(rate => (
                    <Button key={rate} size="sm" variant={playbackRate === rate ? "default" : "ghost"} className="px-2 py-1 text-xs h-7 min-w-[35px]" onClick={() => onRateChange(rate)} disabled={isAudioLoading}>{rate}x</Button>
                ))}
            </div>
            {onClose && <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full" onClick={onClose}><X className="w-4 h-4" /></Button>}
        </div>
    </div>
  )
}

export default AudioPlayer;