import React, { useEffect, useState, useRef } from 'react';

interface VideoPlayerProps {
    videos: string[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videos }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [preloadedVideoURLs, setPreloadedVideoURLs] = useState<string[]>([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [videoDurations, setVideoDurations] = useState<number[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const urls = new Array(videos.length).fill('');
        const durations = new Array(videos.length).fill(0);
        let loadedCount = 0;

        videos.forEach((video, index) => {
            fetch(video)
                .then(response => response.blob())
                .then(blob => {
                    urls[index] = URL.createObjectURL(blob);
                    const tempVideo = document.createElement('video');
                    tempVideo.src = urls[index];
                    tempVideo.onloadedmetadata = () => {
                        durations[index] = tempVideo.duration;
                        loadedCount++;
                        if (loadedCount === videos.length) {
                            setTotalDuration(durations.reduce((acc, duration) => acc + duration, 0));
                            setVideoDurations(durations);
                            setPreloadedVideoURLs(urls);
                            if (videoRef.current) {
                                videoRef.current.src = urls[0];
                            }
                        }
                    };
                });
        });
    }, [videos]);

    const togglePlayPause = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!videoRef.current) return;

        const seekTime = (event.target.valueAsNumber / 100) * totalDuration;
        let timeSum = 0;

        for (let i = 0; i < videoDurations.length; i++) {
            if (timeSum + videoDurations[i] > seekTime) {
                setCurrentVideoIndex(i);
                videoRef.current.src = preloadedVideoURLs[i];
                videoRef.current.currentTime = seekTime - timeSum;
                if (isPlaying) {
                    videoRef.current.play();
                }
                break;
            }
            timeSum += videoDurations[i];
        }

        setCurrentTime(seekTime);
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;

        const currentVideoTime = videoRef.current.currentTime;
        const currentTimeSum = videoDurations.slice(0, currentVideoIndex).reduce((a, b) => a + b, 0) + currentVideoTime;
        setCurrentTime(currentTimeSum);

        if (videoRef.current.ended && currentVideoIndex < videos.length - 1) {
            setCurrentVideoIndex(currentVideoIndex + 1);
            videoRef.current.src = preloadedVideoURLs[currentVideoIndex + 1];
            if (isPlaying) {
                videoRef.current.play();
            }
        }
    };

    return (
        <div>
            <video
                ref={videoRef}
                width="375"
                height="667"
                onTimeUpdate={handleTimeUpdate}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
            <div>
                <button onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={totalDuration ? (currentTime / totalDuration) * 100 : 0}
                    onChange={handleSeek}
                    style={{ width: '100%' }}
                />
            </div>
        </div>
    );
};

export default VideoPlayer;