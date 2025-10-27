/**
 * Task Classification System
 * Analyzes user messages to determine the type of task and optimal provider
 */

export type TaskType = 
  | 'code-generation'
  | 'code-debugging'
  | 'code-review'
  | 'reasoning'
  | 'creative-writing'
  | 'translation'
  | 'math-calculation'
  | 'data-analysis'
  | 'general-conversation'
  | 'summarization'
  | 'research';

export interface TaskClassification {
  type: TaskType;
  confidence: number; // 0-1
  complexity: 'low' | 'medium' | 'high';
  requiresTools: boolean;
  estimatedTokens: number;
}

// Keywords for different task types
const TASK_PATTERNS: Record<TaskType, RegExp[]> = {
  'code-generation': [
    /write\s+(a|an|some)?\s*(function|class|component|script|program|code)/i,
    /create\s+(a|an)?\s*(function|class|component|api|endpoint)/i,
    /implement\s+/i,
    /build\s+(a|an)?\s*(app|feature|component|function)/i,
    /generate\s+(code|function|class)/i,
    /(javascript|typescript|python|java|rust|go|c\+\+|react|vue|angular)/i,
  ],
  'code-debugging': [
    /debug|fix\s+(this|the|my)\s+(code|error|bug)/i,
    /why\s+(isn't|doesn't|won't)\s+(this|my)\s+code/i,
    /error|exception|stack\s+trace/i,
    /not\s+working/i,
    /broken/i,
  ],
  'code-review': [
    /review\s+(this|my)\s+code/i,
    /what\s+(do\s+you\s+)?think\s+(of|about)\s+(this|my)\s+code/i,
    /optimize|improve\s+(this|my)\s+code/i,
    /best\s+practices/i,
  ],
  'reasoning': [
    /why\s+(does|is|should|would)/i,
    /explain\s+(why|how|the)/i,
    /what\s+is\s+the\s+(reason|logic|rationale)/i,
    /analyze/i,
    /compare|contrast/i,
    /pros\s+and\s+cons/i,
    /should\s+i/i,
  ],
  'creative-writing': [
    /write\s+(a|an)?\s*(story|poem|essay|article|blog|script)/i,
    /creative|imaginative/i,
    /fiction|narrative/i,
    /brainstorm/i,
    /come\s+up\s+with\s+(ideas|names|titles)/i,
  ],
  'translation': [
    /translate\s+(this|to|from|into)/i,
    /(in\s+)?(chinese|spanish|french|german|japanese|korean|arabic|hindi|russian)/i,
    /what\s+(does|is)\s+.*\s+in\s+(english|spanish|french)/i,
  ],
  'math-calculation': [
    /calculate|compute|solve/i,
    /what\s+is\s+\d+[\+\-\*\/\^]/i,
    /math|mathematical|equation/i,
    /derivative|integral|probability|statistics/i,
  ],
  'data-analysis': [
    /analyze\s+(this|the)\s+data/i,
    /data\s+analysis/i,
    /visualize|chart|graph/i,
    /statistics|trends|patterns/i,
    /dataset/i,
  ],
  'summarization': [
    /summarize|summary/i,
    /tldr|tl;dr/i,
    /key\s+points/i,
    /brief\s+(overview|summary)/i,
    /in\s+short/i,
  ],
  'research': [
    /research|investigate/i,
    /find\s+(information|data|sources)/i,
    /what\s+(are|is)\s+the\s+(latest|current|recent)/i,
    /tell\s+me\s+about/i,
    /learn\s+about/i,
  ],
  'general-conversation': [
    /hello|hi|hey|greetings/i,
    /how\s+are\s+you/i,
    /thank/i,
    /what\s+can\s+you\s+do/i,
  ],
};

// Tools that might be needed
const TOOL_PATTERNS = [
  /weather|temperature|forecast/i,
  /search|google|find\s+online/i,
  /calculate|math/i,
  /current|today|now|latest/i,
];

export class TaskClassifier {
  /**
   * Classify a user message into a task type
   */
  classify(message: string): TaskClassification {
    const scores: Record<TaskType, number> = {
      'code-generation': 0,
      'code-debugging': 0,
      'code-review': 0,
      'reasoning': 0,
      'creative-writing': 0,
      'translation': 0,
      'math-calculation': 0,
      'data-analysis': 0,
      'general-conversation': 0,
      'summarization': 0,
      'research': 0,
    };

    // Calculate scores for each task type
    for (const [taskType, patterns] of Object.entries(TASK_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(message)) {
          scores[taskType as TaskType] += 1;
        }
      }
    }

    // Find the task type with highest score
    const entries = Object.entries(scores);
    const [topTaskType, topScore] = entries.reduce((a, b) => (b[1] > a[1] ? b : a));

    // Default to general conversation if no clear match
    const taskType = topScore > 0 ? (topTaskType as TaskType) : 'general-conversation';
    
    // Calculate confidence based on score distribution
    const totalScore = entries.reduce((sum, [, score]) => sum + score, 0);
    const confidence = totalScore > 0 ? topScore / totalScore : 0.3;

    // Determine complexity based on message length and structure
    const complexity = this.estimateComplexity(message, taskType);

    // Check if tools might be needed
    const requiresTools = TOOL_PATTERNS.some(pattern => pattern.test(message));

    // Estimate token count (rough approximation)
    const estimatedTokens = Math.ceil(message.length / 4);

    return {
      type: taskType,
      confidence,
      complexity,
      requiresTools,
      estimatedTokens,
    };
  }

  /**
   * Estimate task complexity
   */
  private estimateComplexity(message: string, taskType: TaskType): 'low' | 'medium' | 'high' {
    const length = message.length;
    
    // Code tasks are generally more complex
    if (['code-generation', 'code-debugging', 'code-review'].includes(taskType)) {
      if (length > 500) return 'high';
      if (length > 200) return 'medium';
      return 'medium'; // Even short code tasks are at least medium
    }

    // Creative and reasoning tasks scale with length
    if (['creative-writing', 'reasoning', 'research'].includes(taskType)) {
      if (length > 300) return 'high';
      if (length > 100) return 'medium';
      return 'low';
    }

    // Simple tasks
    if (length > 400) return 'high';
    if (length > 150) return 'medium';
    return 'low';
  }

  /**
   * Get user-friendly description of task type
   */
  getTaskDescription(taskType: TaskType): string {
    const descriptions: Record<TaskType, string> = {
      'code-generation': 'Writing code',
      'code-debugging': 'Debugging code',
      'code-review': 'Reviewing code',
      'reasoning': 'Logical reasoning',
      'creative-writing': 'Creative writing',
      'translation': 'Translation',
      'math-calculation': 'Mathematical calculation',
      'data-analysis': 'Data analysis',
      'general-conversation': 'General conversation',
      'summarization': 'Summarization',
      'research': 'Research',
    };
    return descriptions[taskType];
  }
}

