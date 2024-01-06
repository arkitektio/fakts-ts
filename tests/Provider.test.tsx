import { beforeEach, describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { FaktsProvider } from "../src/fakts/FaktsProvider";
import React from "react";
import { useFakts } from "../src/fakts/FaktsContext";

describe("Provider test", () => {
  test("Should be initialized", () => {
    render(
      <FaktsProvider>
        <h4>Content</h4>
      </FaktsProvider>
    );

    expect(screen.getByText(/Content/i)).toBeDefined();
  });
});

const RetrieveEndpoints = () => {
  const { registeredEndpoints } = useFakts();
  return <div>{registeredEndpoints.map((e) => e.name).join(",")}</div>;
};

describe("Ednpoint Provider test", () => {
  test("Should be initialized", () => {
    render(
      <FaktsProvider>
        <RetrieveEndpoints />
      </FaktsProvider>
    );
  });
});
