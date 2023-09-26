import { AuthContext } from "../Context/AuthContext";
import { useContext } from "react";

// Define a type for the return value of useAuthContext
type AuthContextType = {
  state: AuthState; // Replace with your actual AuthState type
  dispatch: React.Dispatch<any>; // Replace with the actual dispatch type
};

// Define the shape of the user object
interface User {
  // Define the properties of the user object here
  // For example:
  username: string;
  // Add other properties as needed
}

// Define the shape of the state
interface AuthState {
  user: User | null;
}


// Defining a custom hook 'useAuthContext' to consume AuthContext
export const useAuthContext = (): AuthContextType => {
  // useContext Hook is used to subscribe to the context value (AuthContext in this case).
  const context = useContext(AuthContext);

  // Check if the useAuthContext hook is used inside a component wrapped by AuthContextProvider.
  // If not, throw an error.
  if (!context) {
    throw Error("useAuthContext must be used inside an AuthContextProvider");
  }

  // Return the context value (i.e., the value passed by the Provider of AuthContext).
  return context;
};