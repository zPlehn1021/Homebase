"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import type { InventoryDocument, DocumentType } from "@/lib/types";

export function DocumentUpload({
  itemId,
  documents,
  onUploaded,
  onDeleted,
}: {
  itemId: number;
  documents: InventoryDocument[];
  onUploaded: () => void;
  onDeleted: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState<DocumentType>("other");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);
      formData.append("type", docType);

      const res = await fetch(`/api/inventory/${itemId}/documents`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      toast.success("Document uploaded");
      onUploaded();
    } catch {
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async (docId: number) => {
    try {
      const res = await fetch(
        `/api/inventory/${itemId}/documents?docId=${docId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Document removed");
      onDeleted();
    } catch {
      toast.error("Failed to remove document");
    }
  };

  const docTypeIcons: Record<string, string> = {
    warranty: "📜",
    manual: "📖",
    receipt: "🧾",
    photo: "🖼️",
    other: "📎",
  };

  return (
    <div>
      <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
        Documents ({documents.length})
      </h3>

      {/* Document list */}
      {documents.length > 0 && (
        <div className="space-y-1.5 mb-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-stone-200"
            >
              <span className="text-sm">
                {doc.mimeType?.includes("pdf")
                  ? "📄"
                  : doc.mimeType?.includes("image")
                    ? "🖼️"
                    : docTypeIcons[doc.type] || "📎"}
              </span>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-sage-700 hover:text-sage-800 truncate flex-1 underline-offset-2 hover:underline"
              >
                {doc.name}
              </a>
              <span className="text-[11px] text-stone-400 capitalize">
                {doc.type}
              </span>
              {doc.fileSize && (
                <span className="text-[11px] text-stone-300">
                  {(doc.fileSize / 1024).toFixed(0)}KB
                </span>
              )}
              <button
                onClick={() => handleDelete(doc.id)}
                className="p-1 rounded hover:bg-rose-50 text-stone-300 hover:text-rose-500"
                aria-label="Delete document"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M3 3l8 8M11 3l-8 8" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload form */}
      <div className="flex items-center gap-2">
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value as DocumentType)}
          className="px-2 py-1.5 rounded-lg border border-stone-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-sage-200"
        >
          <option value="warranty">Warranty</option>
          <option value="manual">Manual</option>
          <option value="receipt">Receipt</option>
          <option value="photo">Photo</option>
          <option value="other">Other</option>
        </select>
        <input
          ref={fileRef}
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
          className="hidden"
          id={`doc-upload-${itemId}`}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-600 hover:bg-stone-50 disabled:opacity-50 transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M7 10V3M4 5.5L7 3l3 2.5M2 10v1a1 1 0 001 1h8a1 1 0 001-1v-1" />
          </svg>
          {uploading ? "Uploading..." : "Upload File"}
        </button>
      </div>
    </div>
  );
}
