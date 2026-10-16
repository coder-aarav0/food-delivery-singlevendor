'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Upload,
  Link as LinkIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export interface ImagePreset {
  label: string;
  url: string;
}

export interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  placeholder?: string;
  folder?: 'products' | 'categories' | 'banners' | 'stores';
  recommendedSize?: string;
  presets?: ImagePreset[];
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  className?: string;
}

export function ImageUploader({
  value,
  onChange,
  label = 'Product Image',
  description,
  placeholder = 'https://images.unsplash.com/... or paste image URL',
  folder = 'products',
  recommendedSize = '800 × 800px (JPG, PNG, WebP up to 10MB)',
  presets,
  aspectRatio = 'square',
  className = '',
}: ImageUploaderProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WebP, GIF)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size must be under 10MB');
      return;
    }

    setErrorMsg(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }

      onChange(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setErrorMsg(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'banner':
        return 'aspect-[21/9] max-h-48';
      case 'video':
        return 'aspect-video max-h-56';
      case 'square':
        return 'aspect-square max-h-48';
      default:
        return 'aspect-auto max-h-52';
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          {label && (
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              {label}
            </label>
          )}
          {description && (
            <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
          )}
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              mode === 'upload'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              mode === 'url'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-indigo-600" />
            <span>Paste URL</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span className="flex-1">{errorMsg}</span>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-rose-500 hover:text-rose-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Live Image Preview (When Image Exists) */}
      {value ? (
        <div className="relative rounded-2xl border border-slate-200 bg-slate-50/80 p-3 shadow-xs">
          <div className="flex items-start gap-3.5">
            {/* Preview Thumbnail */}
            <div
              className={`relative rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 w-28 ${getAspectRatioClass()}`}
            >
              <Image
                src={value}
                alt={label || 'Uploaded preview'}
                fill
                unoptimized={value.startsWith('http') || value.startsWith('/uploads')}
                className="object-cover"
              />
            </div>

            {/* Image Details & Actions */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Active Image
                </span>
                {value.startsWith('/uploads') ? (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                    Device Upload
                  </span>
                ) : value.includes('res.cloudinary.com') ? (
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                    Cloudinary CDN
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
                    External Link
                  </span>
                )}
              </div>

              <p className="text-xs font-mono text-slate-600 truncate max-w-full" title={value}>
                {value}
              </p>

              <div className="flex items-center gap-2 pt-1">
                {/* Change Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (mode === 'upload') {
                      fileInputRef.current?.click();
                    } else {
                      const input = document.getElementById(`url-input-${folder}`);
                      input?.focus();
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition shadow-xs"
                >
                  Change Image
                </button>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Remove</span>
                </button>

                {/* Open Full Preview in Tab */}
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  title="Open full image in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Input Mode 1: Device File Upload Dropzone */}
      {mode === 'upload' && !value ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all select-none ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
                : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/70 bg-white'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-4 space-y-2">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <span className="text-xs font-bold text-slate-700">
                  Uploading image to server...
                </span>
                <span className="text-[10px] text-slate-400">Please wait</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                  <Upload className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Click to upload from device, or drag & drop
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Recommended: {recommendedSize}
                  </span>
                </div>
                <div className="pt-1">
                  <span className="inline-block px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition">
                    Browse File
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Input Mode 2: Direct URL Input Field */}
      {mode === 'url' && !value ? (
        <div className="space-y-2">
          <div className="relative">
            <input
              id={`url-input-${folder}`}
              type="url"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </div>
          <p className="text-[11px] text-slate-500">
            Paste any direct image link from Unsplash, Cloudinary, AWS S3, or your CDN.
          </p>
        </div>
      ) : null}

      {/* Quick Sample Presets (Optional) */}
      {presets && presets.length > 0 && !value && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Quick Presets:
          </span>
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.url)}
              className="text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-indigo-600 px-2.5 py-1 rounded-lg transition"
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
