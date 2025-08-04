'use client';

import { useChatbot } from '../chatbot-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Database, Upload } from 'lucide-react';
import { useState } from 'react';

export default function KnowledgePage() {
  const { chatbot, updateChatbot, loading } = useChatbot();
  const [files, setFiles] = useState<FileList | null>(null);

  if (loading || !chatbot) {
    return (
      <div>
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Knowledge Base</h2>
        <p className="text-muted-foreground">
          Upload documents to give your chatbot access to specific information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-green-600" />
            <span>Knowledge Base</span>
          </CardTitle>
          <CardDescription>
            Upload documents to give your chatbot access to specific information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="files" className="text-sm font-medium">Upload New Files</Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="files"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, TXT, DOCX files only</p>
                </div>
                <input
                  id="files"
                  type="file"
                  multiple
                  accept=".pdf,.txt,.docx"
                  onChange={(e) => setFiles(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>
            {files && files.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">New files to upload:</p>
                <ul className="text-sm text-gray-500">
                  {Array.from(files).map((file, index) => (
                    <li key={index}>• {file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 