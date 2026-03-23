"use client";

import { useState, useMemo } from "react";
import { useInventory } from "@/lib/hooks/use-inventory";
import type { InventoryItem, InventoryCategory } from "@/lib/types";
import { InventoryCard } from "@/components/inventory/inventory-card";
import { InventoryCategoryFilter } from "@/components/inventory/inventory-category-filter";
import { AddItemModal } from "@/components/inventory/add-item-modal";
import { EditItemModal } from "@/components/inventory/edit-item-modal";
import { ItemDetailPanel } from "@/components/inventory/item-detail-panel";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export default function InventoryPage() {
  const { items, loading, createItem, updateItem, deleteItem, fetchItems } =
    useInventory();
  const [categoryFilter, setCategoryFilter] =
    useState<InventoryCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addParentId, setAddParentId] = useState<number | undefined>();
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [viewingItemId, setViewingItemId] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    let filtered = items;

    if (categoryFilter) {
      filtered = filtered.filter((i) => i.category === categoryFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.manufacturer?.toLowerCase().includes(q) ||
          i.modelNumber?.toLowerCase().includes(q) ||
          i.location?.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [items, categoryFilter, searchQuery]);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
          Inventory
        </h1>
        <button
          onClick={() => {
            setAddParentId(undefined);
            setShowAddModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-600 text-white text-sm font-medium hover:bg-sage-700 transition-colors shadow-sm"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M8 3v10M3 8h10" />
          </svg>
          Add Item
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="7" cy="7" r="4.5" />
          <path d="M10.5 10.5L14 14" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search inventory..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
        />
      </div>

      {/* Category filter */}
      <InventoryCategoryFilter
        active={categoryFilter}
        onChange={setCategoryFilter}
      />

      {/* Item list */}
      {loading ? (
        <LoadingSkeleton count={5} />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon="📦"
          title={
            searchQuery
              ? "No items match your search"
              : "No inventory items yet"
          }
          description={
            searchQuery
              ? "Try adjusting your search or filters."
              : "Start tracking your home equipment, appliances, and systems."
          }
          action={
            !searchQuery
              ? {
                  label: "Add an Item",
                  onClick: () => {
                    setAddParentId(undefined);
                    setShowAddModal(true);
                  },
                }
              : undefined
          }
        />
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onClick={() => setViewingItemId(item.id)}
            />
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <AddItemModal
          defaultParentId={addParentId}
          onSubmit={async (input) => {
            await createItem(input);
            setShowAddModal(false);
            fetchItems();
          }}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          onSubmit={async (id, input) => {
            await updateItem(id, input);
            setEditingItem(null);
            fetchItems();
          }}
          onClose={() => setEditingItem(null)}
        />
      )}

      {/* Item Detail Panel */}
      {viewingItemId && (
        <ItemDetailPanel
          itemId={viewingItemId}
          onClose={() => setViewingItemId(null)}
          onEdit={(item) => {
            setViewingItemId(null);
            setEditingItem(item);
          }}
          onDelete={async (id) => {
            await deleteItem(id);
            setViewingItemId(null);
            fetchItems();
          }}
          onAddSubItem={(parentId) => {
            setViewingItemId(null);
            setAddParentId(parentId);
            setShowAddModal(true);
          }}
          onViewItem={(id) => setViewingItemId(id)}
        />
      )}
    </div>
  );
}
