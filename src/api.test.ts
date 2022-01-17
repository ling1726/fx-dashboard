import { renderHook } from "@testing-library/react-hooks";
import { ApiResponse_unprocessed, useCurrencyData } from "./api";

const defaultMockResponse: ApiResponse_unprocessed = {
  baseCurrency: "EUR",
  comparisonDate: "2018-11-09T15:07:00.000Z",
  institute: 198,
  lastUpdated: "2018-11-09T15:07:00.000Z",
  fx: [
    {
      banknoteRate: {
        buy: 1,
        middle: 1,
        sell: 1,
        indicator: 1,
        lastModified: "2018-11-09T15:07:00.000Z",
      },
      exchangeRate: {
        buy: 1,
        middle: 1,
        sell: 1,
        indicator: 1,
        lastModified: "2018-11-09T15:07:00.000Z",
      },
      currency: "ATS",
      nameI18N: "Schilling",
      precision: 2,
      flags: ["provided"],
    },
  ],
};

const mockFetch = (
  response: Partial<ApiResponse_unprocessed> = {},
  status: number = 200
) => {
  // @ts-ignore
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve(Object.assign({}, defaultMockResponse, response)),
      test: () => Promise.resolve("xxx"),
      status,
    })
  );
};

describe("useCurrencyData", () => {
  beforeEach(() => {
    mockFetch();
  });

  it("should throw error if api url is undefined", async () => {
    const url = process.env.REACT_APP_API_URL;
    delete process.env.REACT_APP_API_URL;
    const { result, waitForNextUpdate } = renderHook(useCurrencyData);
    await waitForNextUpdate();
    expect(result.current[2]).toBe(true);
    process.env.REACT_APP_API_URL = url;
  });

  it("should error if status code is greater than 200", async () => {
    mockFetch({}, 500);
    const { result, waitForNextUpdate } = renderHook(useCurrencyData);
    await waitForNextUpdate();
    expect(result.current[2]).toBe(true);
  });

  it("should have loading state", async () => {
    const { result, waitForNextUpdate } = renderHook(useCurrencyData);
    expect(result.current[0]).toBe(true);
    expect(result.current[1]).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current[0]).toBe(false);
    expect(result.current[1]).toBeDefined();
  });

  it("should ignore fx entries without an i18n display name", async () => {
    mockFetch({
      ...defaultMockResponse,
      fx: [
        {
          ...defaultMockResponse.fx[0],
          nameI18N: undefined as unknown as string,
        },
      ],
    });

    const { result, waitForNextUpdate } = renderHook(useCurrencyData);
    await waitForNextUpdate();
    expect(result.current[1]?.currencies.length).toEqual(0);
  });

  it("should ignore fx entries without an exchange rate", async () => {
    mockFetch({
      ...defaultMockResponse,
      fx: [
        {
          ...defaultMockResponse.fx[0],
          exchangeRate: undefined as any,
        },
      ],
    });

    const { result, waitForNextUpdate } = renderHook(useCurrencyData);
    await waitForNextUpdate();
    expect(result.current[1]?.currencies.length).toEqual(0);
  });

  it("should ignore fx entries with precision less than 2", async () => {
    mockFetch({
      ...defaultMockResponse,
      fx: [
        {
          ...defaultMockResponse.fx[0],
          precision: 1,
        },
      ],
    });

    const { result, waitForNextUpdate } = renderHook(useCurrencyData);
    await waitForNextUpdate();
    expect(result.current[1]?.currencies.length).toEqual(0);
  });

  it("should sort currencies in increasing alphabetical order", async () => {
    mockFetch({
      ...defaultMockResponse,
      fx: [
        {
          ...defaultMockResponse.fx[0],
          currency: "CCC",
        },
        {
          ...defaultMockResponse.fx[0],
          currency: "BBB",
        },
        {
          ...defaultMockResponse.fx[0],
          currency: "AAA",
        },
      ],
    });

    const { result, waitForNextUpdate } = renderHook(useCurrencyData);
    await waitForNextUpdate();
    expect(result.current[1]?.currencies.length).toEqual(3);
    expect(result.current[1]?.currencies.map((x) => x.currency)).toEqual([
      "AAA",
      "BBB",
      "CCC",
    ]);
  });
});
