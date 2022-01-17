import React from "react";
import { useCurrencyData } from "./api";
import { CurrencyEntry } from "./components/CurrenyEntry";
import { Search } from "./components/Search";
import { useStrings } from "./utils/useStrings";

function App() {
  const strings = useStrings();
  const [loading, data, error] = useCurrencyData();
  const [filter, setFilter] = React.useState(() =>
    decodeURI(window.location.hash.slice(1))
  );

  React.useEffect(() => {
    window.location.hash = filter;
  }, [filter]);

  if (loading || !data || error) {
    // TODO spec loading page
    // TODO spec error page
    return null;
  }

  // TODO get more specs on search constraints
  const currencies = data.currencies.filter(
    (entry) =>
      entry.currency
        .toLocaleLowerCase()
        .startsWith(filter.toLocaleLowerCase()) ||
      entry.nameI18N.toLocaleLowerCase().startsWith(filter.toLocaleLowerCase())
  );

  return (
    <>
      <header>
        <h1>{strings.title}</h1>
      </header>
      <div role="presentation" className="toolbar">
        <Search
          label={strings.search}
          onChange={(e, value) => setFilter(value)}
          defaultValue={filter}
          itemCount={currencies.length}
        />

        <div role="status">
          {strings.lastUpdated}: {data.lastUpdated.toLocaleDateString()}
        </div>
      </div>
      <main>
        <div role="list" className="currency-list">
          {currencies.map((entry) => {
            return (
              <CurrencyEntry
                key={entry.currency}
                targetCurrency="EUR"
                ticker={entry.currency}
                name={entry.nameI18N}
                // TODO should we use buy or sell price ?
                exchangeRate={entry.exchangeRate.buy.toFixed(2)}
              />
            );
          })}
        </div>
      </main>
    </>
  );
}

export default App;
