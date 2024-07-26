export async function handler(event, context) {
  console.log("Received event:", event);
  const postSlug = event.queryStringParameters.slug || event.queryStringParameters[0] || event.path.split('/').pop();

  //const apiUrl = `https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyblogs.wordpress.com/posts/${postId}`;
  const apiUrl = `https://public-api.wordpress.com/wp/v2/sites/wealthpsychologyblogs.wordpress.com/posts?slug=${encodeURIComponent(postSlug)}`;

  try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
          console.log("WordPress API error:", response.statusText);
          return {
              statusCode: response.status,
              body: JSON.stringify({ error: 'Error fetching post' }),
          };
      }
      const posts = await response.json();
      console.log("WordPress API response:", posts);

      if (posts.length === 0) {
          console.log("No posts found for slug:", postSlug);
          return {
              statusCode: 404,
              body: JSON.stringify({ error: 'Post not found' }),
          };
      }

      // Return the first (and should be only) post
      console.log("Returning post:", posts[0]);
      return {
          statusCode: 200,
          body: JSON.stringify(posts[0]),
      };
  } catch (error) {
      console.error("Error in serverless function:", error);
      return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Internal Server Error' }),
      };
  }
}






