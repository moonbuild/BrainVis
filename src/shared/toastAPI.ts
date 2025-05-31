import { Id, toast, TypeOptions } from "react-toastify";
import { APIState, ToastConfig } from "../types/toast";


export function toastAPIHandler(
  config: ToastConfig,
  apiState: APIState,
  toastId: React.RefObject<Id | null>
) {
  const {
    loadingMessage,
    successMessage,
    errorMessagePrefix = "Failed to perform task",
  } = config;
  const { isPending, isSuccess, isError, error } = apiState;

  if (isPending && !toastId.current) {
    toastId.current = toast.loading(loadingMessage);
  } else if (isSuccess && toastId.current) {
    const typeOption: TypeOptions = "success";
    const toastConfig = {
      render: successMessage,
      type: typeOption,
      isLoading: false,
      autoClose: 4000,
      pauseOnHover: true,
    };
      toast.update(toastId.current, toastConfig);
    toastId.current = null;
  } else if (isError) {
    const errorMessage = `${errorMessagePrefix}:\n${
      error?.message ?? "Unknown error occured"
    }`;
    const typeOption: TypeOptions = "error";
    const toastConfig = {
      render: errorMessage,
      type: typeOption,
      isLoading: false,
      autoClose: 6000,
      pauseOnHover: true,
    };
    if (toastId.current) {
      toast.update(toastId.current, toastConfig);
    } else {
      toastId.current = toast.error(errorMessage, toastConfig);
    }

    toastId.current = null;
  }
}

