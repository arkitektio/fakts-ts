import { beforeEach, describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { FaktsProvider } from "../src/fakts/FaktsProvider";
import { EndpointsProvider, useEndpoints } from "../src/fakts/EndpointProvider";
import React from "react";

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
  const { endpoints } = useEndpoints();
  return <div>{endpoints.map((e) => e.name).join(",")}</div>;
};

describe("Ednpoint Provider test", () => {
  test("Should be initialized", () => {
    render(
      <EndpointsProvider>
        <h4>Content</h4>
      </EndpointsProvider>
    );

    expect(screen.getByText(/Content/i)).toBeDefined();
    expect(screen.getByText(/Content/i)).toBeDefined();
  });
});

describe("Ednpoint Provider test", () => {
  test("Should be initialized", () => {
    render(
      <EndpointsProvider>
        <RetrieveEndpoints />
      </EndpointsProvider>
    );
  });
});
