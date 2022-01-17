import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import { useStrings } from "./utils";

jest.mock("./api.ts");

describe("<App />", () => {
  beforeEach(() => {
    window.location.hash = "";
  });

  it("should populate search input from URL", () => {
    const strings = useStrings();
    window.location.hash = "#xxx";
    render(<App />);

    expect(screen.getByLabelText(strings.search).getAttribute("value")).toEqual(
      window.location.hash.slice(1)
    );
  });

  it("search should update URL hash", () => {
    const strings = useStrings();
    const value = "xxx";
    render(<App />);

    fireEvent.change(screen.getByLabelText(strings.search), {
      target: { value },
    });
    expect(window.location.hash).toEqual(`#${value}`);
  });
});
