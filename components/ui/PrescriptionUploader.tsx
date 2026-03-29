'use client';
import { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';

interface PrescriptionUploaderProps {
  onUploaded?: (prescriptionId: string) => void;
  className?: string;
}

interface PrescriptionResponse {
  id: string;
  status: string;
  fileUrl: string;
}

export default function PrescriptionUploader({ onUploaded, className }: PrescriptionUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(f.type)) {
      setError('Only JPG, PNG, or PDF files are allowed.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      return;
    }
    setFile(f);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post<ApiResponse<PrescriptionResponse>>(
        '/api/v1/prescriptions',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setUploaded(true);
      onUploaded?.(data.data.id);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {!uploaded ? (
        <>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
              dragging
                ? 'border-primary bg-primary-fixed/20'
                : 'border-outline-variant hover:border-primary hover:bg-surface-container-low'
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText size={24} className="text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium text-on-surface">{file.name}</p>
                  <p className="text-xs text-outline">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="ml-2 text-outline hover:text-error"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload size={32} className="mx-auto text-outline" />
                <p className="text-sm font-medium text-on-surface">Drop your prescription here</p>
                <p className="text-xs text-outline">JPG, PNG, or PDF — max 10MB</p>
              </div>
            )}
          </div>

          {error && <p className="text-xs text-error">{error}</p>}

          {file && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="btn-primary w-full justify-center"
            >
              {uploading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload size={16} />
              )}
              {uploading ? 'Uploading...' : 'Upload Prescription'}
            </button>
          )}
        </>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-tertiary-fixed/20 rounded-xl border border-tertiary/20">
          <CheckCircle size={20} className="text-tertiary flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-on-surface">Prescription uploaded successfully</p>
            <p className="text-xs text-on-surface-variant">Awaiting pharmacist review</p>
          </div>
        </div>
      )}
    </div>
  );
}
