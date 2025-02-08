import { DiscussionNode } from "@/types/githubDiscussion";

export async function fetchGithubDiscussions(): Promise<DiscussionNode[]> {
  const query = `
    query {
      repository(owner: "solana-foundation", name: "solana-improvement-documents") {
        discussions(first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            title
            number
            author {
              login
              avatarUrl
            }
            createdAt
            category {
              name
            }
            comments {
              totalCount
            }
            reactions {
              totalCount
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`${process.env.GITHUB_API_URL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({ query }),
    });

    const json = await response.json();

    if (json.errors) {
      console.error('GitHub API Errors:', json.errors);
      throw new Error(json.errors[0]?.message || 'GitHub API Error');
    }

    if (!json.data) {
      console.error('Invalid GitHub API Response:', json);
      throw new Error('Invalid GitHub API Response');
    }

    return json.data.repository.discussions.nodes;
  } catch (error) {
    console.error('GitHub API Error:', error);
    throw error;
  }
}