export interface ToastConfig {
  loadingMessage: string;
  successMessage: string;
  errorMessagePrefix?: string;
}
export interface APIState {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
}