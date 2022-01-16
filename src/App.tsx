import React from "react";
import "./App.scss";
import { useCurrencyData } from "./api";
import { CurrencyEntry } from "./components/CurrenyEntry";
import { Search } from "./components/Search";

function App() {
  const [loading, data] = useCurrencyData();
  const [filter, setFilter] = React.useState(() =>
    decodeURI(window.location.hash.slice(1))
  );

  React.useEffect(() => {
    window.location.hash = filter;
  }, [filter]);

  if (loading || !data) {
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
    <div>
      <header>
        <h1>George FE Test</h1>
      </header>
      <div className="searchbar">
        <Search
          label="Search"
          onChange={(e, value) => setFilter(value)}
          defaultValue={filter}
        />

        <div>Last updated: {data.lastUpdated.toLocaleDateString()}</div>
      </div>
      <div role="list" style={{ padding: "10px 10px" }}>
        {currencies.map((entry) => {
          return (
            <CurrencyEntry
              targetCurrency="EUR"
              ticker={entry.currency}
              name={entry.nameI18N}
              exchangeRate={entry.exchangeRate.buy.toFixed(2)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
