export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon?: string;
  component: React.ComponentType;
}

export type ToolCategory = 
  | "Network"
  | "Data Processing"
  | "Encoding"
  | "Security"
  | "Image"
  | "Development";
