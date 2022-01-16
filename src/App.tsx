import React from "react";
import "./App.scss";
import { useCurrencyData } from "./api";
import { CurrencyEntry } from "./components/CurrenyEntry";
import { Search } from "./components/Search";
import { useStrings } from "./utils/useStrings";

function App() {
  const strings = useStrings();
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
        <h1>{strings.title}</h1>
      </header>
      <div className="searchbar">
        <Search
          label={strings.search}
          onChange={(e, value) => setFilter(value)}
          defaultValue={filter}
        />

        <div>
          {strings.lastUpdated}: {data.lastUpdated.toLocaleDateString()}
        </div>
      </div>
      <div role="list" style={{ padding: "10px 10px" }}>
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
    </div>
  );
}

export default App;
