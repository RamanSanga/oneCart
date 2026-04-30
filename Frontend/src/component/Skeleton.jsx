import React from "react";

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse bg-white/10 rounded-md ${className}`}
      {...props}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white/5 rounded-4xl p-3 border border-white/10">
      <Skeleton className="aspect-4/5 rounded-3xl" />
      <div className="mt-5 px-2 pb-2 flex flex-col items-center gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
};

export const ProductDetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-24 aspect-3/4 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="flex-1 aspect-3/4 rounded-[40px]" />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-24 w-full" />
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-16 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-16 w-full rounded-full" />
          <Skeleton className="h-16 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
