import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

interface FriendRequest {
    // Define the shape of a friend request object.
    id: string;
    sender: string;
    recipient: string;
    // ... other properties ...
  }
  
  interface FriendRequestsResponse {
    // Define the shape of the response from the API.
    data: FriendRequest[];
  }
  
  interface FriendRequestsState {
    friendRequests: FriendRequest[] | undefined;
    isPending: boolean;
    error: string | null;
  }

/**
 * Custom hook to fetch friend requests for a given user.
 *
 * @function
 * @param {string} myUsername - The username of the user for whom to fetch friend requests.
 * @param {boolean} reload - Dependency to re-run the effect and fetch the data again.
 * @returns {Object} - An object containing the friend requests, loading state, and any error that occurred.
 */
export const useFriendRequests = (myUsername: string, reload: boolean): FriendRequestsState => {
    // State for storing friend requests, loading state, and errors.
    const [friendRequests, setFriendRequests] = useState<FriendRequest[] | undefined>();
    const [isPending, setIsPending] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetching friend requests for the given username.
        axios
            .get<FriendRequestsResponse>(
                `${
                    import.meta.env.VITE_BASE_API_URL
                }/friend-requests/${myUsername}`
            )
            .then((response: AxiosResponse<FriendRequestsResponse>) => {
                // On success, updating the state with the received data.
                setFriendRequests(response.data.data);
                setIsPending(false);
            })
            .catch((err) => {
                // On error, updating the error state with the received error message.
                setIsPending(false);
                setError(err.message);
            });
    }, [reload]); // Re-run the effect when the 'reload' dependency changes.

    // Returning the result.
    return { friendRequests, isPending, error };
};
