import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import CopyLinkButton from "../components/CopyLinkButton";

describe("CopyLinkButton", () => {
  test("renders CopyLinkButton with provided link and className", () => {
    render(<CopyLinkButton link="test" className="test" />);
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toBeDefined();
    expect(buttonElement).toHaveProperty("onclick");
    expect(buttonElement).toHaveClass("test");
  });
});
