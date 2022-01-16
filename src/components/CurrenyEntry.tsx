export function CurrencyEntry(props: CurrencyEntryProps) {
  return (
    <div
      role="listitem"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "5px 0",
        padding: "10px 10px",
        border: "1px solid black",
        borderRadius: "4px",
      }}
      title={props.name}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <img
          aria-hidden
          alt={props.name}
          src={`/flags/${props.ticker.toLocaleLowerCase().slice(0, 2)}.png`}
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
