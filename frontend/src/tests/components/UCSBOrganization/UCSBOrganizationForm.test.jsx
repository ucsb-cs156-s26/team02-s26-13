import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("UCSBOrganizationForm tests", () => {
  const expectedHeaders = [
    "Organization Code",
    "Organization Short Name",
    "Organization Name",
    "Inactive",
  ];
  const testId = "UCSBOrganizationForm";

  const sampleOrganization = {
    orgCode: "ACM",
    orgTranslationShort: "ACM",
    orgTranslation: "Association for Computing Machinery",
    inactive: false,
  };

  test("renders correctly with no initialContents", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-orgCode`)).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testId}-orgTranslationShort`),
    ).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-orgTranslation`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-inactive`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-submit`)).toBeInTheDocument();
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <Router>
        <UCSBOrganizationForm initialContents={sampleOrganization} />
      </Router>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    expect(await screen.findByTestId(`${testId}-orgCode`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-orgCode`)).toHaveValue("ACM");
    expect(screen.getByTestId(`${testId}-orgCode`)).toBeDisabled();
    expect(screen.getByTestId(`${testId}-orgTranslationShort`)).toHaveValue(
      "ACM",
    );
    expect(screen.getByTestId(`${testId}-orgTranslation`)).toHaveValue(
      "Association for Computing Machinery",
    );
    expect(screen.getByTestId(`${testId}-inactive`)).not.toBeChecked();
    expect(screen.getByTestId(`${testId}-submit`)).toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );

    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByTestId(`${testId}-submit`);
    fireEvent.click(submitButton);

    await screen.findByText(/Organization code is required./);
    expect(
      screen.getByText(/Organization short name is required./),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Organization name is required./),
    ).toBeInTheDocument();

    const orgCodeInput = screen.getByTestId(`${testId}-orgCode`);
    const orgTranslationShortInput = screen.getByTestId(
      `${testId}-orgTranslationShort`,
    );
    const orgTranslationInput = screen.getByTestId(`${testId}-orgTranslation`);
    const inactiveInput = screen.getByTestId(`${testId}-inactive`);

    expect(orgTranslationShortInput).toBeInTheDocument();
    expect(orgTranslationInput).toBeInTheDocument();
    expect(inactiveInput).toBeInTheDocument();

    fireEvent.change(orgCodeInput, { target: { value: "a".repeat(31) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
    });
  });
});
