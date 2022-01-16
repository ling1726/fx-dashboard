import * as React from "react";
import { useId } from "../utils/useId";

export function Search(props: SearchProps) {
  const id = useId("search");
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
    <div>
      <label style={{ marginRight: 10 }} htmlFor={id}>
        {props.label}
      </label>
      <input id={id} value={term} type="text" onChange={onChange} />
    </div>
  );
}

export interface SearchProps {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  defaultValue: string;
}
