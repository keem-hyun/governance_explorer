export interface GithubDiscussion {
  id: string
  number: number
  title: string
  author: {
    login: string
    avatarUrl: string
  }
  createdAt: string
  category: {
    name: string
    emoji: string
  }
  url: string
  reactions: {
    totalCount: number
  }
  comments: {
    totalCount: number
  }
}

export interface DiscussionNode {
  title: string;
  number: number;
  author: {
    login: string;
    avatarUrl: string;
  };
  createdAt: string;
  category: {
    name: string;
  };
  comments: {
    totalCount: number;
  };
  reactions: {
    totalCount: number;
  };
}

export interface DiscussionsResponse {
  repository: {
    discussions: {
      nodes: DiscussionNode[];
    };
  };
}