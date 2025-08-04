'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase'; // Import the supabase client

interface FileUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  userId: string;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  description?: string;
}

export function FileUpload({
  onUpload,
  currentUrl,
  userId,
  accept = 'image/*',
  maxSize = 5,
  label = 'Upload Image',
  description = 'Upload an image file'
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize * 1024 * 1024) {
      alert(`File too large. Maximum size is ${maxSize}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      // Get the user's session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated for upload.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        headers: {
            // Send the token in the Authorization header
            'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      onUpload(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Please try again.'}`);
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
            onClick={handleRemove}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <ImageIcon className="w-8 h-8 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">Upload</span>
          </label>
        </div>
      )}

      <Input
        ref={fileInputRef}
        id="file-upload"
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        {description}. Max size: {maxSize}MB
      </p>

      {uploading && (
        <p className="text-sm text-blue-600">Uploading...</p>
      )}
    </div>
  );
}
