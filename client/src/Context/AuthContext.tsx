import React, { createContext, useEffect, useReducer, ReactNode } from "react";

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
// Define the action types
type AuthAction = { type: "LOGIN"; payload: User } | { type: "LOGOUT" };

// Create the initial state
const initialAuthState: AuthState = {
  user: null,
};
export const AuthContext = createContext<
  | {
      state: AuthState;
      dispatch: React.Dispatch<AuthAction>;
    }
  | undefined
>(undefined);

export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const userString = localStorage.getItem("user");

    if (userString) {
      const user = JSON.parse(userString);
      dispatch({ type: "LOGIN", payload: user });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
