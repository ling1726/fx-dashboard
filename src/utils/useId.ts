import * as React from "react";

let ids = 0;

export function useId(prefix?: string) {
  const [idNum] = React.useState(() => ids++);

  return React.useMemo(() => {
    if (prefix) {
      return `${prefix}-${idNum}`;
    }

    return `${idNum}`;
  }, [idNum, prefix]);
}
