import { toast } from "react-toastify";

export function onDeleteSuccess(message) {
  console.log(message);
  toast("RecommendationRequest deleted successfully");
}

export function cellToAxiosParamsDelete(cell) {
  return {
    url: "/api/recommendationrequest",
    method: "DELETE",
    params: {
      id: cell.row.original.id,
    },
  };
}
