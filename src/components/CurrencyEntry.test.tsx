import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CurrencyEntry } from "./CurrenyEntry";
import { CurrencyEntryProps } from ".";
import { useTelemetry } from "../utils";

jest.mock("../utils/useTelemetry.ts");

const getTestProps = (
  props: Partial<CurrencyEntryProps> = {}
): CurrencyEntryProps => ({
  exchangeRate: "1.00",
  name: "schilling",
  targetCurrency: "EUR",
  ticker: "ATS",
  ...props,
});

describe("<CurrencyEntry />", () => {
  it("should render default", () => {
    const props = getTestProps();
    const { container } = render(<CurrencyEntry {...props} />);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="currency-list__item"
          role="listitem"
          title="schilling"
        >
          <div>
            <img
              alt="schilling"
              aria-hidden="true"
              src="/flags/at.png"
            />
            <div>
              ATS
            </div>
          </div>
          <div>
            1.00
             
            EUR
          </div>
        </div>
      </div>
    `);
  });

  it("should render image with aria-hidden", () => {
    const props = getTestProps();
    render(<CurrencyEntry {...props} />);

    expect(screen.getByAltText(props.name).getAttribute("aria-hidden")).toBe(
      "true"
    );
  });

  it("should use a placeholder image on error", () => {
    const props = getTestProps();
    render(<CurrencyEntry {...props} />);

    fireEvent.error(screen.getByAltText(props.name));
    expect(
      screen.getByAltText(props.name).getAttribute("src")
    ).toMatchInlineSnapshot(`"https://via.placeholder.com/70x47"`);
  });

  it("should use first two letters of the currency ticker for flag", () => {
    const props = getTestProps({ ticker: "CNY" });
    render(<CurrencyEntry {...props} />);

    expect(
      screen.getByAltText(props.name).getAttribute("src")?.split("/")[2]
    ).toMatchInlineSnapshot(`"cn.png"`);
  });

  it("should send telemetry if flag fails to load", () => {
    const { error } = useTelemetry();
    const props = getTestProps();
    render(<CurrencyEntry {...props} />);

    fireEvent.error(screen.getByAltText(props.name));
    expect(error).toHaveBeenCalledTimes(1);
  });
});
