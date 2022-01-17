import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Search, SearchProps } from ".";

const getTestProps = (props: Partial<SearchProps> = {}): SearchProps => ({
  defaultValue: "",
  itemCount: 0,
  label: "Search",
  onChange: jest.fn(),
  ...props,
});

describe("<Search />", () => {
  it("should render default", () => {
    const props = getTestProps();
    const { container } = render(<Search {...props} />);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="search"
          role="search"
        >
          <label
            for="search-0"
          >
            Search
          </label>
          <input
            id="search-0"
            name="search"
            type="search"
            value=""
          />
        </div>
      </div>
    `);
  });

  it("should call onChange callback", () => {
    const props = getTestProps();
    const value = "val";

    render(<Search {...props} />);
    fireEvent.change(screen.getByLabelText(props.label), { target: { value } });
    expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(props.onChange).toHaveBeenCalledWith(expect.anything(), value);
  });

  it("should mount with default value", () => {
    const props = getTestProps({ defaultValue: "xxx" });
    render(<Search {...props} />);
    expect(screen.getByLabelText(props.label).getAttribute("value")).toEqual(
      props.defaultValue
    );
  });

  it("should update value after default value", () => {
    const newValue = "yyy";
    const props = getTestProps({ defaultValue: "xxx" });
    render(<Search {...props} />);
    fireEvent.change(screen.getByLabelText(props.label), {
      target: { value: newValue },
    });
    expect(screen.getByLabelText(props.label).getAttribute("value")).toEqual(
      newValue
    );
  });

  it("should display search status search term exists", () => {
    const props = getTestProps();
    render(<Search {...props} />);
    fireEvent.change(screen.getByLabelText(props.label), {
      target: { value: "xxx" },
    });
    expect(screen.getByRole("status").textContent).toMatchInlineSnapshot(
      `"0 items found"`
    );
  });

  it("should not display search status if search term is empty", () => {
    const props = getTestProps();
    render(<Search {...props} />);
    expect(screen.queryByRole("status")).toBeNull();
  });
});
