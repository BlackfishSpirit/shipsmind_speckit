# Front-End Design Workflow

## Overview

This comprehensive guide outlines the modern front-end design workflow using SuperDesign, shadcn MCP, TweakCN, and other powerful tools for building beautiful, functional user interfaces with Claude Code.

## Tools & Extensions Required

### Core Tools
- **SuperDesign VS Code Extension** - "Cursor for design" with interactive canvas
- **Claude Code** - AI coding agent for iterative development
- **shadcn MCP Server** - Component library context and implementation
- **TweakCN** - Theme customization for shadcn components

### Optional Tools
- **Firecrawl MCP** - Clone existing websites
- **Figma MCP** - Clone Figma designs
- **Animattopi** - Animation effects library
- **Colors.co** - Color palette generator

## Phase 1: Setup & Installation

### Install SuperDesign Extension
1. Open VS Code Extensions tab
2. Search for "SuperDesign" and install
3. Open Command Palette (`Cmd/Ctrl + Shift + P`)
4. Type "SuperDesign" and select the canvas view option
5. Initialize SuperDesign: Select "Initialize SuperDesign" from command palette

This creates a `claude.md` file in your home directory with system prompts that make Claude Code act as a senior front-end engineer.

### Configure shadcn MCP Server
Ensure the shadcn MCP server is installed and configured in your `CLAUDE.md`:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-shadcn"],
      "env": {}
    }
  }
}
```

## Phase 2: The Three-Stage Design Process

### Stage 1: Layout Phase
**Goal:** Define structure and layout without visual styling

```bash
# Example prompt
"Build the main home screen of a ride-sharing app. Create 5 different layout iterations using ASCII format to visualize layouts. Focus on structure and component placement, not styling."
```

**Key Features:**
- Uses ASCII format for quick visualization
- No code generation at this stage
- Rapid iteration on structure
- Easy to request modifications

**Sample iterations:**
- Standard layout with top search bar
- Search bar repositioned lower
- Split-screen design with divided search fields
- Recent rides section instead of quick actions

### Stage 2: Theme Design
**Goal:** Apply visual design language and styling

```bash
# Example prompt
"Take the selected layout and create 5 theme variations. Apply the color palette I'll provide and focus on different design languages - modern, glass morphism, professional, neon, cartoonish."
```

**Preparation:**
1. Use [colors.co](https://colors.co) - press spacebar to generate palettes
2. Copy CSS color palette
3. Provide to Claude Code for theming

**Theme variations typically include:**
- Modern/minimal
- Glass morphism effects
- Professional/corporate
- Neon/vibrant
- Cartoonish/playful

### Stage 3: Implementation & Animation
**Goal:** Add interactivity and polish

```bash
# Example prompt
"Implement the selected design with full interactivity. Add click animations, hover effects, and ensure all elements are functional. Create mechanical click animations that align with our design language."
```

**Features added:**
- Clickable buttons
- Interactive input fields
- Hover animations
- Click feedback
- Subtle transitions

## Phase 3: Component Implementation Workflows

### Method 1: shadcn Component Implementation

#### Create Implementation Plan
Use the `/shadcn` slash command:

```bash
/shadcn "Plan the app implementation using shadcn components. Create a detailed implementation plan and save it to implementation.md. Here's the PRD: [your requirements]"
```

#### Execute Implementation
```bash
/shadcn "Implement the app according to the implementation plan. Use the shadcn MCP server to ensure proper component usage and structure."
```

**Benefits:**
- Reduced errors through proper context
- Organized component structure
- Built-in dark/light mode support
- Professional component library

### Method 2: Custom Theme Application

Use [TweakCN](https://tweak-cn.vercel.app/) for theme customization:

1. Browse pre-made themes or create custom
2. Copy the CSS theme code
3. Apply to your implementation:

```bash
"Apply this TweakCN theme to our shadcn components: [paste CSS]"
```

### Method 3: Website Cloning

#### Using Firecrawl MCP
```bash
"Use the Firecrawl MCP to create a 1:1 clone of [website URL]. Focus on structure, layout, and functionality."
```

**Best practices:**
- Include screenshots with prompts for better results
- Works well for landing pages and marketing sites
- Captures metadata, animations, and structure

#### Using Figma MCP
```bash
"Clone this Figma design using the Figma MCP: [Figma selection link]"
```

**Process:**
1. Open Figma design
2. Select elements to clone
3. Copy selection link
4. Provide to Claude Code via Figma MCP

## Phase 4: Enhancement & Polish

### Animation Integration
Use [Animattopi](https://animattopi.vercel.app/) for curated animations:

1. Browse animation collection
2. Select complementary effects
3. Copy HTML/CSS code
4. Integrate via Claude Code:

```bash
"Add this animation effect from Animattopi to enhance user interactions: [paste code]"
```

### Responsive Design Testing
SuperDesign canvas allows device type switching:
- Test mobile layouts
- Verify tablet responsiveness
- Ensure desktop optimization

## Best Practices & Tips

### Effective Iteration
1. **Start with HTML files** - easier to modify than full frameworks
2. **Use multiple iterations** - request 3-5 variations per stage
3. **Be specific** - clear requirements lead to better results
4. **Iterate gradually** - make incremental improvements

### SuperDesign Utilities
- **Copy prompt function** - extract design specifications
- **Copy design path** - reference specific iterations
- **Real-time preview** - see changes immediately
- **Interactive testing** - click and type in preview

### Component Organization
```bash
# Clean up workflow
"Delete all design iterations except [selected design path]. Organize the final implementation for production use."
```

### Framework Conversion
After finalizing design:
```bash
"Convert this HTML implementation to [Next.js/React/Vue]. Maintain all functionality and styling while following framework best practices."
```

## Workflow Integration

### Integration with Existing Workflows
Add design phases to your feature development:

1. **Planning Phase** - Define requirements and user flows
2. **Design Phase** - Use SuperDesign workflow
3. **Implementation Phase** - Convert to production framework
4. **Testing Phase** - Ensure responsive design and functionality
5. **Review Phase** - Use design-review agent for UI assessment

### Slash Commands for Design Workflow

Create custom slash commands for common design tasks:

```bash
# /design-layout
"Create 5 layout iterations for [component/page description] using SuperDesign workflow"

# /design-theme
"Apply 5 different theme variations to the selected layout using [color palette]"

# /design-implement
"Implement the final design with full interactivity and animations"

# /design-shadcn
"Convert this design to use shadcn components with proper MCP context"
```

## Resources & References

- **SuperDesign Extension:** VS Code/Cursor marketplace
- **shadcn/ui:** [ui.shadcn.com](https://ui.shadcn.com)
- **TweakCN:** [tweak-cn.vercel.app](https://tweak-cn.vercel.app)
- **Colors.co:** [colors.co](https://colors.co)
- **Animattopi:** [animattopi.vercel.app](https://animattopi.vercel.app)
- **Original Video:** [YouTube - Advanced UI Design with Claude Code](https://www.youtube.com/watch?v=McJluKfjVGk)

## Troubleshooting

### Common Issues
- **Colors not applying:** Ensure CSS palette is properly formatted
- **Components breaking:** Use shadcn MCP for proper context
- **Canvas not updating:** Refresh SuperDesign view
- **Animation issues:** Check for conflicting CSS

### Performance Tips
- Use HTML files for initial iterations
- Clean up unused design files
- Optimize images and animations
- Test on multiple devices through canvas