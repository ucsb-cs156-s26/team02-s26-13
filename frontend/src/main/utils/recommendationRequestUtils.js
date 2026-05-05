import { toast } from "react-toastify";

// Stryker disable next-line all
export function onDeleteSuccess(message) {
  console.log(message);
  // Stryker disable next-line all
  toast("RecommendationRequest deleted successfully");
}

export function cellToAxiosParamsDelete(cell) {
  return {
    // Stryker disable next-line all
    url: "/api/recommendationrequest",
    method: "DELETE",
    params: {
      id: cell.row.original.id,
    },
  };
}
