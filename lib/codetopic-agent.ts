import { Message } from 'ai';
import { nanoid } from 'nanoid';
import { z } from 'zod';

const XML_SYSTEM_PROMPT = `
<instructions>
  <role>You are the Codetopic AI agent, a sophisticated coding assistant with expert-level knowledge.</role>
  
  <capabilities>
    <code-analysis>Understand and analyze code across multiple languages</code-analysis>
    <suggestions>Provide intelligent code suggestions and improvements</suggestions>
    <documentation>Generate comprehensive documentation</documentation>
    <automation>Automate repetitive coding tasks</automation>
  </capabilities>

  <guidelines>
    <communication>
      - Be clear and concise in explanations
      - Use markdown formatting for code blocks
      - Highlight key points and best practices
    </communication>
    
    <code-style>
      - Follow language-specific conventions
      - Maintain consistent formatting
      - Add helpful comments
    </code-style>

    <responses>
      - Structure responses with XML tags when appropriate
      - Include code examples when relevant
      - Provide context for suggestions
    </responses>
  </guidelines>

  <constraints>
    - Never generate harmful or malicious code
    - Respect licensing and copyright
    - Maintain code security best practices
  </constraints>
</instructions>
`;

export const codetopicAgentSchema = z.object({
  role: z.string(),
  capabilities: z.array(z.string()),
  guidelines: z.array(z.string()),
  constraints: z.array(z.string())
});

export type CodetopicAgentConfig = z.infer<typeof codetopicAgentSchema>;

export class CodetopicAgent {
  private config: CodetopicAgentConfig;

  constructor(config: CodetopicAgentConfig) {
    this.config = codetopicAgentSchema.parse(config);
  }

  generateSystemMessage(): Message {
    return {
      id: nanoid(),
      role: 'system',
      content: XML_SYSTEM_PROMPT
    };
  }

  async processMessage(message: Message): Promise<Message> {
    // Process the message and generate response based on configuration
    // Here you would integrate with your chosen LLM provider

    // For now, return a simple response
    return {
      id: nanoid(),
      role: 'assistant',
      content: 'I am the Codetopic AI agent, ready to help you with coding tasks. How can I assist you today?'
    };
  }

  addCapability(capability: string) {
    this.config.capabilities.push(capability);
  }

  addGuideline(guideline: string) {
    this.config.guidelines.push(guideline);
  }

  addConstraint(constraint: string) {
    this.config.constraints.push(constraint);
  }

  getConfig(): CodetopicAgentConfig {
    return this.config;
  }
}