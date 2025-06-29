
import { useState, useCallback } from 'react';
import { mcpHuggingFace, MCPTool, MCPResource, SemanticSearchResult, ModelInfo } from '../services/mcpHuggingFace';

interface UseMCPIntegrationResult {
  tools: MCPTool[];
  resources: MCPResource[];
  isLoading: boolean;
  error: string | null;
  isHealthy: boolean;
  searchSpaces: (query: string) => Promise<SemanticSearchResult[]>;
  searchModels: (query: string, task?: string) => Promise<ModelInfo[]>;
  searchPapers: (query: string) => Promise<SemanticSearchResult[]>;
  getModelDetails: (modelId: string) => Promise<ModelInfo | null>;
  executeTool: (toolName: string, parameters: any) => Promise<any>;
  checkHealth: () => Promise<void>;
}

export const useMCPIntegration = (): UseMCPIntegrationResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHealthy, setIsHealthy] = useState(true);

  const checkHealth = useCallback(async () => {
    try {
      const healthy = await mcpHuggingFace.healthCheck();
      setIsHealthy(healthy);
      if (!healthy) {
        console.warn('🔌 MCP Hugging Face service is not available');
      }
    } catch (err) {
      setIsHealthy(false);
      console.warn('🔌 MCP health check failed:', err);
    }
  }, []);

  const searchSpaces = useCallback(async (query: string): Promise<SemanticSearchResult[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await mcpHuggingFace.searchSpaces(query);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search spaces';
      setError(errorMessage);
      console.error('🔍 Spaces search error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchModels = useCallback(async (query: string, task?: string): Promise<ModelInfo[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await mcpHuggingFace.searchModels(query, task);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search models';
      setError(errorMessage);
      console.error('🤖 Models search error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchPapers = useCallback(async (query: string): Promise<SemanticSearchResult[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await mcpHuggingFace.searchPapers(query);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search papers';
      setError(errorMessage);
      console.error('📄 Papers search error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getModelDetails = useCallback(async (modelId: string): Promise<ModelInfo | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const details = await mcpHuggingFace.getModelDetails(modelId);
      return details;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get model details';
      setError(errorMessage);
      console.error('📊 Model details error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const executeTool = useCallback(async (toolName: string, parameters: any): Promise<any> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await mcpHuggingFace.executeTool(toolName, parameters);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute tool';
      setError(errorMessage);
      console.error('🛠️ Tool execution error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    tools: mcpHuggingFace.getAvailableTools(),
    resources: mcpHuggingFace.getAvailableResources(),
    isLoading,
    error,
    isHealthy,
    searchSpaces,
    searchModels,
    searchPapers,
    getModelDetails,
    executeTool,
    checkHealth
  };
};
