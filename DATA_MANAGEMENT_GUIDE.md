# Data Management Guide

## Project Component Data Structure

### Files Created:
- `resources/js/data/projectContent.ts` - Main project page content
- `resources/js/utils/contentUtils.ts` - Utility functions for content management

### Content Structure:

#### Main Content Areas:
1. **Hero Section** - Banner image and page title
2. **Categories Section** - Project categories with custom icons
3. **Description Section** - Project explanation paragraphs
4. **Gallery Section** - Project cards with filtering

#### Fallback System:
- **Database First**: Uses data from backend when available
- **Graceful Fallbacks**: Uses default content when database is empty
- **Type Safe**: Full TypeScript support for all data structures

### Content Customization:

#### Adding New Categories:
```typescript
// In projectContent.ts
categoryIcons: {
    "New Category": "🆕",
    // Add more categories with their icons
}
```

#### Updating Content:
```typescript
// In projectContent.ts
sections: {
    description: {
        title: "Your new title",
        content: [
            "First paragraph",
            "Second paragraph"
        ]
    }
}
```

### Utility Functions Available:
- `getFallbackData()` - Handles database/fallback data switching
- `getIcon()` - Gets category-specific icons
- `filterByStatus()` - Filters active items only
- `sortByOrder()` - Sorts items by order field
- `getLatestItems()` - Gets recent items for "Latest" tab

### Performance Features:
- **Lazy Loading** - Images load only when needed
- **Efficient Filtering** - Memoized project filtering
- **Clean Architecture** - Separated data from presentation logic
- **Error Prevention** - No more hardcoded content in components

This structure makes content management much easier and prevents runtime errors from hardcoded data!