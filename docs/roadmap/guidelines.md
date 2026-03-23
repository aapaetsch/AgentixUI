# Guidelines, Notes & Decisions

## Component Complexity Guidelines

**Free Tier Criteria:**
- Essential primitives needed in any application
- Single-purpose components
- Minimal configuration required
- Base form controls
- Basic layout utilities
- Core utility overlays (Dialog, Popover, Tooltip)

**Premium Tier Criteria:**
- Multi-feature components with complex state
- Significant development time investment
- Often requires third-party dependencies
- Advanced interactions (drag & drop, virtualization)
- Specialized use cases (data tables, date pickers)

**Enterprise Tier Criteria:**
- Full page layouts and templates
- Multiple components composed together
- Business-logic patterns included
- Comprehensive documentation & examples
- Real-world use case implementations

---

## Notes & Decisions

### Free Tier Rationale
These components are industry-standard primitives that users expect for free:
- **Base controls:** Button, Input, Select, Switch, Checkbox, Textarea, Radio
- **Display:** Typography, Badge, Avatar
- **Layout:** Card, Container, Grid/Flex
- **Utility overlays:** Dialog, Popover, Tooltip, Tabs, Accordion

### Premium Tier Rationale
- **FAB** → Material Design specific, specialized use case
- **Slider** → MD3 animations, range support, custom thumb icons, complex interactions
- **Data Table** → Complex, requires TanStack Table, significant dev time
- **Date Pickers** → Complex calendar logic, external dependencies
- **Command Palette** → Advanced pattern, requires cmdk

### Open Questions
- [ ] Pricing structure TBD ($X/mo vs one-time)
- [ ] Label component - include with Input or separate?
- [ ] Alert component - Free or Premium?
