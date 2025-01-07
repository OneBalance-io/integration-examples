import { useSignTypedData } from "@privy-io/react-auth";
import { useMakeCallbackAsync } from "../promise/use-make-callback-async";

/**
 * Turns function returned from `useSignTypedData` into a Promise-based function
 */
export const useAsyncSignTypedData = () => {
  const { wrapInPromise, onSuccess, onError } =
    useMakeCallbackAsync<() => string>();
  const { signTypedData } = useSignTypedData({
    onSuccess,
    onError,
  });
  const { runAsAsync } = wrapInPromise(signTypedData);

  return {
    signTypedDataAsync: runAsAsync,
  };
};
