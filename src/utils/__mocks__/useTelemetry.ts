import { Telemetry } from "..";

const mock = {
  error: jest.fn(),
};

export function useTelemetry(): Telemetry {
  return mock;
}
