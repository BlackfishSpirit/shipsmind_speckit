# Design Start Command

Quick-start command to begin a new front-end design workflow with SuperDesign integration.

## Usage
```
/design-start "Brief description of what you want to design"
```

## What This Command Does
1. **Initializes SuperDesign**: Sets up the design canvas and context
2. **Gathers Requirements**: Asks clarifying questions about the design
3. **Creates Project Structure**: Sets up files and documentation
4. **Launches Phase 1**: Begins with layout iterations

## Process Flow
1. **Requirement Gathering** (2 min)
   - Target audience analysis
   - Functional requirements
   - Design constraints
   - Technical considerations

2. **Setup Verification** (1 min)
   - SuperDesign extension installed
   - Canvas view accessible
   - Color palette ready
   - Documentation structure

3. **Layout Phase Launch** (immediate)
   - Generate 3-5 layout options
   - ASCII visualization
   - Component placement strategy
   - User flow mapping

## Example Usage

### E-commerce Product Page
```
/design-start "Product detail page for an online electronics store. Needs product images, specifications, pricing, reviews, and add-to-cart functionality."
```

### SaaS Dashboard
```
/design-start "Analytics dashboard for a marketing automation platform. Users need to see campaign performance, audience insights, and quick action buttons."
```

### Landing Page
```
/design-start "Landing page for a B2B software company. Should showcase product benefits, customer testimonials, pricing tiers, and lead capture form."
```

### Mobile App Screen
```
/design-start "Mobile app screen for expense tracking. Users need to add expenses, categorize them, view spending summaries, and set budgets."
```

## Prerequisites Checked
- [ ] SuperDesign VS Code extension installed
- [ ] shadcn MCP server configured
- [ ] Claude Code with design context loaded
- [ ] Color palette tool (colors.co) accessible
- [ ] Project documentation structure ready

## Output Structure
The command creates:
- **Design Brief**: Documented requirements and constraints
- **Layout Iterations**: 3-5 structural options with ASCII visualization
- **Next Steps**: Clear guidance for theme phase
- **Resource Links**: Quick access to design tools
- **Progress Tracking**: Integration with workflow dashboard

## Integration Points
- **Feature Tracking**: Links to specific feature in development workflow
- **Documentation**: Maintains design decisions and rationale
- **Progress Updates**: Reports completion status to workflow system
- **Quality Gates**: Sets up design review checkpoints

This command streamlines the design initiation process, ensuring all prerequisites are met and the workflow begins efficiently with proper documentation and structure.