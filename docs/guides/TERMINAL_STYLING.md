# Terminal Text Styling Guide

## Text Hierarchy

### Headers and Text Levels

- **Headers**: Use bold formatting
  - For markdown headers, preserve the `#` signs
  - Example: **Configuration Settings**

- **Primary Text**: Use default formatting
  - Main content and instructions
  - Command output
  - Default terminal text

- **Secondary Text**: Use dim formatting
  - Additional context
  - Optional information
  - Help text and descriptions

## Color Guidelines

### Recommended Colors

- **Default Color**: Use for most text
  - Standard output
  - General information
  - Use `reset` to return to default

- **Cyan**: User interaction elements
  - Input prompts
  - Selection indicators
  - Status messages
  - Interactive elements

- **Green**: Positive indicators
  - Success messages
  - Added items
  - Completed tasks
  - Valid states

- **Red**: Warning and error states
  - Error messages
  - Failed operations
  - Deleted items
  - Invalid states

- **Magenta**: Codex-specific elements
  - Codex messages
  - Codex status updates
  - Codex-related information

### Colors to Avoid

1. **Custom Colors**
   - Avoid non-standard ANSI colors
   - May not contrast well across themes
   - Exception: shimmer.rs (uses level-adjusted default colors)

2. **Black and White**
   - Don't use ANSI black/white as foreground
   - Let terminal default handle these
   - Exception: When needed for background contrast
   - Use `reset` to return to terminal defaults

3. **Blue and Yellow**
   - Currently not part of style guidelines
   - Use recommended colors instead
   - Prefer cyan for user interaction
   - Use green for success states

## Implementation Notes

- Style rules are enforced in `clippy.toml`
- Consider terminal theme compatibility
- Maintain consistent color usage across application
- Test contrast in various terminal themes
