import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Crammer from "./Linear Algebra/Crammer";

it("test Crammer", () => {
  render(<Crammer />);
  expect(screen.getByText("Cramer's Rule")).toBeInTheDocument();
});
