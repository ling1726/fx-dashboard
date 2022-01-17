import { ApiResponse } from "../api";
import parse from "date-fns/parseISO";

export const mockResponse: ApiResponse = {
  institute: 198,
  lastUpdated: parse("2018-11-09T15:07:00.000Z"),
  comparisonDate: parse("2018-11-09T12:45:00.000Z"),
  baseCurrency: "EUR",
  currencies: [
    {
      currency: "ZAR",
      precision: 2,
      nameI18N: "South African Rand",
      exchangeRate: {
        buy: 0.06236357966947303,
        middle: 16.19,
        sell: 0.0611807892321811,
        indicator: 0,
        lastModified: parse("2018-11-08T23:00:00.000Z"),
      },
      flags: ["provided"],
    },
  ],
};

export function useCurrencyData() {
  return [false, mockResponse, false];
}
