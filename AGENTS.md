<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Conventions

When git committing, use only a short summary in the conventional commits standard.

# Validation

For UI changes: 
Always use the chrome-devtools MCP to record the baseline before changing things. After finishing changes, verify them using chrome-devtools MCP. Click around to verify interactive elements or UX changes.

Validate using typescript check and eslint. Use prettier to format before finishing changes.

# Design

Stick to existing conventions.
Don't hardcode color or size values, stick with Tailwind presets or design system colors.
