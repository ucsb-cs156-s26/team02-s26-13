import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import MenuItemReviewsEditPage from "main/pages/MenuItemReviews/MenuItemReviewsEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    useParams: vi.fn(() => ({
      id: 3,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe("MenuItemReviewsEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/menuitemreviews", { params: { id: 3 } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit MenuItemReview");
      expect(
        screen.queryByTestId("MenuItemReview-Comments"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/menuitemreviews", { params: { id: 3 } })
        .reply(200, {
          id: 3,
          itemId: 4,
          reviewerEmail: "joaquinwong@ucsb.edu",
          stars: 5,
          dateReviewed: "2022-02-02T00:00",
          comments: "Good",
        });
      axiosMock.onPut("/api/menuitemreviews").reply(200, {
        id: 3,
        itemId: 4,
        reviewerEmail: "johndoe@ucsb.edu",
        stars: 5,
        dateReviewed: "2022-02-02T00:00",
        comments: "Okay",
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-id");

      const idField = screen.getByTestId("MenuItemReviewForm-id");
      const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
      const reviewerEmailField = screen.getByLabelText("ReviewerEmail");
      const starsField = screen.getByLabelText("Stars");
      const dateReviewedField = screen.getByLabelText(
        "DateReviewed(iso format)",
      );
      const commentsField = screen.getByLabelText("Comments");
      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("3");
      expect(itemIdField).toBeInTheDocument();
      expect(itemIdField).toHaveValue("4");
      expect(reviewerEmailField).toBeInTheDocument();
      expect(reviewerEmailField).toHaveValue("joaquinwong@ucsb.edu");
      expect(starsField).toBeInTheDocument();
      expect(starsField).toHaveValue("5");
      expect(dateReviewedField).toBeInTheDocument();
      expect(dateReviewedField).toHaveValue("2022-02-02T00:00");
      expect(commentsField).toBeInTheDocument();
      expect(commentsField).toHaveValue("Good");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(reviewerEmailField, {
        target: { value: "johndoe@ucsb.edu" },
      });
      fireEvent.change(commentsField, {
        target: { value: "Okay" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "MenuItemReview Updated - id: 3 comments: Okay",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreviews" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 3 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          itemId: 4,
          reviewerEmail: "johndoe@ucsb.edu",
          stars: 5,
          dateReviewed: "2022-02-02T00:00",
          comments: "Okay",
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-id");

      const idField = screen.getByTestId("MenuItemReviewForm-id");
      const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
      const reviewerEmailField = screen.getByLabelText("ReviewerEmail");
      const starsField = screen.getByLabelText("Stars");
      const dateReviewedField = screen.getByLabelText(
        "DateReviewed(iso format)",
      );
      const commentsField = screen.getByLabelText("Comments");
      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("3");
      expect(itemIdField).toBeInTheDocument();
      expect(itemIdField).toHaveValue("4");
      expect(reviewerEmailField).toBeInTheDocument();
      expect(reviewerEmailField).toHaveValue("joaquinwong@ucsb.edu");
      expect(starsField).toBeInTheDocument();
      expect(starsField).toHaveValue("5");
      expect(dateReviewedField).toBeInTheDocument();
      expect(dateReviewedField).toHaveValue("2022-02-02T00:00");
      expect(commentsField).toBeInTheDocument();
      expect(commentsField).toHaveValue("Good");

      fireEvent.change(reviewerEmailField, {
        target: { value: "johndoe@ucsb.edu" },
      });
      fireEvent.change(commentsField, {
        target: { value: "Okay" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "MenuItemReview Updated - id: 3 comments: Okay",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreviews" });
    });
  });
});
