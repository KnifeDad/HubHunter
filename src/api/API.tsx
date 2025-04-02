/**
 * Searches GitHub for potential developer candidates based on activity metrics
 * @param retryCount - Number of retries if a candidate doesn't meet criteria
 * @returns Array of candidate details or empty array if no suitable candidates found
 */
const searchGithub = async (retryCount = 0) => {
  try {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    
    // Search for active users with minimum repository and follower counts
    const searchResponse = await fetch(
      `https://api.github.com/search/users?q=type:user+repos:>5+followers:>10&sort=updated&order=desc&per_page=100`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${token}`
        },
      }
    );
    
    if (!searchResponse.ok) {
      throw new Error('Failed to fetch users list');
    }

    const searchResults = await searchResponse.json();
    console.log('Search results:', searchResults);

    if (!searchResults.items || searchResults.items.length === 0) {
      return [];
    }

    // Randomly select a user from the search results
    const randomIndex = Math.floor(Math.random() * searchResults.items.length);
    const selectedUser = searchResults.items[randomIndex];

    // Fetch detailed profile information for the selected user
    const userDetailsResponse = await fetch(
      `https://api.github.com/users/${selectedUser.login}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${token}`
        },
      }
    );

    if (!userDetailsResponse.ok) {
      throw new Error('Failed to fetch user details');
    }

    const userDetails = await userDetailsResponse.json();
    console.log('User details:', userDetails);

    // Retry if user profile is incomplete (no bio or location) and we haven't exceeded retry limit
    if (!userDetails.bio && !userDetails.location && retryCount < 3) {
      return searchGithub(retryCount + 1);
    }

    return [userDetails];
  } catch (err) {
    console.error('An error occurred:', err);
    return [];
  }
};

export { searchGithub };
