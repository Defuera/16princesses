# Research: 16Princesses Test Technical Decisions

**Feature**: 16Princesses Test (Interactive Princess Personality Website)
**Phase**: 0 - Outline & Research
**Date**: 2025-09-27

## Executive Summary

Research completed for simple MVP static website implementation. All technical unknowns resolved with focus on constitutional compliance (static architecture, minimal dependencies, accessibility, user experience).

## Technology Stack Decisions

### React + Vite Development Framework

**Decision**: Use React with Vite build tool for optimal developer experience
**Rationale**: 
- Prioritizes development speed and maintainability per updated constitutional principle II
- Hot reload for instant feedback during development
- Component architecture improves code organization and maintainability
- TypeScript integration provides better error catching and IDE support
- Large ecosystem and community support
- Compiles to static files (no server runtime required)

**Alternatives Considered**:
- **Vanilla HTML/CSS/JS**: Slower development, more repetitive code, harder to maintain
- **Vue + Vite**: Lighter learning curve but smaller ecosystem
- **Next.js**: More complex, server-side focused by default
- **Svelte**: Smaller bundle but less mature ecosystem

**Implementation Notes**:
- Use TypeScript for better development experience
- React Router for client-side navigation between princess list and graph
- Component structure: PrincessList, PrincessGraph, PrincessMessage
- CSS modules or styled-components for scoped styling

### Chart.js for Scatter Plot Visualization

**Decision**: Use Chart.js with react-chartjs-2 wrapper for scatter plot functionality
**Rationale**: 
- Provides built-in scatter plot functionality with minimal configuration
- React wrapper simplifies integration with component lifecycle
- Good accessibility support (ARIA labels, keyboard navigation)  
- Reasonable bundle size (~60KB minified for Chart.js)
- Well-documented API for customization
- Strong browser compatibility

**Alternatives Considered**:
- **Native Canvas**: More complex to implement, requires custom accessibility features
- **D3.js**: Overkill for simple scatter plot, large bundle size, steeper learning curve  
- **Recharts**: React-native but more complex API for scatter plots
- **Victory**: Good React integration but larger bundle size

**Implementation Notes**:
- Install via npm: `chart.js` and `react-chartjs-2`
- Create reusable PrincessGraph component
- Configure for 2D scatter plot with hover tooltips
- Custom styling to match 16Personalities aesthetic

### Responsive Design Strategy

**Decision**: CSS Grid + Flexbox with mobile-first approach, using CSS modules for component styling
**Rationale**:
- Modern browser support meets constitutional requirements
- Flexible layout system for princess list and graph display
- CSS modules provide scoped styling without conflicts
- Excellent accessibility support
- Integrates well with Vite build process

**Alternatives Considered**:
- **Styled-components**: Runtime CSS-in-JS adds bundle overhead
- **Tailwind CSS**: Utility classes but larger learning curve and setup
- **CSS-in-JS libraries**: More complex setup, runtime performance cost
- **Global CSS**: Risk of style conflicts in larger applications

**Implementation Notes**:
- Mobile breakpoint: 768px
- Tablet breakpoint: 1024px  
- Desktop: 1024px+
- Princess list: vertical stack on mobile, grid on desktop
- Graph: full-width responsive scaling
- Use CSS modules (`.module.css`) for component-scoped styles

### Data Storage and Management

**Decision**: Static JSON file generated from GRAPH.md source data
**Rationale**:
- Aligns with static site architecture requirement
- Single source of truth (GRAPH.md) maintains data accuracy principle
- Version controlled alongside code
- No server dependencies required
- Easy deployment and CDN caching

**Alternatives Considered**:
- **External API**: Violates static architecture principle, adds complexity
- **Hardcoded JavaScript**: Poor maintainability, violates single source of truth
- **CSV/Other formats**: Less JavaScript-friendly, requires parsing overhead

**Implementation Notes**:
- Build simple conversion script: GRAPH.md → princesses.json
- Include all required fields: name, source, feminism %, bitchiness %, personality message
- Validate data integrity during conversion

### Personality Message Generation

**Decision**: Rule-based system using percentage thresholds
**Rationale**:
- Simple, predictable algorithm for MVP
- Maintains consistency with princess personality data
- Easy to test and validate
- Expandable for future feature additions

**Rules Defined**:
```
High Bitchiness (>70%) + High Feminism (>70%): "You're a fierce, independent force! 👑"
High Bitchiness (>70%) + Low Feminism (<30%): "You're assertive with traditional values! 💪"  
Low Bitchiness (<30%) + High Feminism (>70%): "You're a gentle revolutionary! 🌸"
Low Bitchiness (<30%) + Low Feminism (<30%): "You're such a sweetheart! 💖"
[Middle ranges get balanced messages]
```

**Alternatives Considered**:
- **Complex personality analysis**: Over-engineering for MVP
- **Random message selection**: Inconsistent user experience
- **User input based**: Adds complexity to 2-step flow

## Architecture Decisions

### Project Structure

**Decision**: React Single-Page Application with client-side routing
**Rationale**:
- Meets 2-step flow requirement from clarifications
- Component-based architecture improves maintainability
- React Router enables smooth navigation without page reloads
- Single HTML template with dynamic content switching
- Easy state management between navigation steps

**Component Structure**:
1. **PrincessList**: Princess selection list component
2. **PrincessGraph**: Graph display component with selected princess
3. **App**: Main routing component managing navigation flow

### Development Workflow

**Decision**: Modern React development with Vite tooling and automated validation
**Rationale**:
- Prioritizes development speed per updated constitutional principle II
- Hot reload provides instant feedback for rapid iteration
- TypeScript catches errors during development, not runtime
- Integrated build process handles optimization automatically
- Modern tooling improves developer productivity

**Development Tools**:
- Vite dev server with hot module replacement
- TypeScript for compile-time error checking
- ESLint + Prettier for code consistency
- Vitest for unit testing React components
- React Developer Tools for debugging

**Validation Tools**:
- WAVE Web Accessibility Evaluator
- Lighthouse accessibility audit
- Manual keyboard navigation testing
- Screen reader testing (VoiceOver/NVDA)

## Performance Considerations

### Loading Strategy

**Decision**: Optimize for fast initial page load
**Rationale**:
- Constitutional quality standard (fast loading)
- Static assets enable aggressive caching
- Chart.js loaded only on result page (lazy loading)

**Implementation**:
- Minimize initial HTML/CSS payload
- Load Chart.js dynamically on result page
- Optimize princess data JSON structure
- Use browser caching headers

### Browser Compatibility

**Decision**: Support last 2 major versions of Chrome, Firefox, Safari, Edge
**Rationale**:
- Meets constitutional browser compatibility requirement
- ES6+ features available across target browsers
- Chart.js compatibility aligns with browser support

## Security and Privacy

### Data Handling

**Decision**: Client-side only, no personal data collection
**Rationale**:
- Static site principle eliminates server-side security concerns
- No user data storage required
- Princess selection via URL parameters (shareable, no persistence)

### Content Security

**Decision**: Serve from trusted CDN, validate all external resources
**Rationale**:
- Chart.js from official CDN with integrity checks
- No user-generated content
- Static assets reduce attack surface

## Implementation Readiness

### Prerequisites Satisfied:
- [x] Technical stack decisions finalized
- [x] Architecture approach validated against constitution  
- [x] Performance strategy defined
- [x] Accessibility approach planned
- [x] Browser compatibility confirmed
- [x] Security considerations addressed

### Ready for Phase 1 (Design & Contracts):
- Data model definition
- API contracts (static data schema)
- Test scenario planning
- Quickstart guide creation

**Research Phase Complete** ✅
