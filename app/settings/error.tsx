"use client"; // Error components must be Client Components

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto text-center">
      <h2>An error ocurred:</h2>
      <h3 className="text-error">{error.message}</h3>
      <button className="btn btn-sm" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
