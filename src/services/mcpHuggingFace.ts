
interface HuggingFaceConfig {
  apiKey: string;
  baseURL: string;
}

interface MCPResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

interface SemanticSearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  score: number;
}

interface ModelInfo {
  id: string;
  author: string;
  downloads: number;
  likes: number;
  tags: string[];
  description: string;
}

class MCPHuggingFaceService {
  private config: HuggingFaceConfig;
  private availableTools: MCPTool[];
  private availableResources: MCPResource[];

  constructor(config: HuggingFaceConfig) {
    this.config = config;
    this.initializeTools();
    this.initializeResources();
  }

  private initializeTools(): void {
    this.availableTools = [
      {
        name: "search_spaces",
        description: "Find the best AI Apps via natural language queries for freight and logistics",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Natural language search query" },
            limit: { type: "number", default: 10 }
          },
          required: ["query"]
        }
      },
      {
        name: "search_models",
        description: "Search for ML models relevant to logistics and freight intelligence",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Model search query" },
            task: { type: "string", description: "Specific ML task (e.g., text-classification, forecasting)" },
            limit: { type: "number", default: 10 }
          },
          required: ["query"]
        }
      },
      {
        name: "search_papers",
        description: "Find ML Research Papers related to logistics and supply chain",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Research paper search query" },
            limit: { type: "number", default: 10 }
          },
          required: ["query"]
        }
      },
      {
        name: "get_model_details",
        description: "Get detailed information about a specific model",
        inputSchema: {
          type: "object",
          properties: {
            modelId: { type: "string", description: "Hugging Face model ID" }
          },
          required: ["modelId"]
        }
      }
    ];
  }

  private initializeResources(): void {
    this.availableResources = [
      {
        uri: "hf://spaces/semantic-search",
        name: "Spaces Semantic Search",
        description: "Access to Hugging Face Spaces for freight intelligence",
        mimeType: "application/json"
      },
      {
        uri: "hf://models/logistics",
        name: "Logistics Models",
        description: "Curated ML models for logistics and supply chain",
        mimeType: "application/json"
      },
      {
        uri: "hf://papers/supply-chain",
        name: "Supply Chain Research",
        description: "Academic papers on supply chain optimization",
        mimeType: "application/json"
      }
    ];
  }

  async searchSpaces(query: string, limit: number = 10): Promise<SemanticSearchResult[]> {
    try {
      console.log('🔍 Searching Hugging Face Spaces:', query);
      
      const response = await fetch(`${this.config.baseURL}/api/spaces`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        // Add search parameters
      });

      if (!response.ok) {
        throw new Error(`Spaces search failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform the response to match our interface
      return data.slice(0, limit).map((space: any, index: number) => ({
        id: space.id || `space-${index}`,
        title: space.cardData?.title || space.id,
        description: space.cardData?.summary || 'No description available',
        url: `https://huggingface.co/spaces/${space.id}`,
        score: 0.9 - (index * 0.1) // Mock relevance score
      }));
    } catch (error) {
      console.error('Spaces search error:', error);
      return [];
    }
  }

  async searchModels(query: string, task?: string, limit: number = 10): Promise<ModelInfo[]> {
    try {
      console.log('🤖 Searching Hugging Face Models:', { query, task });
      
      const searchParams = new URLSearchParams({
        search: query,
        limit: limit.toString(),
        ...(task && { filter: `task:${task}` })
      });

      const response = await fetch(`${this.config.baseURL}/api/models?${searchParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Models search failed: ${response.status}`);
      }

      const data = await response.json();
      
      return data.map((model: any) => ({
        id: model.id,
        author: model.author || 'Unknown',
        downloads: model.downloads || 0,
        likes: model.likes || 0,
        tags: model.tags || [],
        description: model.cardData?.summary || 'No description available'
      }));
    } catch (error) {
      console.error('Models search error:', error);
      return [];
    }
  }

  async searchPapers(query: string, limit: number = 10): Promise<SemanticSearchResult[]> {
    try {
      console.log('📄 Searching Research Papers:', query);
      
      // This would typically use Hugging Face's papers API or arxiv integration
      const response = await fetch(`${this.config.baseURL}/api/papers/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          limit,
          fields: ['title', 'abstract', 'authors', 'url']
        }),
      });

      if (!response.ok) {
        throw new Error(`Papers search failed: ${response.status}`);
      }

      const data = await response.json();
      
      return data.papers?.map((paper: any, index: number) => ({
        id: paper.id || `paper-${index}`,
        title: paper.title,
        description: paper.abstract || 'No abstract available',
        url: paper.url || paper.arxiv_url,
        score: paper.relevance_score || (0.9 - index * 0.1)
      })) || [];
    } catch (error) {
      console.error('Papers search error:', error);
      // Return mock data for development
      return [
        {
          id: 'paper-1',
          title: 'Deep Learning for Supply Chain Optimization',
          description: 'A comprehensive study on applying neural networks to freight routing',
          url: 'https://arxiv.org/abs/example',
          score: 0.95
        }
      ];
    }
  }

  async getModelDetails(modelId: string): Promise<ModelInfo | null> {
    try {
      console.log('📊 Getting model details:', modelId);
      
      const response = await fetch(`${this.config.baseURL}/api/models/${modelId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Model details failed: ${response.status}`);
      }

      const model = await response.json();
      
      return {
        id: model.id,
        author: model.author || 'Unknown',
        downloads: model.downloads || 0,
        likes: model.likes || 0,
        tags: model.tags || [],
        description: model.cardData?.summary || 'No description available'
      };
    } catch (error) {
      console.error('Model details error:', error);
      return null;
    }
  }

  async executeTool(toolName: string, parameters: any): Promise<any> {
    console.log('🛠️ Executing MCP tool:', toolName, parameters);
    
    switch (toolName) {
      case 'search_spaces':
        return await this.searchSpaces(parameters.query, parameters.limit);
      
      case 'search_models':
        return await this.searchModels(parameters.query, parameters.task, parameters.limit);
      
      case 'search_papers':
        return await this.searchPapers(parameters.query, parameters.limit);
      
      case 'get_model_details':
        return await this.getModelDetails(parameters.modelId);
      
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }

  getAvailableTools(): MCPTool[] {
    return this.availableTools;
  }

  getAvailableResources(): MCPResource[] {
    return this.availableResources;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseURL}/api/whoami`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export configured MCP service
export const mcpHuggingFace = new MCPHuggingFaceService({
  apiKey: process.env.HUGGINGFACE_API_KEY || 'hf_placeholder_key',
  baseURL: 'https://huggingface.co'
});

export default mcpHuggingFace;
export type { MCPTool, MCPResource, SemanticSearchResult, ModelInfo };
