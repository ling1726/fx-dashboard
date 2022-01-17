import * as React from "react";

export function CurrencyEntry(props: CurrencyEntryProps) {
  return (
    <div role="listitem" className="currency-list__item" title={props.name}>
      <div>
        <img
          aria-hidden
          alt={props.name}
          src={`/flags/${props.ticker.toLocaleLowerCase().slice(0, 2)}.png`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            // TODO spec placeholder flag
            e.currentTarget.src = "https://via.placeholder.com/70x47";
            // TODO send telemetry about flag fetching error
            // console.error('Could not fetch flag for', props.ticker);
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

export interface CurrencyEntryProps {
  ticker: string;
  name: string;
  exchangeRate: string;
  targetCurrency: string;
}
