import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
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
      id: 17,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

describe("HelpRequestEditPage tests", () => {
  let axiosMock;

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
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByText("Edit HelpRequest");
      expect(
        screen.queryByTestId("HelpRequestForm-requesterEmail"),
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
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).reply(200, {
        ...helpRequestFixtures.oneHelpRequest,
        id: 17,
      });
      axiosMock.onPut("/api/helprequests").reply(200, {
        ...helpRequestFixtures.oneHelpRequest,
        id: 17,
        requesterEmail: "updated@ucsb.edu",
        explanation: "Updated explanation",
        solved: true,
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      expect(screen.getByTestId("HelpRequestForm-id")).toHaveValue("17");
      expect(screen.getByTestId("HelpRequestForm-requesterEmail")).toHaveValue(
        "cgaucho@ucsb.edu",
      );
      expect(screen.getByTestId("HelpRequestForm-teamId")).toHaveValue(
        "s22-5pm-3",
      );
      expect(
        screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom"),
      ).toHaveValue("7");
      expect(screen.getByTestId("HelpRequestForm-requestTime")).toHaveValue(
        "2022-04-20T17:35",
      );
      expect(screen.getByTestId("HelpRequestForm-explanation")).toHaveValue(
        "Need help with Swagger-ui",
      );
      expect(screen.getByTestId("HelpRequestForm-solved")).not.toBeChecked();
      expect(screen.getByTestId("HelpRequestForm-submit")).toHaveTextContent(
        "Update",
      );
    });

    test("changes when you click update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      fireEvent.change(screen.getByTestId("HelpRequestForm-requesterEmail"), {
        target: { value: "updated@ucsb.edu" },
      });
      fireEvent.change(screen.getByTestId("HelpRequestForm-explanation"), {
        target: { value: "Updated explanation" },
      });
      fireEvent.click(screen.getByTestId("HelpRequestForm-solved"));
      fireEvent.click(screen.getByTestId("HelpRequestForm-submit"));

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "HelpRequest Updated - id: 17 email: updated@ucsb.edu",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/helprequest" });

      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "updated@ucsb.edu",
          teamId: "s22-5pm-3",
          tableOrBreakoutRoom: "7",
          requestTime: "2022-04-20T17:35:00",
          explanation: "Updated explanation",
          solved: true,
        }),
      );
    });
  });
});
