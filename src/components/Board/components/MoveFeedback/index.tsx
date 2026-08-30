import { useEffect, useState } from "react";

import type { MoveFeedback as Feedback } from "../../useBoard";

interface MoveFeedbackProps {
  feedback: Feedback | null;
}

const VISIBLE_MS = 1000;

export function MoveFeedback({ feedback }: MoveFeedbackProps) {
  const [expired, setExpired] = useState<Feedback | null>(null);

  useEffect(() => {
    if (!feedback) return;

    const timer = setTimeout(() => setExpired(feedback), VISIBLE_MS);

    return () => clearTimeout(timer);
  }, [feedback]);

  const shown = feedback === expired ? null : feedback;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed top-6 right-6 z-10"
    >
      {shown && (
        <p
          className={`rounded-lg border bg-white px-4 py-3 text-sm shadow-md ${
            shown.kind === "error"
              ? "border-danger text-danger"
              : "border-success text-success"
          }`}
        >
          {shown.message}
        </p>
      )}
    </div>
  );
}
