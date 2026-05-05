import { render, screen } from "@testing-library/react";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { expect } from "vitest";

describe("ArticlesCreatePage tests", () => {
  const queryClient = new QueryClient();

  test("renders correctly", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("Create page not yet implemented");
    expect(
      screen.getByText("Create page not yet implemented"),
    ).toBeInTheDocument();
  });
});
