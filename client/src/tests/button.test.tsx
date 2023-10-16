import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Button from "../components/Button";
import LinkButton from "../components/LinkButton";

describe("Button", () => {
  test("renders Button with provided text, onClick, and className", () => {
    render(<Button text="Test" onClick={() => {}} className="test" />);
    const buttonElement = screen.getByText("Test");
    expect(buttonElement).toBeDefined();
    expect(buttonElement).toHaveProperty("onclick");
    expect(buttonElement).toHaveClass("test");
  });
  test("renders LinkButton with provided text, href, and className", () => {
    render(<LinkButton text="Test" href="/test" className="test" />);
    const buttonElement = screen.getByText("Test");
    expect(buttonElement).toBeDefined();
    expect(buttonElement).toHaveProperty("href");
    expect(buttonElement).toHaveClass("test");
  });
});
