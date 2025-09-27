# Research: 16Princesses Test Technical Decisions

**Feature**: 16Princesses Test (Interactive Princess Personality Website)
**Phase**: 0 - Outline & Research
**Date**: 2025-09-27

## Executive Summary

Research completed for simple MVP static website implementation. All technical unknowns resolved with focus on constitutional compliance (static architecture, minimal dependencies, accessibility, user experience).

## Technology Stack Decisions

### Chart.js for Scatter Plot Visualization

**Decision**: Use Chart.js library for scatter plot functionality
**Rationale**: 
- Provides built-in scatter plot functionality with minimal configuration
- Good accessibility support (ARIA labels, keyboard navigation)  
- Reasonable bundle size (~60KB minified)
- Well-documented API for customization
- Strong browser compatibility

**Alternatives Considered**:
- **Native Canvas**: More complex to implement, requires custom accessibility features
- **D3.js**: Overkill for simple scatter plot, large bundle size, steeper learning curve  
- **SVG with vanilla JS**: Requires significant custom code for interactivity
- **Plotly.js**: Too heavy for MVP, more features than needed

**Implementation Notes**:
- Use CDN version for simplicity (aligns with minimal dependencies principle)
- Configure for 2D scatter plot with hover tooltips
- Custom styling to match 16Personalities aesthetic

### Responsive Design Strategy

**Decision**: CSS Grid + Flexbox with mobile-first approach
**Rationale**:
- Modern browser support meets constitutional requirements
- Flexible layout system for princess list and graph display
- Native CSS solution (no framework dependencies)
- Excellent accessibility support
- Performance benefits over JavaScript-based solutions

**Alternatives Considered**:
- **Bootstrap/CSS Frameworks**: Adds complexity and bundle size against minimal dependencies principle
- **CSS Table Layouts**: Poor mobile experience, accessibility concerns
- **JavaScript Layout Libraries**: Violates static architecture principle

**Implementation Notes**:
- Mobile breakpoint: 768px
- Tablet breakpoint: 1024px  
- Desktop: 1024px+
- Princess list: vertical stack on mobile, grid on desktop
- Graph: full-width responsive scaling

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

**Decision**: Single-page application with navigation
**Rationale**:
- Meets 2-step flow requirement from clarifications
- Simple deployment (2 HTML files)
- Fast loading (pre-cached assets)
- Easy maintenance and updates

**Page Structure**:
1. **index.html**: Princess selection list page
2. **result.html**: Graph display with selected princess

### Development Workflow

**Decision**: Manual development with accessibility validation
**Rationale**:
- Aligns with simple architecture principle
- No complex build pipeline required
- Direct HTML/CSS/JS development
- Focus on constitutional accessibility requirements

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
