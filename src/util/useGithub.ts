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
      next: { revalidate: 3600 }, // 1시간 캐시
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

export async function fetchGithubDiscussion(number: number) {
  const query = `
    query {
      repository(owner: "solana-foundation", name: "solana-improvement-documents") {
        discussion(number: ${number}) {
          title
          number
          body
          author {
            login
            avatarUrl
          }
          createdAt
          category {
            name
          }
          comments(first: 100) {
            nodes {
              id
              body
              createdAt
              author {
                login
                avatarUrl
              }
              reactions {
                totalCount
              }
            }
          }
          reactions {
            totalCount
          }
        }
      }
    }
  `

  const response = await fetch(`${process.env.GITHUB_API_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 }, // 1시간 캐시
  })

  const json = await response.json()
  return json.data.repository.discussion
}

// 커서를 저장할 캐시
let cursors: string[] = [];

export async function fetchGithubPullRequests(page: number = 1) {
  const perPage = 10;
  
  // 첫 페이지거나 커서가 없는 경우
  if (page === 1) {
    cursors = []; // 커서 캐시 초기화
  }

  // 이전 페이지의 커서가 필요한데 없는 경우, 처음부터 데이터를 수집
  if (page > 1 && !cursors[page - 2]) {
    for (let i = 1; i < page; i++) {
      const result = await fetchGithubPullRequests(i);
      if (result.pageInfo.endCursor) {
        cursors[i - 1] = result.pageInfo.endCursor;
      }
    }
  }

  const query = `
    query {
      repository(owner: "solana-foundation", name: "solana-improvement-documents") {
        pullRequests(
          first: ${perPage}, 
          orderBy: {field: CREATED_AT, direction: DESC}
          ${page > 1 && cursors[page - 2] ? `, after: "${cursors[page - 2]}"` : ''}
        ) {
          nodes {
            number
            title
            state
            createdAt
            updatedAt
            author {
              login
              avatarUrl
            }
            labels(first: 10) {
              nodes {
                name
                color
              }
            }
            comments {
              totalCount
            }
            commits {
              totalCount
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
          totalCount
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
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 }, // cache 1 hour
    });

    const json = await response.json();

    if (json.errors) {
      console.error('GitHub API Errors:', json.errors);
      throw new Error(json.errors[0]?.message || 'GitHub API Error');
    }

    if (!json.data?.repository?.pullRequests) {
      console.error('Invalid GitHub API Response:', json);
      return {
        nodes: [],
        pageInfo: {
          hasNextPage: false,
          endCursor: null
        },
        totalCount: 0
      };
    }

    const result = json.data.repository.pullRequests;
    
    // 현재 페이지의 커서 저장
    if (result.pageInfo.endCursor) {
      cursors[page - 1] = result.pageInfo.endCursor;
    }

    return result;
  } catch (error) {
    console.error('GitHub API Error:', error);
    return {
      nodes: [],
      pageInfo: {
        hasNextPage: false,
        endCursor: null
      },
      totalCount: 0
    };
  }
}

export async function fetchGithubPullRequest(number: number) {
  const query = `
    query {
      repository(owner: "solana-foundation", name: "solana-improvement-documents") {
        pullRequest(number: ${number}) {
          number
          title
          state
          createdAt
          updatedAt
          body
          headRefOid
          baseRefOid
          author {
            login
            avatarUrl
          }
          labels(first: 10) {
            nodes {
              name
              color
            }
          }
          comments(first: 100) {
            nodes {
              id
              body
              createdAt
              author {
                login
                avatarUrl
              }
              reactions {
                totalCount
              }
            }
            totalCount
          }
          reviewThreads(first: 100) {
            nodes {
              id
              path
              line
              originalLine
              startLine
              diffSide
              comments(first: 100) {
                nodes {
                  id
                  body
                  createdAt
                  author {
                    login
                    avatarUrl
                  }
                  replyTo {
                    id
                  }
                  pullRequestReview {
                    state
                  }
                }
              }
            }
          }
          reviews(first: 100) {
            nodes {
              id
              body
              state
              createdAt
              author {
                login
                avatarUrl
              }
              comments(first: 100) {
                nodes {
                  id
                  body
                  path
                  position
                  line
                  originalLine
                  createdAt
                  author {
                    login
                    avatarUrl
                  }
                  replyTo {
                    id
                  }
                  pullRequestReview {
                    state
                  }
                }
              }
            }
          }
          commits {
            totalCount
          }
          files(first: 100) {
            nodes {
              path
              additions
              deletions
              changeType
            }
          }
          changedFiles
          additions
          deletions
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
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 },
    });

    const json = await response.json();

    if (json.errors) {
      console.error('GitHub API Errors:', json.errors);
      throw new Error(json.errors[0]?.message || 'GitHub API Error');
    }

    return json.data.repository.pullRequest;
  } catch (error) {
    console.error('GitHub API Error:', error);
    return null;
  }
}

export async function fetchPullRequestDiff(number: number) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/solana-foundation/solana-improvement-documents/pulls/${number}/files`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch PR diff');
    }

    return await response.json();
  } catch (error) {
    console.error('GitHub API Error:', error);
    return [];
  }
}

export async function fetchFileContent(path: string, ref: string) {
  try {
    // 1. 먼저 파일의 Git blob SHA를 가져옵니다
    const query = `
      query {
        repository(owner: "solana-foundation", name: "solana-improvement-documents") {
          object(expression: "${ref}:${path}") {
            ... on Blob {
              text
            }
          }
        }
      }
    `;

    const response = await fetch(`${process.env.GITHUB_API_URL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch file content');
    }

    const json = await response.json();
    
    if (json.errors) {
      console.error('GitHub API Errors:', json.errors);
      throw new Error(json.errors[0]?.message || 'GitHub API Error');
    }

    return json.data.repository.object?.text || '';

  } catch (error) {
    console.error('GitHub API Error:', error);
    return '';
  }
}