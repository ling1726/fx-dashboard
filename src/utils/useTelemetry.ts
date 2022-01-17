// TODO stub of a telemetry layer
export function useTelemetry(): Telemetry {
  return {
    error: (message: string) => null,
  };
}

export interface Telemetry {
  error: (message: string) => void;
}
