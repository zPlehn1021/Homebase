"use client";

import { useState } from "react";
import { toast } from "sonner";
import type {
  InventoryItem,
  UpdateInventoryItemInput,
  InventoryCategory,
  ItemCondition,
} from "@/lib/types";
import {
  allInventoryCategories,
  inventoryCategoryIcons,
  allConditions,
  conditionLabels,
} from "@/lib/utils";
import { FocusTrap } from "@/components/ui/focus-trap";

export function EditItemModal({
  item,
  onSubmit,
  onClose,
}: {
  item: InventoryItem;
  onSubmit: (id: number, input: UpdateInventoryItemInput) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description || "");
  const [category, setCategory] = useState<InventoryCategory>(item.category);
  const [location, setLocation] = useState(item.location || "");
  const [manufacturer, setManufacturer] = useState(item.manufacturer || "");
  const [modelNumber, setModelNumber] = useState(item.modelNumber || "");
  const [serialNumber, setSerialNumber] = useState(item.serialNumber || "");
  const [partNumber, setPartNumber] = useState(item.partNumber || "");
  const [purchaseDate, setPurchaseDate] = useState(item.purchaseDate || "");
  const [purchaseCost, setPurchaseCost] = useState(
    item.purchaseCost ? String(item.purchaseCost / 100) : ""
  );
  const [condition, setCondition] = useState<ItemCondition | "">(
    item.condition || ""
  );
  const [notes, setNotes] = useState(item.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updates: UpdateInventoryItemInput = {};
    if (name.trim() !== item.name) updates.name = name.trim();
    if (description.trim() !== (item.description || ""))
      updates.description = description.trim();
    if (category !== item.category) updates.category = category;
    if (location.trim() !== (item.location || ""))
      updates.location = location.trim();
    if (manufacturer.trim() !== (item.manufacturer || ""))
      updates.manufacturer = manufacturer.trim();
    if (modelNumber.trim() !== (item.modelNumber || ""))
      updates.modelNumber = modelNumber.trim();
    if (serialNumber.trim() !== (item.serialNumber || ""))
      updates.serialNumber = serialNumber.trim();
    if (partNumber.trim() !== (item.partNumber || ""))
      updates.partNumber = partNumber.trim();
    if (purchaseDate !== (item.purchaseDate || ""))
      updates.purchaseDate = purchaseDate;
    const newCostCents = purchaseCost ? parseInt(purchaseCost, 10) * 100 : undefined;
    if (newCostCents !== (item.purchaseCost ?? undefined))
      updates.purchaseCost = newCostCents;
    if ((condition || undefined) !== (item.condition ?? undefined))
      updates.condition = condition || undefined;
    if (notes.trim() !== (item.notes || "")) updates.notes = notes.trim();

    if (Object.keys(updates).length === 0) {
      onClose();
      return;
    }

    toast.success("Item updated");
    onSubmit(item.id, updates);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Edit inventory item"
    >
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <FocusTrap onEscape={onClose}>
        <div className="relative w-full max-w-lg bg-cream rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <h2 className="text-lg font-semibold text-stone-800">Edit Item</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-stone-100 text-stone-400"
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

          <form
            onSubmit={handleSubmit}
            className="p-5 space-y-4 max-h-[70vh] overflow-y-auto"
          >
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as InventoryCategory)
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
                >
                  {allInventoryCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {inventoryCategoryIcons[cat]}{" "}
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) =>
                    setCondition(e.target.value as ItemCondition | "")
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
                >
                  <option value="">Select...</option>
                  {allConditions.map((c) => (
                    <option key={c} value={c}>
                      {conditionLabels[c]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  Manufacturer
                </label>
                <input
                  type="text"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  Model Number
                </label>
                <input
                  type="text"
                  value={modelNumber}
                  onChange={(e) => setModelNumber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  Part Number
                </label>
                <input
                  type="text"
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
                />
              </div>
            </div>

            <div className="w-1/2 pr-1.5">
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Purchase Cost
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">
                  $
                </span>
                <input
                  type="number"
                  value={purchaseCost}
                  onChange={(e) => setPurchaseCost(e.target.value)}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300 resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 rounded-xl bg-sage-600 text-white text-sm font-medium hover:bg-sage-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </FocusTrap>
    </div>
  );
}
