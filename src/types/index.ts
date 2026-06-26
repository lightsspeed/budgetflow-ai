export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  merchant: string;
  account: string;
  category: string;
  notes: string;
  amount: number;
  type: TransactionType;
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  percentage: number;
  description: string;
}

export interface BudgetPlan {
  income: number;
  categories: BudgetCategory[];
}

export type BudgetTemplate = "50/30/20" | "conservative" | "zero";

export type AllocationStatus = "valid" | "under" | "over";

export interface Goal {
  id: string;
  name: string;
  icon: string;
  color: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  typing?: boolean;
  chartData?: {
    progress?: number;
    categories?: { label: string; amount: number; color: string }[];
  };
  actions?: { label: string; action: string }[];
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}
