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
  author: Author;
  reactions?: {
    totalCount: number;
  };
  pullRequestReview?: {
    state: string;
  };
  replyTo?: {
    id: string;
  };
}

interface Author {
  login: string;
  avatarUrl: string;
}

interface ReviewComment {
  id: string;
  body: string;
  path: string;
  position: number;
  line?: number;
  originalLine?: number;
  createdAt: string;
  author: Author;
  replyTo?: {
    id: string;
  };
  pullRequestReview: {
    state: string;
  };
}

export interface Review {
  id: string;
  body: string;
  state: string;
  createdAt: string;
  author: Author;
  comments: {
    nodes: ReviewComment[];
  };
}

interface FileChange {
  path: string;
  additions: number;
  deletions: number;
  changeType: string;
  patch?: string;
}

export interface ReviewThread {
  id: string;
  path: string;
  line: number | null;
  originalLine: number | null;
  startLine: number | null;
  diffSide: 'LEFT' | 'RIGHT';
  comments: {
    nodes: Comment[];
  };
}

export interface PullRequestDetail {
  number: number;
  title: string;
  state: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  headRefOid: string;
  baseRefOid: string;
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
  reviewThreads: {
    nodes: ReviewThread[];
  };
  reviews: {
    nodes: Review[];
  };
  commits: {
    totalCount: number;
  };
  files: {
    nodes: FileChange[];
  };
  changedFiles: number;
  additions: number;
  deletions: number;
}

export interface PullRequestFile {
  sha: string;
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  blob_url: string;
  raw_url: string;
  contents_url: string;
  patch: string;
} 