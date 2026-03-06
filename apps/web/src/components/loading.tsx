/**
 * Loading spinner component
 */
export function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg
      role="img"
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * Full-page loading component
 */
export function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner className="mx-auto h-12 w-12 text-blue-600" />
        <p className="mt-4 text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Inline loading component
 */
export function LoadingInline({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-4">
      <Spinner className="h-6 w-6 text-blue-600" />
      <span className="ml-2 text-sm text-gray-600">{message}</span>
    </div>
  );
}

/**
 * Skeleton loader for content placeholders
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}
