// Utility functions for content management
export const contentUtils = {
    // Get fallback content when database data is empty
    getFallbackData: <T>(dbData: T[] | undefined, fallbackData: T[]): T[] => {
        return dbData && dbData.length > 0 ? dbData : fallbackData;
    },

    // Get dynamic icon for category
    getIcon: (
        category: string,
        iconMap: Record<string, string>,
        defaultIcon: string = '📁',
    ): string => {
        return iconMap[category] || defaultIcon;
    },

    // Filter items by status
    filterByStatus: <T extends { is_active?: boolean }>(items: T[]): T[] => {
        return items.filter((item) => item.is_active !== false);
    },

    // Sort items by order
    sortByOrder: <T extends { order?: number }>(items: T[]): T[] => {
        return [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
    },

    // Get latest items
    getLatestItems: <T>(items: T[], count: number = 6): T[] => {
        return items.slice(0, count);
    },
};
