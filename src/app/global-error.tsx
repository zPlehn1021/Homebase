"use client";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9f7f4",
          fontFamily: "system-ui, sans-serif",
          color: "#292524",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "28rem", textAlign: "center" }}>
          <div
            style={{
              width: "4rem",
              height: "4rem",
              margin: "0 auto 1.5rem",
              borderRadius: "1rem",
              background: "#fff1f2",
              border: "1px solid #fecdd3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.75rem",
            }}
          >
            ⚠️
          </div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              color: "#78716c",
              fontSize: "0.875rem",
              marginBottom: "1.5rem",
            }}
          >
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={() => unstable_retry()}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "0.75rem",
              background: "#5e6c51",
              color: "white",
              fontWeight: 600,
              fontSize: "0.875rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
