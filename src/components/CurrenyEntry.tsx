import * as React from "react";
import { useTelemetry } from "../utils";

export function CurrencyEntry(props: CurrencyEntryProps) {
  const { error } = useTelemetry();

  return (
    <div role="listitem" className="currency-list__item" title={props.name}>
      <div>
        <img
          aria-hidden
          alt={props.name}
          src={getFlagFromTicker(props.ticker)}
          onError={(e) => {
            e.currentTarget.onerror = null;
            // TODO spec placeholder flag
            e.currentTarget.src = "https://via.placeholder.com/70x47";
            error(`Could not fetch flag for ${props.ticker}`);
          }}
        />
        <div>{props.ticker}</div>
      </div>
      <div>
        {props.exchangeRate} {props.targetCurrency}
      </div>
    </div>
  );
}

const getFlagFromTicker = (ticker: string) =>
  `/flags/${ticker.toLocaleLowerCase().slice(0, 2)}.png`;

export interface CurrencyEntryProps {
  ticker: string;
  name: string;
  exchangeRate: string;
  targetCurrency: string;
}
