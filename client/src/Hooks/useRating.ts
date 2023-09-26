// Define the shape of the request payload
interface RatingRequest {
  username: string;
  rating: number;
  movie: string;
}

// Define the shape of the response from the API
interface RatingResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Defining a custom hook 'useRating'
export const useRating = () => {
  // Defining the rating function which takes username, rating, and movie as parameters
  const rating = async (username: string, rating: number, movie: string) => {
    const requestBody: RatingRequest = { username, rating, movie };
    try {
      // Sending a POST request to the rating endpoint of the API with the provided data
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/rating`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      // Parsing the JSON response from the server
      const json: RatingResponse = await response.json();

      // Checking if the response status is not OK
      if (!response.ok) {
        // Logging any errors returned by the server
        console.log(json.error);
      } else {
        // Logging the successful JSON response from the server
        console.log(json);
      }
    } catch (error) {
      // Handle any network errors or exceptions here
      console.error("Error while sending rating:", error);
    }
  };

  // Returning the rating function from the custom hook
  return { rating };
};
