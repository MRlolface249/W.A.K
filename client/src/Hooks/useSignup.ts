// Importing required hooks and context
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

// Define the shape of the user object
interface User {
  email: string;
  username: string;
  // Add other user properties as needed
}
// Define the response shape for the API
type ApiResponse = User | { error: string };

// Defining the useSignup custom hook
export const useSignup = () => {
  // Initializing state variables for error and loading status
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | null>(null);

  // Accessing the dispatch method from the authentication context
  const { dispatch } = useAuthContext();

  // Defining the signup function with email, username, and password as parameters
  const signup = async (email: string, username: string, password: string) => {
    // Setting loading status to true at the start of signup process
    setIsLoading(true);
    // Resetting any previous error state
    setError(null);

    // Sending a POST request to the signup endpoint with user details
    const response = await fetch(
      `${import.meta.env.VITE_BASE_API_URL}/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      }
    );

    // Parsing the JSON response from the server
    const json = (await response.json()) as { error?: string } | null;

    // Handling the response from the server
    if (!response.ok) {
      // If response status is not OK, set loading to false and update error state
      setIsLoading(false);
      if (json?.error) {
        setError(json.error);
      } else {
        setError("An unknown error occurred.");
      }
    }
    if (response.ok) {
      // If signup is successful, store user data in local storage and update the context
      localStorage.setItem("user", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });
      // Setting loading status to false after successful signup
      setIsLoading(false);
    }
  };

  // Define the return type of the hook
  type SignupHookReturnType = {
    signup: (
      email: string,
      username: string,
      password: string
    ) => Promise<void>;
    isLoading: boolean | null;
    error: string | null;
  };

  // Returning the signup function along with isLoading and error state
  return { signup, isLoading, error } as SignupHookReturnType;
};
