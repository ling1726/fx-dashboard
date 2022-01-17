import * as React from "react";
import { useId } from "../utils/useId";
import { useStrings } from "../utils/useStrings";

export function Search(props: SearchProps) {
  const id = useId("search");
  const strings = useStrings();
  const [term, setTerm] = React.useState(props.defaultValue);

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTerm(() => {
        props.onChange(e, e.target.value);
        return e.target.value;
      });
    },
    [props.onChange]
  );

  return (
    <div role="search" className="search">
      <label htmlFor={id}>{props.label}</label>
      <input
        id={id}
        value={term}
        type="search"
        name="search"
        onChange={onChange}
      />
      {props.itemCount && term && (
        <span role="status">{strings.itemsFound(props.itemCount)}</span>
      )}
    </div>
  );
}

export interface SearchProps {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  defaultValue: string;
  itemCount: number;
}
