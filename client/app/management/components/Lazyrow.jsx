"use client";
import { useEffect, useRef } from "react";

export default function LazyRow({
  items,
  loading,
  hasMore,
  onLoadMore,
  renderItem,
  emptyMessage = "No items found",
}) {
  const observerRef = useRef();
  const loadingRef = useRef();

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading, hasMore, onLoadMore]);

  return (
    <div className="space-y-4">
      {items.length === 0 && !loading ? (
        <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => renderItem(item))}
          </div>

          <div ref={observerRef} className="h-1"></div>

          {loading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          )}

          {!hasMore && items.length > 0 && (
            <div className="text-center py-4 text-gray-500">
              No more items to load
            </div>
          )}
        </>
      )}
    </div>
  );
}