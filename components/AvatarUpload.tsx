"use client";

import { useState, useRef, useEffect } from "react";
import { uploadAvatar, getFilesByModelId } from "@/actions/files";

interface Props {
  model: string;
  studentId: number;
  gatewayUrl: string;
  currentFileId?: number;
  currentFileName?: string;
}

export default function AvatarUpload({ model, studentId, gatewayUrl, currentFileId, currentFileName }: Props) {
  const [fileId, setFileId] = useState(currentFileId);
  const [fileName, setFileName] = useState(currentFileName);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileSelect() {
    const file = fileRef.current?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
    setSuccessMsg(null);
  }

  function handleRemove() {
    setFileId(undefined);
    setFileName(undefined);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  useEffect(() => {
    if (!currentFileId) {
      getFilesByModelId(model, studentId).then((files) => {
        if (files.length > 0) {
          const latest = files[0];
          setFileId(latest.id);
          setFileName(latest.fileName);
        }
      }).catch(() => {});
    }
  }, [model, studentId, currentFileId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fileInput = fileRef.current;
    if (!fileInput?.files?.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", fileInput.files[0]);

      const result = await uploadAvatar(model, studentId, formData);
      setFileId(result.id);
      setFileName(result.fileName);
      setPreview(null);
      setSuccessMsg("Avatar actualizado correctamente");
      fileInput.value = "";
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error("Error al subir avatar:", err);
      alert("Error al subir avatar");
    } finally {
      setUploading(false);
    }
  }

  const avatarSrc = preview ?? (fileId ? `${gatewayUrl}/files/${fileId}` : null);

  return (
    <div className="bg-slate-700 rounded-xl shadow-sm border border-slate-600 p-5">
      {successMsg && (
        <div className="mb-4 px-4 py-2 text-sm text-green-300 bg-green-900/30 border border-green-800 rounded-lg text-center">
          {successMsg}
        </div>
      )}
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-slate-600 shadow-sm"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-slate-600 flex items-center justify-center border-4 border-slate-600 shadow-sm">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
          {fileId && !preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 shadow-sm transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
          <label className="w-full cursor-pointer">
            <div className="border-2 border-dashed border-slate-500 rounded-lg py-6 text-center hover:border-blue-400 hover:bg-blue-900/20 transition-colors">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
              <svg className="w-8 h-8 mx-auto text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium text-slate-300">
                {preview ? "Cambiar imagen" : "Seleccionar imagen"}
              </p>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG, GIF</p>
            </div>
          </label>

          {preview && (
            <div className="text-sm text-slate-300 bg-slate-600 rounded-md px-3 py-1.5 truncate max-w-full border border-slate-500">
              {fileRef.current?.files?.[0]?.name}
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !preview}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Subiendo...
              </span>
            ) : "Subir Avatar"}
          </button>
        </form>
      </div>
    </div>
  );
}
