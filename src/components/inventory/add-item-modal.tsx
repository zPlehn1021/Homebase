"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { HomebaseSession } from "@/lib/auth.d";
import type {
  CreateInventoryItemInput,
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

export function AddItemModal({
  onSubmit,
  onClose,
  defaultParentId,
}: {
  onSubmit: (input: CreateInventoryItemInput) => void;
  onClose: () => void;
  defaultParentId?: number;
}) {
  const { data: rawSession } = useSession();
  const isPurchased =
    (rawSession as HomebaseSession | null)?.user?.purchaseVerified ?? true;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<InventoryCategory>("interior");
  const [location, setLocation] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchaseCost, setPurchaseCost] = useState("");
  const [condition, setCondition] = useState<ItemCondition | "">("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    toast.success("Item added to inventory");
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      parentId: defaultParentId,
      location: location.trim() || undefined,
      manufacturer: manufacturer.trim() || undefined,
      modelNumber: modelNumber.trim() || undefined,
      serialNumber: serialNumber.trim() || undefined,
      partNumber: partNumber.trim() || undefined,
      purchaseDate: purchaseDate || undefined,
      purchaseCost: purchaseCost ? parseInt(purchaseCost, 10) * 100 : undefined,
      condition: condition || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Add inventory item"
    >
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <FocusTrap onEscape={onClose}>
        <div className="relative w-full max-w-lg bg-cream rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <h2 className="text-lg font-semibold text-stone-800">
              {defaultParentId ? "Add Sub-Item" : "Add Inventory Item"}
            </h2>
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

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-5 space-y-4 max-h-[70vh] overflow-y-auto"
          >
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g., Furnace, Kitchen Faucet Filter"
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="What is this item..."
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300 resize-none"
              />
            </div>

            {/* Category + Condition */}
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

            {/* Location + Manufacturer */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Basement"
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
                  placeholder="e.g., Carrier"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
                />
              </div>
            </div>

            {/* Model + Serial */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  Model Number
                </label>
                <input
                  type="text"
                  value={modelNumber}
                  onChange={(e) => setModelNumber(e.target.value)}
                  placeholder="Model #"
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
                  placeholder="Serial #"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
                />
              </div>
            </div>

            {/* Part Number + Purchase Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1">
                  Part Number
                </label>
                <input
                  type="text"
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  placeholder="Part #"
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

            {/* Purchase Cost */}
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

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Any additional notes..."
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300 resize-none"
              />
            </div>

            {/* Actions */}
            {!isPurchased && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-center justify-between">
                <p className="text-xs text-amber-800">
                  Purchase Homebase to add inventory items.
                </p>
                <Link
                  href="/pricing"
                  className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline"
                >
                  Upgrade
                </Link>
              </div>
            )}
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
                disabled={!isPurchased}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isPurchased
                    ? "bg-sage-600 text-white hover:bg-sage-700"
                    : "bg-stone-200 text-stone-400 cursor-not-allowed"
                }`}
              >
                Add Item
              </button>
            </div>
          </form>
        </div>
      </FocusTrap>
    </div>
  );
}
