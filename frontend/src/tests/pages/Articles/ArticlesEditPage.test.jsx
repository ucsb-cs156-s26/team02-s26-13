import { render, screen } from "@testing-library/react";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { expect } from "vitest";

describe("ArticlesEditPage tests", () => {
  const queryClient = new QueryClient();

  test("renders correctly", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesEditPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("Edit page not yet implemented");
    expect(
      screen.getByText("Edit page not yet implemented"),
    ).toBeInTheDocument();
  });
});
