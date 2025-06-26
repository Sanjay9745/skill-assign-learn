import React from 'react';
import { Play, Pause, Volume2, X, Settings, ArrowDownToLine, Music4, FastForward, Rewind } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
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
  isDarkMode?: boolean;
  onClose?: () => void;
  isAudioLoading?: boolean;
  audioLoadingProgress?: number;
  canPlayAudio?: boolean;
  audioBufferLength?: number;
  isMobile?: boolean;
}

export default function AudioPlayer({
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
  isCompact,
  isDarkMode,
  onClose,
  isAudioLoading,
  audioLoadingProgress = 0,
  canPlayAudio = true,
  audioBufferLength = 0,
  isMobile,
}: AudioPlayerProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const renderPlaybackRateOptions = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    return rates.map(rate => (
      <button
        key={rate}
        onClick={() => onRateChange(rate)}
        className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          rate === playbackRate 
            ? isDarkMode 
              ? "bg-white text-black" 
              : "bg-blue-600 text-white" 
            : isDarkMode 
              ? "bg-gray-800 text-white hover:bg-gray-700" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
      >
        {rate}x
      </button>
    ));
  };

  const renderLanguageOptions = () => {
    const languages = ['english', 'spanish', 'french', 'german', 'chinese', 'hindi', 'japanese'];
    return languages.map(language => (
      <button
        key={language}
        onClick={() => onLanguageChange(language)}
        className={cn(
          "px-2 py-1 rounded-full text-xs font-medium capitalize",
          language === audioLanguage 
            ? isDarkMode 
              ? "bg-white text-black" 
              : "bg-blue-600 text-white" 
            : isDarkMode 
              ? "bg-gray-800 text-white hover:bg-gray-700" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        )}
      >
        {language}
      </button>
    ));
  };

  const renderCompactPlayer = () => (
    <div className="flex flex-col space-y-3 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            className={cn(
              "w-9 h-9 rounded-full shadow",
              isPlaying ? "bg-white text-blue-600" : "bg-blue-600 text-white"
            )}
            onClick={onPlayPause}
            disabled={!canPlayAudio || isAudioLoading}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <div className="text-white">
            <div className="text-sm font-medium">{lessonName ? lessonName.substring(0, 30) + (lessonName.length > 30 ? '...' : '') : 'Audio'}</div>
            <div className="text-xs opacity-80">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/10 rounded-full h-8 w-8"
            onClick={onToggleAudioAutoScroll}
          >
            <Music4 className={cn("h-4 w-4", isAudioAutoScrollOn ? "text-blue-400" : "text-white/80")} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/10 rounded-full h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="w-full relative h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 bottom-0 bg-blue-500"
          style={{ width: `${progress}%` }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={onSeek}
          className="absolute inset-0 w-full cursor-pointer opacity-0"
        />
      </div>
      
      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
        {renderPlaybackRateOptions()}
      </div>
    </div>
  );

  const renderFullPlayer = () => (
    <div className={cn("flex flex-col space-y-4 w-full", isDarkMode ? "text-white" : "text-gray-800")}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className={cn("text-sm sm:text-base font-medium truncate", isDarkMode ? "text-white" : "text-gray-900")}>
            {lessonName || 'Audio Player'}
          </h3>
          {isAudioLoading && (
            <div className="flex items-center gap-2">
              <div className="text-xs font-medium text-blue-600">Loading audio... {Math.round(audioLoadingProgress)}%</div>
              <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${audioLoadingProgress}%` }}></div>
              </div>
            </div>
          )}
        </div>
        {onClose && (
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            className={cn(
              "rounded-full",
              isPlaying ? "bg-blue-100 text-blue-600" : "bg-blue-600 text-white"
            )}
            onClick={onPlayPause}
            disabled={!canPlayAudio || isAudioLoading}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
        </div>
        
        <div className="flex-1 space-y-1.5">
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 bg-blue-600"
              style={{ width: `${progress}%` }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={onSeek}
              className={cn("slider absolute inset-0 w-full cursor-pointer opacity-0", isCompact && "slider-compact")}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className={isDarkMode ? "text-white/70" : ""}>{formatTime(currentTime)}</span>
            <span className={isDarkMode ? "text-white/70" : ""}>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className={cn("text-xs font-medium", isDarkMode ? "text-white/70" : "text-gray-500")}>Speed</div>
          <div className="flex flex-wrap gap-1">
            {renderPlaybackRateOptions()}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className={cn("text-xs font-medium", isDarkMode ? "text-white/70" : "text-gray-500")}>Auto-scroll</div>
          <div className="flex gap-1">
            <button
              onClick={onToggleAudioAutoScroll}
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                isAudioAutoScrollOn 
                  ? isDarkMode 
                    ? "bg-white text-black" 
                    : "bg-blue-600 text-white" 
                  : isDarkMode 
                    ? "bg-gray-800 text-white hover:bg-gray-700" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <Music4 className="h-3 w-3 inline mr-1" /> Audio sync
            </button>
            <button
              onClick={onToggleAutoScroll}
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                isAutoScrollOn 
                  ? isDarkMode 
                    ? "bg-white text-black" 
                    : "bg-blue-600 text-white" 
                  : isDarkMode 
                    ? "bg-gray-800 text-white hover:bg-gray-700" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <ArrowDownToLine className="h-3 w-3 inline mr-1" /> Auto
            </button>
          </div>
        </div>
      </div>
      
      {!isMobile && (
        <div className="space-y-1">
          <div className={cn("text-xs font-medium", isDarkMode ? "text-white/70" : "text-gray-500")}>Language</div>
          <div className="flex flex-wrap gap-1">
            {renderLanguageOptions()}
          </div>
        </div>
      )}
      
      {isMobile && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className={cn("text-xs font-medium", isDarkMode ? "text-white/70" : "text-gray-500")}>Language</div>
            <select
              className={cn(
                "text-xs px-2 py-1 rounded-md border-0",
                isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-700"
              )}
              value={audioLanguage}
              onChange={e => onLanguageChange(e.target.value)}
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="chinese">Chinese</option>
              <option value="hindi">Hindi</option>
              <option value="japanese">Japanese</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );

  return isCompact ? renderCompactPlayer() : renderFullPlayer();
}