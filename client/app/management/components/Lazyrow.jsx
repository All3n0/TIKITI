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
  const containerRef = useRef();

  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { 
        root: containerRef.current,
        threshold: 0.1 
      }
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
    <div className="relative">
      {items.length === 0 && !loading ? (
        <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
      ) : (
        <>
          <div 
            ref={containerRef}
            className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide"
          >
            {items.map((item) => renderItem(item))}
            
            {/* Loading trigger */}
            <div ref={observerRef} className="w-1 h-1 flex-shrink-0"></div>
            
            {/* Loading spinner */}
            {loading && (
              <div className="flex-shrink-0 w-72 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              </div>
            )}
          </div>
          
          {!hasMore && items.length > 0 && (
            <div className="text-center pt-2 text-sm text-gray-400">
              No more events to show
            </div>
          )}
        </>
      )}
    </div>
  );
}