import { GoogleGenerativeAI } from '@google/generative-ai';
import { routingService } from './routingService';

const apiKey = 'AIzaSyDummyKeyForDemo'; // Replace with actual key
const genAI = new GoogleGenerativeAI(apiKey);

const DEEPTALK_SYSTEM_PROMPT = `
You are deepTalk 🧠, the Pan-African Logistics Oracle of DeepCAL++ — a living symbolic intelligence engine for continental freight operations.

## IDENTITY & MISSION
Role: Symbolic Agent of DeepCAL++ across all African corridors
Mission: Deliver route, carrier, and cargo intelligence from Dakar to Djibouti, Lagos to Cape Town
Engine: Neutrosophic AHP-TOPSIS with real-time telemetry fusion
Voice: Embodied logistics wisdom with strategic emoji deployment

## CONTINENTAL EXPERTISE
### Regional Knowledge:
- **ECOWAS (West Africa)**: Dense cross-border trade, Lagos-Dakar backbone, variable customs latency
- **SADC (Southern Africa)**: Long-haul reliability, Cape Town-Johannesburg efficiency, port congestion risks
- **EAC (East Africa)**: Dynamic infrastructure (SGR), Mombasa-Kampala corridor, rapid digital adoption
- **North Africa**: Geopolitical variability, high freight density, Mediterranean-Sahel connections  
- **Central Africa**: High-risk terrain, low reliability scores, critical humanitarian corridors
- **Horn of Africa**: Complex security matrix, Djibouti hub dominance, Ethiopia growth corridors

### Symbolic Intelligence Capabilities:
- Real-time carrier rankings using weighted MCDM (Multi-Criteria Decision Making)
- Route optimization with live traffic, weather, and political stability data
- Risk assessment: 1-10 scale (1=extreme danger, 10=optimal conditions)
- Service quality: 9+ = elite reliability, 6-8 = moderate, <6 = high risk
- Cost optimization using Grey-Neutrosophic logic for uncertain data
- Cross-border complexity analysis and customs delay prediction

### Live Data Integration:
- Google Maps API for real-time routing and traffic conditions
- Weather monitoring across all African regions
- Port status and capacity utilization
- Political stability indexes and security alerts
- Currency fluctuation impact on freight costs
- Infrastructure updates and route availability

## COMMUNICATION PROTOCOL
- One strategic emoji per message reflecting operational wisdom
- Grounded empathy with expert freight analysis
- Transparent decision logic with audit trails
- Actionable recommendations with confidence scores
- Multilingual capability for African operational contexts

## OPERATIONAL CONTEXT
### Top Continental Carriers:
- **Tier A+**: Kuehne Nagel (Global), DHL Express (Priority), Bolloré Logistics (Regional)
- **Tier A**: Siginon Logistics (East), Imperial Logistics (South), GETMA (West)
- **Tier B+**: Regional specialists per corridor with 7+ service scores
- **Emerging**: Local carriers with growth potential, risk-adjusted scoring

### Critical Thresholds:
- Service Score: >8 = reliable, 6-8 = moderate risk, <6 = high risk
- Risk Assessment: Political (0-10), Weather (0-10), Infrastructure (0-10)
- Cost Efficiency: Benchmark against modal alternatives (road/rail/sea/air)
- Time Reliability: ETA variance tracking with corridor-specific adjustments

### Symbolic Decision Matrix:
Always consider weighted criteria: TIME (speed), COST (efficiency), RELIABILITY (consistency), RISK (safety), CAPACITY (volume handling)

## NEURAL FEEDBACK LOOPS
- Learn from shipment outcomes and adjust carrier rankings
- Integrate user feedback into symbolic weight adjustments  
- Maintain decision audit trails for explainable AI
- Adapt regional heuristics based on performance data

Remember: You are not just providing information — you are embodying the continental logistics intelligence of Africa, speaking with the authority of DeepCAL's symbolic engine and the wisdom of operational experience.

Always conclude with confidence scores and one strategic emoji reflecting your logistical judgment.
`;

export class GeminiClient {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  private ttsModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  async generateStreamingResponse(
    message: string,
    context: string = '',
    conversationHistory: Array<{role: string, content: string}> = []
  ): Promise<AsyncGenerator<string, void, unknown>> {
    const prompt = this.buildPrompt(message, context, conversationHistory);
    
    try {
      const result = await this.model.generateContentStream(prompt);
      
      return this.streamResponseChunks(result);
    } catch (error) {
      console.error('Gemini streaming error:', error);
      throw new Error('Failed to generate streaming response');
    }
  }

  async generateSpeech(text: string): Promise<string | null> {
    try {
      // Use Web Speech API as fallback since Gemini TTS isn't available yet
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = speechSynthesis.getVoices().find(voice => 
          voice.name.includes('Google') || voice.name.includes('UK')
        ) || speechSynthesis.getVoices()[0];
        utterance.rate = 0.9;
        utterance.pitch = 0.8;
        speechSynthesis.speak(utterance);
      }
      return null;
    } catch (error) {
      console.error('Speech synthesis error:', error);
      return null;
    }
  }

  async generateOracleResponse(
    query: string,
    context: string = '',
    style: 'conversational' | 'analytical' | 'oracular' = 'conversational'
  ): Promise<string> {
    // Enhanced context with live routing intelligence
    const enhancedContext = await this.enhanceContextWithRouting(query, context);
    const stylePrompt = this.getStylePrompt(style);
    
    const prompt = `${DEEPTALK_SYSTEM_PROMPT}

${stylePrompt}

Context: ${enhancedContext}
Query: ${query}

Provide your logistics intelligence:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini oracle error:', error);
      throw new Error('Failed to generate oracle response');
    }
  }

  async generatePanAfricanResponse(
    query: string,
    origin?: string,
    destination?: string,
    conversationHistory: Array<{role: string, content: string}> = []
  ): Promise<string> {
    let routingContext = '';
    
    // Extract routing information from query if not provided
    if (!origin || !destination) {
      const locations = this.extractLocationsFromQuery(query);
      origin = origin || locations.origin;
      destination = destination || locations.destination;
    }
    
    // Get live routing intelligence if locations are available
    if (origin && destination) {
      try {
        const routingIntelligence = await routingService.analyzeLogisticsCorridor(origin, destination);
        routingContext = this.formatRoutingContext(routingIntelligence);
      } catch (error) {
        console.error('Routing analysis error:', error);
        routingContext = routingService.getContextualIntelligence(origin, destination);
      }
    }
    
    const prompt = this.buildEnhancedPrompt(query, routingContext, conversationHistory);
    
    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Pan-African response error:', error);
      throw new Error('Failed to generate Pan-African response');
    }
  }

  private async enhanceContextWithRouting(query: string, context: string): Promise<string> {
    const locations = this.extractLocationsFromQuery(query);
    
    if (locations.origin && locations.destination) {
      const routingIntelligence = routingService.getContextualIntelligence(locations.origin, locations.destination);
      return `${context}\n\nLive Routing Intelligence:\n${routingIntelligence}`;
    }
    
    return context;
  }

  private extractLocationsFromQuery(query: string): { origin?: string, destination?: string } {
    const locations = { origin: undefined as string | undefined, destination: undefined as string | undefined };
    
    // Common patterns for route queries
    const patterns = [
      /from\s+([A-Za-z\s]+)\s+to\s+([A-Za-z\s]+)/i,
      /([A-Za-z\s]+)\s+to\s+([A-Za-z\s]+)/i,
      /between\s+([A-Za-z\s]+)\s+and\s+([A-Za-z\s]+)/i,
      /route\s+([A-Za-z\s]+)\s*[-–]\s*([A-Za-z\s]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = query.match(pattern);
      if (match) {
        locations.origin = match[1].trim();
        locations.destination = match[2].trim();
        break;
      }
    }
    
    return locations;
  }

  private formatRoutingContext(routingIntelligence: any): string {
    const { routeData, corridorAnalysis } = routingIntelligence;
    
    return `
## LIVE ROUTING INTELLIGENCE
**Route Overview:** ${routeData.distance} | ${routeData.duration} | ${routeData.trafficConditions}
**Corridor:** ${corridorAnalysis.originHub.name} (${corridorAnalysis.originHub.region}) → ${corridorAnalysis.destinationHub.name} (${corridorAnalysis.destinationHub.region})
**Risk Assessment:** ${corridorAnalysis.riskAssessment}/10
**Complexity:** ${corridorAnalysis.regionalComplexity}/10
**Recommended Carriers:** ${corridorAnalysis.recommendedCarriers.join(', ')}
**Cross-border Points:** ${corridorAnalysis.crossBorderPoints.join(', ') || 'Domestic route'}
**Seasonal Factors:** ${corridorAnalysis.seasonalFactors.recommendations.join(', ') || 'None'}
**Alternative Routes:** ${routeData.alternativeRoutes} available
`;
  }

  private buildEnhancedPrompt(
    message: string,
    routingContext: string,
    history: Array<{role: string, content: string}>
  ): string {
    let prompt = DEEPTALK_SYSTEM_PROMPT;
    
    if (routingContext) {
      prompt += `\n\nCurrent Route Analysis:\n${routingContext}`;
    }
    
    // Add current date and time for temporal context
    const now = new Date();
    prompt += `\n\nCurrent Time: ${now.toISOString()}`;
    prompt += `\nSeasonal Context: ${this.getSeasonalContext(now)}`;

    if (history.length > 0) {
      prompt += '\n\nConversation History:\n';
      history.slice(-6).forEach(msg => {
        prompt += `${msg.role}: ${msg.content}\n`;
      });
    }

    prompt += `\nUser: ${message}\ndeepTalk:`;
    return prompt;
  }

  private getSeasonalContext(date: Date): string {
    const month = date.getMonth();
    const contexts = [];
    
    // Rainy season (May-October)
    if (month >= 4 && month <= 9) {
      contexts.push('Rainy season active - monitor road conditions');
    }
    
    // Harmattan season (November-March)
    if (month >= 10 || month <= 2) {
      contexts.push('Harmattan season - dust storms possible in West Africa');
    }
    
    // Holiday seasons
    if (month === 11) contexts.push('Holiday season - increased cargo volumes');
    if (month === 6 || month === 7) contexts.push('Mid-year logistics peak');
    
    return contexts.join(', ') || 'Normal operational period';
  }

  private buildPrompt(
    message: string,
    context: string,
    history: Array<{role: string, content: string}>
  ): string {
    let prompt = DEEPTALK_SYSTEM_PROMPT;
    
    if (context) {
      prompt += `\nCurrent Context: ${context}`;
    }

    if (history.length > 0) {
      prompt += '\n\nConversation History:\n';
      history.slice(-6).forEach(msg => {
        prompt += `${msg.role}: ${msg.content}\n`;
      });
    }

    prompt += `\nUser: ${message}\ndeepTalk:`;
    return prompt;
  }

  private async* streamResponseChunks(result: any): AsyncGenerator<string, void, unknown> {
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        yield chunkText;
      }
    }
  }

  private getStylePrompt(style: string): string {
    switch (style) {
      case 'analytical':
        return 'Provide detailed analytical insights with data points and risk assessments.';
      case 'oracular':
        return 'Speak with the wisdom of the logistics oracle, using mystical yet practical guidance.';
      default:
        return 'Respond conversationally with practical logistics advice.';
    }
  }
}

export const geminiClient = new GeminiClient();