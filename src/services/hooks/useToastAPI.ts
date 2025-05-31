import { useEffect, useRef } from "react";
import { Id } from "react-toastify";
import { APIState, ToastConfig } from "../../types/toast";
import { toastAPIHandler } from "../../shared/toastAPI";

export function useToastAPI(config: ToastConfig, apiState: APIState) {
  const toastIdRef = useRef<Id | null>(null);
  useEffect(
    () => toastAPIHandler(config, apiState, toastIdRef),
    [
      config, apiState
    ]
  );
}