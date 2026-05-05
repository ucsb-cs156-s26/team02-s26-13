import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("ArticlesForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "Title",
    "URL",
    "Explanation",
    "Email",
    "Date Added (iso format)",
  ];
  const testId = "ArticlesForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm initialContents={articlesFixtures.oneArticle[0]} />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText("Id")).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-id`)).toHaveValue("1");
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("shows correct validation errors on missing input", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByTestId(`${testId}-submit`)).toBeInTheDocument();
    const submitButton = screen.getByTestId(`${testId}-submit`);

    fireEvent.click(submitButton);

    await screen.findByText(/Title is required./);
    expect(screen.getByText(/URL is required./)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
    expect(screen.getByText(/Email is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Added is required./)).toBeInTheDocument();
  });

  test("shows correct validation error on bad email input", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
        </Router>
      </QueryClientProvider>,
    );

    await screen.findByTestId(`${testId}-email`);
    const emailField = screen.getByTestId(`${testId}-email`);
    const submitButton = screen.getByTestId(`${testId}-submit`);

    fireEvent.change(emailField, { target: { value: "not-an-email" } });
    fireEvent.click(submitButton);

    await screen.findByText(/Email must be a valid email address./);
    expect(
      screen.getByText(/Email must be a valid email address./),
    ).toBeInTheDocument();
  });

  test("no errors on good input, submitAction is called", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm submitAction={mockSubmitAction} />
        </Router>
      </QueryClientProvider>,
    );

    await screen.findByTestId(`${testId}-title`);

    fireEvent.change(screen.getByTestId(`${testId}-title`), {
      target: { value: "Test Article" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-url`), {
      target: { value: "https://example.com" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-explanation`), {
      target: { value: "A test explanation" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-email`), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-dateAdded`), {
      target: { value: "2022-01-02T12:00" },
    });

    fireEvent.click(screen.getByTestId(`${testId}-submit`));

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(screen.queryByText(/Title is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/URL is required./)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Explanation is required./),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Email is required./)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Date Added is required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Email must be a valid email address./),
    ).not.toBeInTheDocument();
  });
});
