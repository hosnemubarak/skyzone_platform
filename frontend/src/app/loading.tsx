export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-accent rounded-full animate-spin"></div>
        <p className="mt-4 text-primary font-heading font-medium tracking-wide animate-pulse">
          Loading Sky Zone...
        </p>
      </div>
    </div>
  );
}
