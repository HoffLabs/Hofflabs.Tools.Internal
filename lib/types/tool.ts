export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon?: string;
  component: React.ComponentType;
  /** If true, this tool is only available when NEXT_PUBLIC_SITE_MODE is not 'public' */
  internalOnly?: boolean;
}

export type ToolCategory = 
  | "Network"
  | "Data Processing"
  | "Encoding"
  | "Security"
  | "Image"
  | "Development";
