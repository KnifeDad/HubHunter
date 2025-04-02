const searchGithub = async (retryCount = 0) => {
  try {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    
    // Search for users with certain criteria to get more complete profiles
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

    // Get a random user from the results
    const randomIndex = Math.floor(Math.random() * searchResults.items.length);
    const selectedUser = searchResults.items[randomIndex];

    // Get detailed information for the selected user
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

    // If the user has no bio or location and we haven't retried too many times, try another user
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
