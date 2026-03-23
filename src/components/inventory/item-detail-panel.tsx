"use client";

import { useState, useEffect, useCallback } from "react";
import type { InventoryItem } from "@/lib/types";
import {
  inventoryCategoryIcons,
  inventoryCategoryColors,
  conditionLabels,
  conditionColors,
  formatCurrency,
  formatDateLong,
} from "@/lib/utils";
import { FocusTrap } from "@/components/ui/focus-trap";
import { InventoryCard } from "./inventory-card";
import { DocumentUpload } from "./document-upload";

export function ItemDetailPanel({
  itemId,
  onClose,
  onEdit,
  onDelete,
  onAddSubItem,
  onViewItem,
}: {
  itemId: number;
  onClose: () => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: number) => void;
  onAddSubItem: (parentId: number) => void;
  onViewItem: (id: number) => void;
}) {
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshItem = useCallback(() => {
    fetch(`/api/inventory/${itemId}`)
      .then((res) => res.json())
      .then((data) => setItem(data))
      .catch(() => {});
  }, [itemId]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/inventory/${itemId}`)
      .then((res) => res.json())
      .then((data) => setItem(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [itemId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-2xl bg-cream rounded-2xl border border-stone-200 shadow-xl p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-stone-200 rounded w-1/3" />
            <div className="h-4 bg-stone-100 rounded w-2/3" />
            <div className="h-4 bg-stone-100 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!item) return null;

  const detailFields = [
    { label: "Location", value: item.location },
    { label: "Manufacturer", value: item.manufacturer },
    { label: "Model Number", value: item.modelNumber },
    { label: "Serial Number", value: item.serialNumber },
    { label: "Part Number", value: item.partNumber },
    {
      label: "Purchase Date",
      value: item.purchaseDate ? formatDateLong(item.purchaseDate) : null,
    },
    {
      label: "Purchase Cost",
      value: item.purchaseCost ? formatCurrency(item.purchaseCost) : null,
    },
    {
      label: "Replacement Value",
      value: item.estimatedCost ? formatCurrency(item.estimatedCost) : null,
    },
    {
      label: "Warranty Expires",
      value: item.warrantyExpiration
        ? formatDateLong(item.warrantyExpiration)
        : null,
    },
    {
      label: "Install Date",
      value: item.installDate ? formatDateLong(item.installDate) : null,
    },
  ].filter((f) => f.value);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <FocusTrap onEscape={onClose}>
        <div className="relative w-full max-w-2xl bg-cream rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-xl text-lg ${
                  inventoryCategoryColors[item.category]
                } border`}
              >
                {inventoryCategoryIcons[item.category]}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-stone-800">
                  {item.name}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 capitalize">
                    {item.category}
                  </span>
                  {item.condition && (
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${
                        conditionColors[item.condition]
                      }`}
                    >
                      {conditionLabels[item.condition]}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(item)}
                className="p-2 rounded-lg hover:bg-stone-100 text-stone-400"
                aria-label="Edit"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11.5 2.5l2 2L5 13H3v-2l8.5-8.5z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this item and all its sub-items?")) {
                    onDelete(item.id);
                    onClose();
                  }
                }}
                className="p-2 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-500"
                aria-label="Delete"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v8a1 1 0 001 1h4a1 1 0 001-1V4" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-stone-100 text-stone-400"
                aria-label="Close"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M4 4l10 10M14 4L4 14" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 max-h-[70vh] overflow-y-auto space-y-5">
            {/* Description */}
            {item.description && (
              <p className="text-sm text-stone-600">{item.description}</p>
            )}

            {/* Detail fields */}
            {detailFields.length > 0 && (
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {detailFields.map((f) => (
                  <div key={f.label}>
                    <dt className="text-[11px] font-medium text-stone-400 uppercase tracking-wide">
                      {f.label}
                    </dt>
                    <dd className="text-sm text-stone-700 mt-0.5 font-mono">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </div>
            )}

            {/* Custom fields */}
            {item.customFields && item.customFields.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                  Custom Fields
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {item.customFields.map((f, i) => (
                    <div key={i}>
                      <dt className="text-[11px] font-medium text-stone-400">
                        {f.label}
                      </dt>
                      <dd className="text-sm text-stone-700">{f.value}</dd>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {item.notes && (
              <div>
                <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
                  Notes
                </h3>
                <p className="text-sm text-stone-600 whitespace-pre-wrap">
                  {item.notes}
                </p>
              </div>
            )}

            {/* Sub-items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  Sub-Items ({item.children?.length || 0})
                </h3>
                <button
                  onClick={() => onAddSubItem(item.id)}
                  className="flex items-center gap-1 text-xs font-medium text-sage-600 hover:text-sage-700"
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
                    <path d="M7 3v8M3 7h8" />
                  </svg>
                  Add Sub-Item
                </button>
              </div>
              {item.children && item.children.length > 0 ? (
                <div className="space-y-2">
                  {item.children.map((child) => (
                    <InventoryCard
                      key={child.id}
                      item={child}
                      onClick={() => onViewItem(child.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-400">
                  No sub-items yet. Add components like filters, parts, or
                  accessories.
                </p>
              )}
            </div>

            {/* Documents */}
            <DocumentUpload
              itemId={item.id}
              documents={item.documents || []}
              onUploaded={() => refreshItem()}
              onDeleted={() => refreshItem()}
            />

            {/* Linked Tasks */}
            {item.linkedTasks && item.linkedTasks.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                  Linked Tasks ({item.linkedTasks.length})
                </h3>
                <div className="space-y-1.5">
                  {item.linkedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-stone-200"
                    >
                      <span className="text-sm">
                        {task.completedAt ? "✅" : "📋"}
                      </span>
                      <span className="text-sm text-stone-700 truncate flex-1">
                        {task.title}
                      </span>
                      <span className="text-[11px] text-stone-400 capitalize">
                        {task.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}
