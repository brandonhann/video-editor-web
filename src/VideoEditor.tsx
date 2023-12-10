import React, { useState } from 'react';
import VideoUpload from './VideoUpload';
import VideoPlayer from './VideoPlayer';

const VideoEditor = () => {
    const [videos, setVideos] = useState<string[]>([]);

    const handleUpload = (newVideos: File[]) => {
        const videoUrls = newVideos.map(file => URL.createObjectURL(file));
        setVideos([...videos, ...videoUrls]);
    };

    return (
        <div>
            <VideoUpload onUpload={handleUpload} />
            <VideoPlayer videos={videos} />
        </div>
    );
};

export default VideoEditor;