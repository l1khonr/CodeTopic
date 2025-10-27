# Task Execution Flow Sequence Diagram

```mermaid
sequenceDiagram
    box UI
    participant user as User
    end
    box Daemon
    participant session as Session
    participant task1 as Task1
    participant task2 as Task2
    end
    box Rest API
    participant agent as Model
    end
    
    %% Initial Task Flow
    user->>session: Op::UserInput
    session-->>+task1: start task
    task1->>user: Event::TaskStarted
    task1->>agent: prompt
    agent->>task1: response (exec)
    task1->>task1: exec (auto-approved)
    task1->>user: Event::TurnComplete
    task1->>agent: stdout
    task1->>agent: response (exec)
    task1->>task1: exec (auto-approved)
    
    %% Task Interruption
    user->>task1: Op::Interrupt
    task1->>-user: Event::Error("interrupted")
    
    %% New Task with Context
    user->>session: Op::UserInput w/ last_response_id
    session-->>+task2: start task
    task2->>user: Event::TaskStarted
    task2->>agent: prompt + Task1 last_response_id
    agent->>task2: response (exec)
    task2->>task2: exec (auto-approve)
    task2->>user: Event::TurnCompleted
    task2->>agent: stdout
    agent->>task2: msg + completed
    task2->>user: Event::AgentMessage
    task2->>user: Event::TurnCompleted
    task2->>-user: Event::TaskCompleted
```

## Diagram Description

This sequence diagram illustrates the interaction flow between different components in the system:

### Components

- **User**: The end user interface
- **Session**: The daemon session manager
- **Task1/Task2**: Individual task executors
- **Model**: The REST API model/agent

### Flow Explanation

1. Initial task execution:
   - User sends input to session
   - Session starts Task1
   - Task1 interacts with Model and executes commands

2. Task interruption:
   - User interrupts Task1
   - Task1 returns error and terminates

3. New task with context:
   - User starts new task with reference to previous response
   - Session starts Task2
   - Task2 includes context from Task1
   - Task2 completes successfully

### Key Events

- `Op::UserInput`: User input operation
- `Event::TaskStarted`: Task initialization notification
- `Event::TurnComplete`: Single turn completion
- `Event::Error`: Error notification
- `Event::AgentMessage`: Model message event
- `Event::TaskCompleted`: Task completion notification

### Notes

- Auto-approval is used for command execution
- Tasks can reference previous responses using `last_response_id`
- Tasks can be interrupted by user operation