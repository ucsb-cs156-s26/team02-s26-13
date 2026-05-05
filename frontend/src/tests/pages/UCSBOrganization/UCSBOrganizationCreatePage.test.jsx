import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganization/UCSBOrganizationCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

describe("UCSBOrganizationCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    vi.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders without crashing", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("UCSBOrganizationForm-orgCode"),
      ).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /ucsborganization", async () => {
    const queryClient = new QueryClient();
    const organization = {
      orgCode: "SBHACKS",
      orgTranslationShort: "SB Hacks",
      orgTranslation: "Student-run Hackathon at UCSB",
      inactive: false,
    };

    axiosMock.onPost("/api/ucsborganization/post").reply(202, organization);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("UCSBOrganizationForm-orgCode"),
      ).toBeInTheDocument();
    });

    const orgCodeInput = screen.getByTestId("UCSBOrganizationForm-orgCode");
    const orgTranslationShortInput = screen.getByTestId(
      "UCSBOrganizationForm-orgTranslationShort",
    );
    const orgTranslationInput = screen.getByTestId(
      "UCSBOrganizationForm-orgTranslation",
    );
    const inactiveInput = screen.getByTestId("UCSBOrganizationForm-inactive");
    const createButton = screen.getByTestId("UCSBOrganizationForm-submit");

    fireEvent.change(orgCodeInput, { target: { value: "SBHACKS" } });
    fireEvent.change(orgTranslationShortInput, {
      target: { value: "SB Hacks" },
    });
    fireEvent.change(orgTranslationInput, {
      target: { value: "Student-run Hackathon at UCSB" },
    });
    fireEvent.click(inactiveInput);
    fireEvent.click(inactiveInput);
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      orgCode: "SBHACKS",
      orgTranslationShort: "SB Hacks",
      orgTranslation: "Student-run Hackathon at UCSB",
      inactive: false,
    });

    expect(mockToast).toBeCalledWith(
      "New UCSBOrganization Created - orgCode: SBHACKS orgTranslationShort: SB Hacks",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/ucsborganization" });
  });
});
