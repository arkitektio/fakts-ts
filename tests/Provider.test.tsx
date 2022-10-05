import { beforeEach, describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { FaktsProvider } from "../src/fakts/FaktsProvider";
import React from "react";

describe("Provider test", () => {
  test("Should be initialized", () => {
    render(
      <FaktsProvider clientId="fff" clientSecret="soinsoin">
        <h4>Content</h4>
      </FaktsProvider>
    );

    expect(screen.getByText(/Content/i)).toBeDefined();
  });
});
