import { vi } from "vitest";
import { toast } from "react-toastify";
import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/articlesUtils";

vi.mock("react-toastify", () => ({
  toast: vi.fn(),
}));

describe("articlesUtils tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("onDeleteSuccess logs message and calls toast", () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    onDeleteSuccess("Article deleted");

    expect(consoleLogSpy).toHaveBeenCalledWith("Article deleted");
    expect(toast).toHaveBeenCalledWith("Article deleted");

    consoleLogSpy.mockRestore();
  });

  test("cellToAxiosParamsDelete returns correct axios params", () => {
    const cell = {
      row: {
        original: {
          id: 42,
        },
      },
    };

    const result = cellToAxiosParamsDelete(cell);

    expect(result).toEqual({
      url: "/api/articles",
      method: "DELETE",
      params: {
        id: 42,
      },
    });
  });
});
