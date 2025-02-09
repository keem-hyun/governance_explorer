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
  replies: {
    nodes: Comment[];
  };
}

export interface DiscussionNode {
  title: string;
  number: number;
  body: string;
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
    nodes: Comment[];
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