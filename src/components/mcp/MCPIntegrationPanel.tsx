
import React, { useState, useEffect } from 'react';
import { useMCPIntegration } from '../../hooks/useMCPIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';

interface MCPIntegrationPanelProps {
  className?: string;
}

export const MCPIntegrationPanel: React.FC<MCPIntegrationPanelProps> = ({ className }) => {
  const {
    tools,
    resources,
    isLoading,
    error,
    isHealthy,
    searchSpaces,
    searchModels,
    searchPapers,
    checkHealth
  } = useMCPIntegration();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('spaces');

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    console.log('🔍 MCP Search:', { query: searchQuery, tab: activeTab });
    
    try {
      let results: any[] = [];
      
      switch (activeTab) {
        case 'spaces':
          results = await searchSpaces(`${searchQuery} logistics freight supply chain`);
          break;
        case 'models':
          results = await searchModels(`${searchQuery} logistics freight`, 'text-classification');
          break;
        case 'papers':
          results = await searchPapers(`${searchQuery} supply chain optimization`);
          break;
      }
      
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className={`oracle-card ${className}`}>
      <CardHeader className="bg-gradient-to-r from-deepcal-dark to-deepcal-purple text-white">
        <CardTitle className="flex items-center">
          <i className="fas fa-plug mr-2"></i>
          MCP Integration
          {isHealthy ? (
            <Badge variant="outline" className="ml-2 text-green-400 border-green-400">
              <i className="fas fa-check-circle mr-1"></i> Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="ml-2 text-red-400 border-red-400">
              <i className="fas fa-exclamation-circle mr-1"></i> Offline
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-purple-100">
          Hugging Face Model Context Protocol Integration
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          {/* Search Interface */}
          <div className="flex gap-2">
            <Input
              placeholder="Search AI resources for logistics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch} 
              disabled={isLoading || !searchQuery.trim()}
              className="bg-deepcal-purple hover:bg-deepcal-light"
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-search"></i>
              )}
            </Button>
          </div>
          
          {/* Results Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="spaces">
                <i className="fas fa-rocket mr-1"></i> Spaces
              </TabsTrigger>
              <TabsTrigger value="models">
                <i className="fas fa-brain mr-1"></i> Models
              </TabsTrigger>
              <TabsTrigger value="papers">
                <i className="fas fa-file-alt mr-1"></i> Papers
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="spaces" className="mt-4">
              <ScrollArea className="h-64">
                {searchResults.length > 0 ? (
                  <div className="space-y-3">
                    {searchResults.map((result, index) => (
                      <div key={result.id || index} className="p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-slate-200">{result.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {(result.score * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{result.description}</p>
                        {result.url && (
                          <a 
                            href={result.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-deepcal-light hover:underline"
                          >
                            <i className="fas fa-external-link-alt mr-1"></i>
                            View Space
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    <i className="fas fa-search text-2xl mb-2"></i>
                    <p>Search for AI Spaces to enhance your logistics workflow</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="models" className="mt-4">
              <ScrollArea className="h-64">
                {searchResults.length > 0 ? (
                  <div className="space-y-3">
                    {searchResults.map((result, index) => (
                      <div key={result.id || index} className="p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-slate-200">{result.id}</h4>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs">
                              <i className="fas fa-download mr-1"></i>
                              {result.downloads || 0}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <i className="fas fa-heart mr-1"></i>
                              {result.likes || 0}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{result.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {result.tags?.slice(0, 3).map((tag: string, tagIndex: number) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    <i className="fas fa-brain text-2xl mb-2"></i>
                    <p>Search for ML models for freight intelligence</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="papers" className="mt-4">
              <ScrollArea className="h-64">
                {searchResults.length > 0 ? (
                  <div className="space-y-3">
                    {searchResults.map((result, index) => (
                      <div key={result.id || index} className="p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-slate-200">{result.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {(result.score * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{result.description}</p>
                        {result.url && (
                          <a 
                            href={result.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-deepcal-light hover:underline"
                          >
                            <i className="fas fa-external-link-alt mr-1"></i>
                            Read Paper
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    <i className="fas fa-file-alt text-2xl mb-2"></i>
                    <p>Search for research papers on logistics optimization</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
          
          {/* Available Tools */}
          <div className="mt-6">
            <h4 className="font-medium text-slate-200 mb-2">Available MCP Tools</h4>
            <div className="grid grid-cols-2 gap-2">
              {tools.map((tool, index) => (
                <div key={index} className="p-2 bg-slate-700/20 rounded text-xs">
                  <div className="font-medium text-slate-300">{tool.name}</div>
                  <div className="text-slate-400">{tool.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
