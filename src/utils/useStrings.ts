// TODO this is only a stub for a future i18n layer
export function useStrings(locale: string = "en-us") {
  return {
    title: "George FE Test",
    lastUpdated: "Last updated",
    search: "Search",
  } as const;
}
