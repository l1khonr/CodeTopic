# Action Engine - Execute Complex Workflows

Transform your AI from answering questions to **executing work across your entire stack**.

## Overview

The Action Engine enables your AI to:
- Execute multi-step workflows in minutes
- Connect to your entire tool stack
- Run tasks in parallel for speed
- Coordinate across teams and tools
- Scale with your ambition

## Available Integrations

### GitHub
- Create issues and pull requests
- Search code across repositories
- Manage branches and deployments
- Track project milestones

### Notion
- Create and update pages
- Query databases
- Manage project docs
- Organize knowledge

### Slack
- Send messages and notifications
- Upload files
- Manage channels
- Collaborate with teams

### Google Calendar
- Create and manage events
- Schedule meetings
- Track deadlines
- Coordinate schedules

### Stripe
- Create customers
- Generate invoices
- Manage subscriptions
- Track payments

## Usage

### Basic Workflow

```typescript
import { executeComplexWorkflow } from '@/lib/action-engine/workflow';

const result = await executeComplexWorkflow(
  'Create a GitHub issue, send Slack notification, and schedule calendar event'
);

console.log(`✅ Executed ${result.taskCount} tasks in ${result.duration}ms`);
```

### API Endpoint

```bash
# Execute workflow
curl -X POST http://localhost:3000/api/action-engine \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Deploy to production and notify team"
  }'
```

### Parallel Execution

```typescript
import { deploymentWorkflow } from '@/lib/action-engine/workflow';

// Execute deployment workflow
// - Creates GitHub issue
// - Opens pull request
// - Sends Slack message
// - Creates calendar event
// All in parallel where possible!
const result = await deploymentWorkflow();
```

## GUI Agent Capabilities

Interact with web interfaces automatically:

```typescript
import { allGuiTools } from '@/lib/gui-agent';

// Click elements
await allGuiTools.clickElement.execute({
  selector: 'button.deploy',
  text: 'Deploy Now'
});

// Fill forms
await allGuiTools.fillForm.execute({
  fields: {
    'input[name="email"]': 'user@example.com',
    'input[name="password"]': 'secure123'
  }
});

// Take screenshots
await allGuiTools.takeScreenshot.execute({
  fullPage: true
});
```

## Example Workflows

### 1. Complete Deployment

```typescript
const deployment = await executeComplexWorkflow(`
  Create a GitHub issue titled "Deploy v1.0.0",
  open a pull request to main,
  send a message to #deployments Slack channel,
  and create a calendar event for the deployment window
`);
```

### 2. Customer Onboarding

```typescript
const onboarding = await executeComplexWorkflow(`
  Create a Stripe customer,
  add a Notion page with customer details,
  send a welcome Slack message,
  and schedule a follow-up calendar event
`);
```

### 3. Project Launch

```typescript
const launch = await executeComplexWorkflow(`
  Create GitHub milestones,
  update Notion project database,
  notify team in Slack,
  block calendar for launch day
`);
```

## Configuration

### Environment Variables

```env
# GitHub
GITHUB_TOKEN=ghp_your_token
GITHUB_OWNER=your-org
GITHUB_REPO=your-repo

# Notion
NOTION_API_KEY=secret_xxx
NOTION_DATABASE_ID=xxx

# Slack
SLACK_BOT_TOKEN=xoxb-xxx
SLACK_TEAM_ID=Txxx

# Google Calendar
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALENDAR_ID=xxx

# Stripe
STRIPE_API_KEY=sk_test_xxx
```

## Advanced Features

### Conditional Execution

```typescript
{
  id: 'task-1',
  action: 'createIssue',
  condition: 'if deploymentBranch === "main"',
  parameters: { ... }
}
```

### Parallel vs Sequential

```typescript
// Parallel (default)
executeWorkflow(tasks, { parallel: true });

// Sequential
executeWorkflow(tasks, { parallel: false });
```

### Error Handling

```typescript
try {
  const result = await executeComplexWorkflow(description);
  if (result.success) {
    console.log('All tasks completed');
  } else {
    console.log('Some tasks failed:', result.results.filter(r => r.error));
  }
} catch (error) {
  console.error('Workflow failed:', error);
}
```

## Tools & Extensions

### Available Tools

```typescript
// GitHub
createIssue, createPR, searchCode, createBranch, mergePR

// Notion
createPage, updateDatabase, queryDatabase, updatePage

// Slack
sendMessage, uploadFile, createChannel, addReaction

// Calendar
createEvent, listEvents, updateEvent, deleteEvent

// Stripe
createCustomer, createInvoice, listInvoices, updateSubscription
```

### Adding Custom Tools

```typescript
import { tool } from 'ai';

export const myCustomTool = tool({
  description: 'Your tool description',
  parameters: z.object({
    param: z.string(),
  }),
  execute: async ({ param }) => {
    // Your logic
    return { success: true };
  },
});
```

## Performance

- **Fast Execution**: Tasks run in parallel where possible
- **Smart Scheduling**: Dependency-aware task ordering
- **Efficient Batching**: Groups similar tasks
- **Rate Limiting**: Respects API limits
- **Error Recovery**: Retries failed tasks

## Best Practices

1. **Define Clear Goals**: Make workflow descriptions specific
2. **Use Dependencies**: Control task execution order
3. **Handle Errors**: Implement fallback strategies
4. **Monitor Progress**: Track task completion
5. **Test Workflows**: Verify in staging first
6. **Document Workflows**: Keep descriptions clear

## Examples

See `lib/action-engine/workflow.ts` for complete examples including:
- Deployment workflows
- Customer onboarding
- Issue triage
- Report generation
- Data migration

## Learn More

- See `lib/action-engine/tools.ts` for all available tools
- See `lib/gui-agent.ts` for GUI automation
- See `.cursorrules` for AI agent configuration

## Brand Identity

This project uses:
- **Colors**: Black (#34322D), Gray (#F8F8F8), White (#FFFFFF)
- **Serif**: Libre Baskerville (for titles)
- **Sans-Serif**: DM Sans (for UI)
- **Monospace**: Geist Mono (for code)

