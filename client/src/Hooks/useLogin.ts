// Importing required dependencies and hooks
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

// Define the shape of the user object
interface User {
  username: string;
  // ... other user properties ...
}

// Define the shape of the response from the login API
interface LoginResponse {
  user: User;
  // ... other response properties ...
}

// Define the shape of the error object
interface Error {
  message: string;
  // ... other error properties ...
}

// Define the shape of the return value of the hook
interface LoginResult {
  login: (username: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

// Defining a custom hook 'useLogin'
export const useLogin = (): LoginResult => {
  // Initializing state for error and loading indicators
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Destructuring dispatch from the context to dispatch actions
  const { dispatch } = useAuthContext();

  // Defining the login function which takes username and password as parameters
  const login = async (username: string, password: string): Promise<void> => {
    // Setting the loading state to true when login starts
    setIsLoading(true);
    // Resetting any previous errors
    setError(null);

    // Sending a POST request to the login endpoint with the username and password
    const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    // Parsing the response to JSON
    const json: LoginResponse = await response.json();

    // Checking the response status
    if (!response.ok) {
      // If response is not OK, storing user data to localStorage
      // and dispatching LOGIN action with received user data
      localStorage.setItem("user", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });
      // Setting loading state to false
      setIsLoading(false);
    }

    if (response.ok) {
      // If response is OK, storing user data to localStorage
      // and dispatching LOGIN action with received user data
      localStorage.setItem("user", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });
      // Setting loading state to false
      setIsLoading(false);
    }
  };

  // Returning login function along with isLoading and error states
  return { login, isLoading, error };
};
