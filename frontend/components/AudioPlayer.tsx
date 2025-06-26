import { ArrowDownToLine, Pause, Play, X, Music4, ChevronDown, Languages, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useRef, useEffect } from "react";

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
  audioLoadingProgress = 0, // Provide default value
  canPlayAudio = true, // New prop to indicate if audio can be played
  audioBufferLength = 0, // New prop to show buffer status
  isMobile = false,
  isCollapsed = false, // New prop to control collapsed state
  onExpand, // New prop to handle expanding from collapsed state
  isInFullscreenIframe = false, // New prop to detect iframe fullscreen
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
  audioLoadingProgress?: number; // Keep as optional
  canPlayAudio?: boolean;
  audioBufferLength?: number;
  isMobile?: boolean;
  isCollapsed?: boolean; // New optional prop
  onExpand?: () => void; // New optional prop
  isInFullscreenIframe?: boolean; // New optional prop
}) {
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const speedDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (speedDropdownRef.current && !speedDropdownRef.current.contains(event.target as Node)) {
        setShowSpeedDropdown(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentLanguage = AUDIO_LANGUAGES.find(lang => lang.code === audioLanguage) || AUDIO_LANGUAGES[0];

  // Collapsed Audio Icon State
  if (isCollapsed && onExpand) {
    return (
      <div className="fixed bottom-8 right-4 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="default" 
                className={`w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ${
                  isInFullscreenIframe 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                onClick={onExpand}
              >
                <Volume2 className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className={isInFullscreenIframe ? 'text-white' : ''}>Open Audio Player</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  // Enhanced Mobile Compact Version
  if (isMobile || isCompact) {
    return (
      <div className={`flex items-center gap-2 w-full ${isInFullscreenIframe ? 'text-white' : ''}`}>
        <Button 
          size="icon" 
          variant={isPlaying ? "default" : "secondary"} 
          className={`w-10 h-10 rounded-full flex-shrink-0 ${
            isInFullscreenIframe ? 'bg-white/20 text-white hover:bg-white/30 border-white/30' : ''
          }`}
          onClick={onPlayPause}
          disabled={isAudioLoading || !canPlayAudio}
        >
          {isAudioLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />
          )}
        </Button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className={`text-sm font-medium truncate ${
              isInFullscreenIframe ? 'text-white' : 'text-gray-800'
            }`}>{lessonName}</span>
            <span className={`text-xs opacity-75 flex-shrink-0 ${
              isInFullscreenIframe ? 'text-white/80' : 'text-gray-600'
            }`}>
              {(isAudioLoading && audioLoadingProgress !== undefined && audioLoadingProgress < 100) ? (
                <span className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    isInFullscreenIframe ? 'bg-white' : 'bg-green-500'
                  }`}></div>
                  {Math.round(audioLoadingProgress)}%
                </span>
              ) : (
                `${formatTime(currentTime)} / ${formatTime(duration)}`
              )}
            </span>
          </div>
          <div className="relative">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={isAudioLoading ? 0 : progress} 
              onChange={onSeek} 
              disabled={isAudioLoading || !canPlayAudio} 
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer slider-compact ${
                isInFullscreenIframe ? 'bg-white/20' : 'bg-gray-300'
              }`}
              style={{ 
                background: isInFullscreenIframe 
                  ? `linear-gradient(to right, #ffffff 0%, #ffffff ${isAudioLoading ? 0 : progress}%, rgba(255,255,255,0.3) ${isAudioLoading ? 0 : progress}%, rgba(255,255,255,0.3) 100%)`
                  : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${isAudioLoading ? 0 : progress}%, #d1d5db ${isAudioLoading ? 0 : progress}%, #d1d5db 100%)`
              }}
            />
            {/* Buffer progress indicator */}
            {(isAudioLoading && audioLoadingProgress !== undefined && audioLoadingProgress < 100) && (
              <div 
                className={`absolute top-0 left-0 h-2 rounded-lg transition-all duration-300 ${
                  isInFullscreenIframe ? 'bg-white/40' : 'bg-blue-300/60'
                }`}
                style={{ width: `${audioLoadingProgress}%` }}
              />
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Language Selector - Position dropdown above */}
          <div className="relative" ref={languageDropdownRef}>
            <Button 
              size="icon" 
              variant="ghost" 
              className={`w-8 h-8 rounded-full text-sm ${
                isInFullscreenIframe ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-100'
              }`}
              onClick={() => {
                setShowLanguageDropdown(!showLanguageDropdown);
                setShowSpeedDropdown(false);
              }}
              disabled={isAudioLoading}
            >
              <span className="text-sm">{currentLanguage.flag}</span>
            </Button>
            
            {showLanguageDropdown && (
              <div className={`absolute bottom-full right-0 mb-2 border rounded-lg shadow-xl z-[60] min-w-[130px] overflow-hidden ${
                isInFullscreenIframe ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
              }`}>
                {AUDIO_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    className={`block w-full px-3 py-2.5 text-sm text-left transition-colors flex items-center gap-2 ${
                      isInFullscreenIframe 
                        ? `hover:bg-gray-700 ${audioLanguage === lang.code ? 'bg-gray-700 text-blue-400 font-medium' : 'text-white'}`
                        : `hover:bg-gray-50 ${audioLanguage === lang.code ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`
                    }`}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setShowLanguageDropdown(false);
                    }}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.name}</span>
                    {audioLanguage === lang.code && (
                      <div className={`ml-auto w-2 h-2 rounded-full ${
                        isInFullscreenIframe ? 'bg-blue-400' : 'bg-blue-600'
                      }`}></div>
                    )}
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
                    className={`w-8 h-8 rounded-full ${
                      isInFullscreenIframe && !isAudioAutoScrollOn ? 'hover:bg-white/20 text-white' : ''
                    }`}
                    onClick={onToggleAudioAutoScroll}
                  >
                    <Music4 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className={isInFullscreenIframe ? 'text-white' : ''}>Audio Auto-Scroll</p>
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
                    className={`w-8 h-8 rounded-full ${
                      isInFullscreenIframe && !isAutoScrollOn ? 'hover:bg-white/20 text-white' : ''
                    }`}
                    onClick={onToggleAutoScroll}
                  >
                    <ArrowDownToLine className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className={isInFullscreenIframe ? 'text-white' : ''}>Manual Auto-Scroll</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {/* Playback Speed Dropdown - Position dropdown above */}
          <div className="relative" ref={speedDropdownRef}>
            <Button 
              size="sm" 
              variant="ghost" 
              className={`px-2 py-1 text-xs h-8 min-w-[40px] flex items-center gap-1 ${
                isInFullscreenIframe ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-100'
              } ${(isAudioLoading || !canPlayAudio) ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => {
                if (isAudioLoading || !canPlayAudio) return;
                setShowSpeedDropdown(!showSpeedDropdown);
                setShowLanguageDropdown(false);
              }}
              disabled={isAudioLoading || !canPlayAudio}
            >
              {playbackRate}x
              <ChevronDown className="w-3 h-3" />
            </Button>
            
            {showSpeedDropdown && !isAudioLoading && canPlayAudio && (
              <div className={`absolute bottom-full right-0 mb-2 border rounded-lg shadow-xl z-[60] min-w-[70px] overflow-hidden ${
                isInFullscreenIframe ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
              }`}>
                {[0.5, 1, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    className={`block w-full px-3 py-2.5 text-sm text-center transition-colors ${
                      isInFullscreenIframe 
                        ? `hover:bg-gray-700 ${playbackRate === rate ? 'bg-gray-700 text-blue-400 font-medium' : 'text-white'}`
                        : `hover:bg-gray-50 ${playbackRate === rate ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`
                    }`}
                    onClick={() => {
                      if (!isAudioLoading && canPlayAudio) {
                        onRateChange(rate);
                        setShowSpeedDropdown(false);
                      }
                    }}
                    disabled={isAudioLoading || !canPlayAudio}
                  >
                    {rate}x
                    {playbackRate === rate && (
                      <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full ${
                        isInFullscreenIframe ? 'bg-blue-400' : 'bg-blue-600'
                      }`}></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {onClose && (
            <Button 
              size="icon" 
              variant="ghost" 
              className={`w-8 h-8 rounded-full flex-shrink-0 ${
                isInFullscreenIframe ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-100'
              }`}
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Enhanced Desktop Version
  return (
    <div className={`max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 ${
      isInFullscreenIframe ? 'text-white' : ''
    }`}>
      <Button 
        size="icon" 
        variant={isPlaying ? "default" : "secondary"} 
        className={`w-12 h-12 rounded-full flex-shrink-0 shadow-sm ${
          isInFullscreenIframe ? 'bg-white/20 text-white hover:bg-white/30 border-white/30' : ''
        }`}
        onClick={onPlayPause}
        disabled={isAudioLoading || !canPlayAudio}
      >
        {isAudioLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        ) : (
          isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />
        )}
      </Button>
      
      <div className="w-full flex-1 sm:mx-4">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className={`text-base font-medium truncate ${
            isInFullscreenIframe ? 'text-white' : 'text-gray-800'
          }`}>{lessonName}</span>
          <span className={`text-sm flex-shrink-0 ${
            isInFullscreenIframe ? 'text-white/80' : 'text-gray-500'
          }`}>
            {(isAudioLoading && audioLoadingProgress !== undefined && audioLoadingProgress < 100) ? (
              <span className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  isInFullscreenIframe ? 'bg-white' : 'bg-green-500'
                }`}></div>
                Loading {Math.round(audioLoadingProgress)}%
              </span>
            ) : (
              `${formatTime(currentTime)} / ${formatTime(duration)}`
            )}
          </span>
        </div>
        <div className="relative">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={isAudioLoading ? 0 : progress} 
            onChange={onSeek} 
            disabled={isAudioLoading || !canPlayAudio} 
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer slider ${
              isInFullscreenIframe ? 'bg-white/20' : 'bg-gray-200'
            }`}
            style={{ 
              background: isInFullscreenIframe 
                ? `linear-gradient(to right, #ffffff 0%, #ffffff ${isAudioLoading ? 0 : progress}%, rgba(255,255,255,0.3) ${isAudioLoading ? 0 : progress}%, rgba(255,255,255,0.3) 100%)`
                : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${isAudioLoading ? 0 : progress}%, #e5e7eb ${isAudioLoading ? 0 : progress}%, #e5e7eb 100%)`
            }}
          />
          {/* Buffer progress indicator */}
          {(isAudioLoading && audioLoadingProgress !== undefined && audioLoadingProgress < 100) && (
            <div 
              className={`absolute top-0 left-0 h-2 rounded-lg transition-all duration-300 ${
                isInFullscreenIframe ? 'bg-white/40' : 'bg-blue-300/50'
              }`}
              style={{ width: `${audioLoadingProgress}%` }}
            />
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Language Selector for Desktop */}
        <div className="relative" ref={languageDropdownRef}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className={`px-3 py-2 text-sm h-9 min-w-[90px] flex items-center gap-2 ${
                    isInFullscreenIframe ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setShowLanguageDropdown(!showLanguageDropdown);
                    setShowSpeedDropdown(false);
                  }}
                  disabled={isAudioLoading}
                >
                  <span>{currentLanguage.flag}</span>
                  <span className="hidden sm:inline">{currentLanguage.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className={isInFullscreenIframe ? 'text-white' : ''}>Audio Language</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {showLanguageDropdown && (
            <div className={`absolute bottom-full right-0 mb-2 border rounded-lg shadow-xl z-50 min-w-[160px] overflow-hidden ${
              isInFullscreenIframe ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
            }`}>
              {AUDIO_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  className={`block w-full px-4 py-3 text-sm text-left transition-colors flex items-center gap-3 ${
                    isInFullscreenIframe 
                      ? `hover:bg-gray-700 ${audioLanguage === lang.code ? 'bg-gray-700 text-blue-400 font-medium' : 'text-white'}`
                      : `hover:bg-gray-50 ${audioLanguage === lang.code ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`
                  }`}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setShowLanguageDropdown(false);
                  }}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                  {audioLanguage === lang.code && (
                    <div className={`ml-auto w-2 h-2 rounded-full ${
                      isInFullscreenIframe ? 'bg-blue-400' : 'bg-blue-600'
                    }`}></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Auto-scroll Buttons */}
        {onToggleAudioAutoScroll && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  variant={isAudioAutoScrollOn ? "default" : "ghost"} 
                  className={`w-10 h-10 rounded-full ${
                    isInFullscreenIframe && !isAudioAutoScrollOn ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-100'
                  }`}
                  onClick={onToggleAudioAutoScroll}
                >
                  <Music4 className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className={isInFullscreenIframe ? 'text-white' : ''}>Audio Auto-Scroll</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {onToggleAutoScroll && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  variant={isAutoScrollOn ? "default" : "ghost"} 
                  className={`w-10 h-10 rounded-full ${
                    isInFullscreenIframe && !isAutoScrollOn ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-100'
                  }`}
                  onClick={onToggleAutoScroll}
                >
                  <ArrowDownToLine className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className={isInFullscreenIframe ? 'text-white' : ''}>Manual Auto-Scroll</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {/* Playback Speed Buttons */}
        <div className={`flex items-center gap-1 rounded-lg p-1 ${
          isInFullscreenIframe ? 'bg-white/20' : 'bg-gray-100'
        } ${(isAudioLoading || !canPlayAudio) ? 'opacity-50' : ''}`}>
          {[0.5, 1, 1.5, 2].map(rate => (
            <Button 
              key={rate} 
              size="sm" 
              variant={playbackRate === rate ? "default" : "ghost"} 
              className={`px-3 py-1 text-xs h-7 min-w-[40px] rounded-md ${
                isInFullscreenIframe && playbackRate !== rate ? 'text-white hover:bg-white/20' : ''
              }`}
              onClick={() => {
                if (!isAudioLoading && canPlayAudio) {
                  onRateChange(rate);
                }
              }}
              disabled={isAudioLoading || !canPlayAudio}
            >
              {rate}x
            </Button>
          ))}
        </div>
        
        {onClose && (
          <Button 
            size="icon" 
            variant="ghost" 
            className={`w-9 h-9 rounded-full ${
              isInFullscreenIframe ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-100'
            }`}
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default AudioPlayer;