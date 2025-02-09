export interface PullRequest {
  number: number;
  title: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  author: {
    login: string;
    avatarUrl: string;
  };
  labels: {
    nodes: {
      name: string;
      color: string;
    }[];
  };
  comments: {
    totalCount: number;
  };
  commits: {
    totalCount: number;
  };
}

export interface PullRequestsResponse {
  repository: {
    pullRequests: {
      nodes: PullRequest[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
      totalCount: number;
    };
  };
}

export interface Comment {
  id: string;
  body: string;
  createdAt: string;
  author: {
    login: string;
    avatarUrl: string;
  };
  reactions: {
    totalCount: number;
  };
}

export interface PullRequestDetail {
  number: number;
  title: string;
  state: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: {
    login: string;
    avatarUrl: string;
  };
  labels: {
    nodes: {
      name: string;
      color: string;
    }[];
  };
  comments: {
    nodes: Comment[];
    totalCount: number;
  };
  commits: {
    totalCount: number;
  };
  files: {
    totalCount: number;
  };
  changedFiles: number;
  additions: number;
  deletions: number;
} 