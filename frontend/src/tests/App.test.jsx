import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import App from "../App";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("App route tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock
      .onGet("/api/helprequests/all")
      .reply(200, helpRequestFixtures.threeHelpRequests);
  };

  const setupAdminUser = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock
      .onGet("/api/helprequests/all")
      .reply(200, helpRequestFixtures.threeHelpRequests);
  };

  test("routes /ucsborganization to the index page for a user", async () => {
    setupUserOnly();
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/ucsborganization"]}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByRole("heading", { name: "UCSBOrganization" }),
    ).toBeInTheDocument();
  });

  test("routes /ucsborganization/create to the create page for an admin", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/ucsborganization/create"]}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByText("Create New UCSBOrganization"),
    ).toBeInTheDocument();
  });

  test("routes /ucsborganization/edit/1 to the edit page for an admin", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/ucsborganization/edit/1"]}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByText("Edit page not yet implemented"),
    ).toBeInTheDocument();
  });

  test("routes /helprequest to the index page for a user", async () => {
    setupUserOnly();
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/helprequest"]}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByRole("heading", { name: "HelpRequests" }),
    ).toBeInTheDocument();
  });

  test("routes /helprequest/create to the create page for an admin", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/helprequest/create"]}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByText("Create New HelpRequest"),
    ).toBeInTheDocument();
  });

  test("routes /helprequest/edit/1 to the edit page for an admin", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/helprequest/edit/1"]}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByText("Edit page not yet implemented"),
    ).toBeInTheDocument();
  });
});
