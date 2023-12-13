import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Heading from "../components/Heading";

describe("Heading", () => {
  test("renders Heading with provided text and className", () => {
    render(<Heading text="Heading" className="test" />);
    const headingElement = screen.getByText(/Heading/i);
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveClass("test");
  });
});
