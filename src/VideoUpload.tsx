import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface VideoUploadProps {
    onUpload: (files: File[]) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onUpload }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        onUpload(acceptedFiles);
    }, [onUpload]);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag & drop here or click to select files</p>
        </div>
    );
};

export default VideoUpload;