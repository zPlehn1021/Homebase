"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAdminAnnouncements } from "@/lib/hooks/use-admin-announcements";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export default function AdminAnnouncementsPage() {
  const { announcements, loading, createAnnouncement, toggleAnnouncement, deleteAnnouncement } =
    useAdminAnnouncements();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setPublishing(true);
    try {
      await createAnnouncement({ title: title.trim(), body: body.trim() });
      toast.success("Announcement published");
      setTitle("");
      setBody("");
    } catch {
      toast.error("Failed to publish");
    } finally {
      setPublishing(false);
    }
  };

  const handleToggle = async (id: number, currentActive: boolean) => {
    try {
      await toggleAnnouncement(id, !currentActive);
      toast.success(currentActive ? "Announcement deactivated" : "Announcement activated");
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAnnouncement(id);
      toast.success("Announcement deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-10">
      {/* Create */}
      <section>
        <h2 className="text-lg font-bold text-stone-900 mb-4">
          Create Announcement
        </h2>
        <form
          onSubmit={handlePublish}
          className="bg-white border border-stone-200 rounded-xl p-5 space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Announcement title"
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">
              Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={3}
              placeholder="What do you want to announce?"
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={publishing || !title.trim() || !body.trim()}
            className="px-4 py-2.5 rounded-xl bg-sage-600 text-white text-sm font-medium hover:bg-sage-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {publishing ? "Publishing..." : "Publish Announcement"}
          </button>
        </form>
      </section>

      {/* List */}
      <section>
        <h2 className="text-lg font-bold text-stone-900 mb-4">
          All Announcements
        </h2>
        {loading ? (
          <LoadingSkeleton count={2} />
        ) : announcements.length === 0 ? (
          <EmptyState
            icon="📢"
            title="No announcements"
            description="Create your first announcement above."
          />
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="bg-white border border-stone-200 rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-stone-800">
                        {a.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          a.active
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-stone-50 text-stone-500 border border-stone-200"
                        }`}
                      >
                        {a.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">{a.body}</p>
                    <p className="text-xs text-stone-400 mt-2">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggle(a.id, a.active)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        a.active
                          ? "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                          : "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                      }`}
                    >
                      {a.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-medium border border-rose-200 hover:bg-rose-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
