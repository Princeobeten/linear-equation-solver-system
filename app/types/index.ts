export interface Solution {
  status: 'solved' | 'inconsistent' | 'dependent' | 'error';
  variables: Record<string, number> | null;
  message?: string;
  steps?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface EquationRecord {
  _id: string;
  userId: string;
  equations: string[];
  method: string;
  solution: {
    variables: Record<string, number>;
  };
  createdAt: string;
}
