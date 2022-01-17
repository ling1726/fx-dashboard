import React from "react";

// TODO stub of a telemetry layer
export function useTelemetry(): Telemetry {
  return React.useMemo(
    () => ({
      error: (message: string) => {
        if (
          process.env.NODE_ENV !== "production" &&
          process.env.NODE_ENV !== "test"
        ) {
          console.error(message);
        }
      },
    }),
    []
  );
}

export interface Telemetry {
  error: (message: string) => void;
}
