import { ArrowDownToLine, Pause, Play, X, Music4, ChevronDown, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

// Language options array
const AUDIO_LANGUAGES = [
  { code: 'english', name: 'English', flag: '🇺🇸' },
  { code: 'malayalam', name: 'Malayalam', flag: '🇮🇳' }
];

function AudioPlayer({
  isPlaying,
  progress,
  currentTime,
  duration,
  playbackRate,
  audioLanguage,
  onPlayPause,
  onSeek,
  onRateChange,
  onLanguageChange,
  onToggleAudioAutoScroll,
  onToggleAutoScroll,
  isAudioAutoScrollOn,
  isAutoScrollOn,
  lessonName,
  isCompact = false,
  onClose,
  isAudioLoading,
  isMobile = false,
}: {
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  playbackRate: number;
  audioLanguage: string;
  onPlayPause: () => void;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRateChange: (rate: number) => void;
  onLanguageChange: (language: string) => void;
  onToggleAudioAutoScroll?: () => void;
  onToggleAutoScroll?: () => void;
  isAudioAutoScrollOn?: boolean;
  isAutoScrollOn?: boolean;
  lessonName?: string;
  isCompact?: boolean;
  onClose?: () => void;
  isAudioLoading?: boolean;
  isMobile?: boolean;
}) {
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentLanguage = AUDIO_LANGUAGES.find(lang => lang.code === audioLanguage) || AUDIO_LANGUAGES[0];

  // Mobile Compact Version
  if (isMobile || isCompact) {
    return (
      <div className="flex items-center gap-2 w-full">
        <Button 
          size="icon" 
          variant={isPlaying ? "default" : "secondary"} 
          className="w-8 h-8 rounded-full flex-shrink-0" 
          onClick={onPlayPause}
          disabled={isAudioLoading}
        >
          {isAudioLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />
          )}
        </Button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-medium truncate">{lessonName}</span>
            <span className="text-xs opacity-75 flex-shrink-0">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={isAudioLoading ? 0 : progress} 
            onChange={onSeek} 
            disabled={isAudioLoading} 
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-compact" 
          />
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Language Selector */}
          <div className="relative">
            <Button 
              size="icon" 
              variant="ghost" 
              className="w-6 h-6 rounded-full text-xs" 
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              disabled={isAudioLoading}
            >
              <span className="text-xs">{currentLanguage.flag}</span>
            </Button>
            
            {showLanguageDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
                {AUDIO_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    className={`block w-full px-3 py-2 text-xs text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2 ${
                      audioLanguage === lang.code ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setShowLanguageDropdown(false);
                    }}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Audio Auto-scroll Button */}
          {onToggleAudioAutoScroll && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="icon" 
                    variant={isAudioAutoScrollOn ? "default" : "ghost"} 
                    className="w-6 h-6 rounded-full" 
                    onClick={onToggleAudioAutoScroll}
                  >
                    <Music4 className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Audio Auto-Scroll</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {/* Manual Auto-scroll Button */}
          {onToggleAutoScroll && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="icon" 
                    variant={isAutoScrollOn ? "default" : "ghost"} 
                    className="w-6 h-6 rounded-full" 
                    onClick={onToggleAutoScroll}
                  >
                    <ArrowDownToLine className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manual Auto-Scroll</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {/* Playback Speed Dropdown */}
          <div className="relative">
            <Button 
              size="sm" 
              variant="ghost" 
              className="px-2 py-1 text-xs h-6 min-w-[35px] flex items-center gap-1" 
              onClick={() => setShowSpeedDropdown(!showSpeedDropdown)}
              disabled={isAudioLoading}
            >
              {playbackRate}x
              <ChevronDown className="w-3 h-3" />
            </Button>
            
            {showSpeedDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[60px]">
                {[0.5, 1, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    className={`block w-full px-3 py-2 text-xs text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                      playbackRate === rate ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                    onClick={() => {
                      onRateChange(rate);
                      setShowSpeedDropdown(false);
                    }}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {onClose && (
            <Button 
              size="icon" 
              variant="ghost" 
              className="w-6 h-6 rounded-full flex-shrink-0" 
              onClick={onClose}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        {/* Click outside to close dropdowns */}
        {(showSpeedDropdown || showLanguageDropdown) && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => {
              setShowSpeedDropdown(false);
              setShowLanguageDropdown(false);
            }}
          />
        )}
      </div>
    );
  }

  // Desktop Version
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
            {/* Language Selector for Desktop */}
            <div className="relative">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="px-2 py-1 text-xs h-7 min-w-[70px] flex items-center gap-1" 
                      onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                      disabled={isAudioLoading}
                    >
                      <span>{currentLanguage.flag}</span>
                      <span className="hidden sm:inline">{currentLanguage.name}</span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Audio Language</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {showLanguageDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px]">
                  {AUDIO_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      className={`block w-full px-3 py-2 text-sm text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2 ${
                        audioLanguage === lang.code ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setShowLanguageDropdown(false);
                      }}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {onToggleAudioAutoScroll && (
              <TooltipProvider><Tooltip><TooltipTrigger asChild>
                 <Button size="icon" variant={isAudioAutoScrollOn ? "default" : "ghost"} className="w-9 h-9 rounded-full" onClick={onToggleAudioAutoScroll}><Music4 className="w-4 h-4" /></Button>
              </TooltipTrigger><TooltipContent><p>Audio Auto-Scroll</p></TooltipContent></Tooltip></TooltipProvider>
            )}
            {onToggleAutoScroll && (
              <TooltipProvider><Tooltip><TooltipTrigger asChild>
                 <Button size="icon" variant={isAutoScrollOn ? "default" : "ghost"} className="w-9 h-9 rounded-full" onClick={onToggleAutoScroll}><ArrowDownToLine className="w-4 h-4" /></Button>
              </TooltipTrigger><TooltipContent><p>Manual Auto-Scroll</p></TooltipContent></Tooltip></TooltipProvider>
            )}
            <div className="flex items-center gap-1">
                {[0.5, 1, 1.5, 2].map(rate => (
                    <Button key={rate} size="sm" variant={playbackRate === rate ? "default" : "ghost"} className="px-2 py-1 text-xs h-7 min-w-[35px]" onClick={() => onRateChange(rate)} disabled={isAudioLoading}>{rate}x</Button>
                ))}
            </div>
            {onClose && <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full" onClick={onClose}><X className="w-4 h-4" /></Button>}
        </div>

        {/* Click outside to close dropdown */}
        {showLanguageDropdown && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowLanguageDropdown(false)}
          />
        )}
    </div>
  )
}

export default AudioPlayer;