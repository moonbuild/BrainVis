import { toast } from "react-toastify";

export function toastAPIHandler(
  loadingMessage: string,
  successMessage: string,
  isPending: boolean,
  isSuccess: boolean,
  isError: boolean,
  error: Error | null,
  toastId: React.RefObject<string | number | null>,
) {
  if (isPending && !toastId.current) {
    toastId.current = toast.loading(loadingMessage);
  } else if (isSuccess && toastId.current) {
    toast.update(toastId.current, {
      render: successMessage,
      type: "success",
      isLoading: false,
      autoClose: 4000,
      pauseOnHover: true,
    });
  } else if (isError && toastId.current) {
    toast.update(toastId.current, {
      render: `Failed to fetch plot:\n ${error?.message ?? 'Unknown error'}`,
      type: "error",
      isLoading: false,
      autoClose: 6000,
      pauseOnHover: true,
    });
  }
}
