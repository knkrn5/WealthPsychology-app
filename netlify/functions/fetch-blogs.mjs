// import fetch from 'node-fetch'; // Netlify does indeed have a global fetch available in its runtime environment, which means you don't need to install or import node-fetch. u
export async function handler(event, context) {
  const apiUrl = 'https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyblogs.wordpress.com/posts?_embed';

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Error fetching posts' }),
      };
    }
    const posts = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(posts),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
}
