import * as React from "react";
import parseISO from "date-fns/parseISO";

export function useCurrencyData() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(true);
  const [data, setData] = React.useState<ApiResponse | undefined>(undefined);

  React.useEffect(() => {
    const fetch = async () => {
      try {
        const data = await fetchCurrencyData();
        setLoading(false);
        setError(false);
        setData(data);
      } catch (e) {
        setError(true);
      }
    };

    fetch();
  }, []);

  return [loading, data, error] as const;
}

export async function fetchCurrencyData(): Promise<ApiResponse> {
  const res = await fetch(
    "https://run.mocky.io/v3/c88db14a-3128-4fbd-af74-1371c5bb0343"
  );
  const data: ApiResponse_unprocessed = await res.json();
  return processCurrencyData(data);
}

function processCurrencyData(rawData: ApiResponse_unprocessed): ApiResponse {
  const processed: ApiResponse = {
    ...rawData,
    comparisonDate: parseISO(rawData.comparisonDate),
    lastUpdated: parseISO(rawData.lastUpdated),
    currencies: [],
  };

  const validateCurrencyEntry = (fxEntry: FxEntry_unprocessed) => {
    if (!fxEntry.nameI18N) {
      // TODO send telemetry for invalid data
      // console.warn(`currency ${fxEntry.currency} has no display name`);
      return false;
    }

    if (!fxEntry.exchangeRate) {
      // TODO send telemetry for invalid data
      // console.warn(`currency ${fxEntry.currency} has no exchange rate`);
      return false;
    }

    return true;
  };

  processed.currencies = rawData.fx
    .map<FxEntry | null>((fxEntry: FxEntry_unprocessed) => {
      if (!validateCurrencyEntry(fxEntry)) {
        return null;
      }

      return {
        ...fxEntry,
        exchangeRate: {
          ...fxEntry.exchangeRate,
          buy: 1 / fxEntry.exchangeRate.buy,
          sell: 1 / fxEntry.exchangeRate.sell,
          lastModified:
            fxEntry.exchangeRate.lastModified &&
            parseISO(fxEntry.exchangeRate.lastModified),
        },
      } as FxEntry;
    })
    .filter(Boolean) as FxEntry[];

  processed.currencies.sort((a, b) =>
    a.currency.localeCompare(b.currency)
  ) as FxEntry[];

  return processed;
}

export interface ApiResponse
  extends Omit<
    ApiResponse_unprocessed,
    "lastUpdated" | "comparisonDate" | "fx"
  > {
  comparisonDate: Date;
  lastUpdated: Date;
  currencies: FxEntry[];
}

export interface FxEntry
  extends Omit<FxEntry_unprocessed, "banknoteRate" | "exchangeRate"> {
  exchangeRate: CurrencyRate;
}

export interface CurrencyRate
  extends Omit<CurrencyRate_unprocessed, "lastModified"> {
  lastModified: Date;
}

interface ApiResponse_unprocessed {
  baseCurrency: string;
  comparisonDate: string;
  institute: number;
  lastUpdated: string;
  fx: FxEntry_unprocessed[];
}

interface FxEntry_unprocessed {
  currency: string;
  flags: string[];
  nameI18N: string;
  precision: number;
  banknoteRate: CurrencyRate_unprocessed;
  exchangeRate: CurrencyRate_unprocessed;
}

interface CurrencyRate_unprocessed {
  buy: number;
  middle: number;
  sell: number;
  indicator: number;
  lastModified: string;
}

// No concrete documentation on what can be in the flags, update as necessary
export type CurrencyFlags = "provided" | "tradingProhibited";
