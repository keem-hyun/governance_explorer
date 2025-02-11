export interface GitHubTreeEntry {
  name: string;
  type: string;
  object: {
    text: string;
  };
}

export interface GitHubProposal {
  name: string;
  content: string;
}

export interface GitHubTreeResponse {
  data: {
    repository: {
      object: {
        entries: GitHubTreeEntry[];
      };
    };
  };
  errors?: Array<{
    message: string;
  }>;
}