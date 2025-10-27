# XML System Prompts Guide

This guide explains how to effectively use XML-structured prompts in Codetopic.

## Overview

XML system prompts provide clear structure and context for AI interactions. They help the AI model understand:

- The role it should play
- Its capabilities and constraints
- Guidelines for responses
- The context of the interaction

## Basic Structure

```xml
<instructions>
  <role>Expert Code Assistant</role>
  
  <capabilities>
    <code-analysis>Analyze and understand code patterns</code-analysis>
    <suggestions>Provide intelligent code improvements</suggestions>
    <documentation>Generate comprehensive documentation</documentation>
  </capabilities>

  <guidelines>
    <communication>Clear and concise explanations</communication>
    <code-style>Follow language conventions</code-style>
    <best-practices>Adhere to modern standards</best-practices>
  </guidelines>

  <constraints>
    <security>No harmful code generation</security>
    <licensing>Respect code licenses</licensing>
    <privacy>Protect sensitive data</privacy>
  </constraints>
</instructions>
```

## Using XML Prompts

### 1. Role Definition

```xml
<role>
  <title>Python Expert</title>
  <expertise>
    <language>Python</language>
    <frameworks>Django, Flask, FastAPI</frameworks>
    <specialties>Web Development, Data Science</specialties>
  </expertise>
</role>
```

### 2. Task Instructions

```xml
<task>
  <objective>Code Review</objective>
  <focus>
    <performance>Optimize for speed</performance>
    <security>Check for vulnerabilities</security>
    <style>Verify PEP 8 compliance</style>
  </focus>
</task>
```

### 3. Response Format

```xml
<response-format>
  <structure>
    <summary>Brief overview</summary>
    <issues>List of problems found</issues>
    <suggestions>Recommended improvements</suggestions>
    <code-samples>Example fixes</code-samples>
  </structure>
</response-format>
```

## Best Practices

1. Be Specific
   - Use clear, descriptive tags
   - Include relevant context
   - Specify constraints

2. Maintain Hierarchy
   - Group related elements
   - Use nested tags logically
   - Keep structure consistent

3. Include Examples
   - Provide sample inputs
   - Show expected outputs
   - Demonstrate edge cases

4. Set Constraints
   - Define limitations
   - Specify requirements
   - Include validation rules

## Examples

### Code Analysis Prompt

```xml
<analysis-request>
  <target>Python Script</target>
  <aspects>
    <performance>Memory usage</performance>
    <complexity>Time complexity</complexity>
    <maintainability>Code structure</maintainability>
  </aspects>
  <output-format>
    <sections>
      <overview>High-level summary</overview>
      <metrics>Key performance indicators</metrics>
      <recommendations>Suggested improvements</recommendations>
    </sections>
  </output-format>
</analysis-request>
```

### Documentation Generation

```xml
<documentation-request>
  <style>Google Style Python Docstrings</style>
  <include>
    <elements>
      <functions>All public methods</functions>
      <classes>Class documentation</classes>
      <modules>Module-level docs</modules>
    </elements>
    <sections>
      <description>Detailed explanation</description>
      <parameters>Input parameters</parameters>
      <returns>Return values</returns>
      <examples>Usage examples</examples>
    </sections>
  </include>
</documentation-request>
```

## Integration with Codetopic

### Agent Configuration

```typescript
const agent = new CodetopicAgent({
  systemPrompt: `
    <instructions>
      <role>Code Review Specialist</role>
      <capabilities>
        <analysis>Deep code understanding</analysis>
        <suggestions>Smart improvements</suggestions>
      </capabilities>
    </instructions>
  `
});
```

### Custom Prompts

```typescript
const customPrompt = `
  <code-review>
    <language>${language}</language>
    <focus>${focus}</focus>
    <requirements>${requirements}</requirements>
  </code-review>
`;

const response = await agent.analyze(customPrompt, codeString);
```

## Additional Resources

- [XML Schema Documentation](docs/schema.md)
- [Prompt Examples](docs/examples.md)
- [Integration Guide](docs/integration.md)

## Contributing

When adding new XML prompt patterns:

1. Follow the established schema
2. Include comprehensive examples
3. Document edge cases
4. Add tests for validation

For more information, see our [contribution guidelines](CONTRIBUTING.md).
