// Importing the useAuthContext custom hook
import { useAuthContext } from "./useAuthContext";

// Define the shape of the return value of the hook
interface LogoutResult {
  logout: () => void;
}

// Defining a custom hook 'useLogout'
export const useLogout = (): LogoutResult => {
  // Destructuring dispatch from the context to dispatch actions
  const { dispatch } = useAuthContext();

  // Defining the logout function
  const logout = (): void => {
    // Removing the user item from localStorage
    localStorage.removeItem("user");
    // Dispatching the 'LOGOUT' action to update the context/state
    dispatch({ type: "LOGOUT" });
  };

  // Returning the logout function from the custom hook
  return { logout };
};
