/**
 * Format article content with proper paragraphs and spacing
 * Handles both plain text and HTML content from text editors
 */
export const formatArticleContent = (content: string): string => {
    if (!content) return '';

    // Check if content already has HTML tags
    const hasHTMLTags = /<[^>]*>/.test(content);

    if (hasHTMLTags) {
        // Already has HTML from rich text editor
        let formatted = content;

        // Clean up excessive whitespace while preserving intentional spacing
        formatted = formatted
            .replace(/\n+/g, ' ') // Convert line breaks to spaces
            .replace(/\s+/g, ' ') // Normalize multiple spaces
            .replace(/>\s+</g, '><') // Remove spaces between tags
            .trim();

        // Ensure proper spacing for block elements
        formatted = formatted
            .replace(/(<\/(p|div|h[1-6]|ul|ol|li|blockquote)>)/gi, '$1\n')
            .replace(/(<(p|div|h[1-6]|ul|ol|li|blockquote)[^>]*>)/gi, '\n$1')
            .replace(/^\n+|\n+$/g, '') // Remove leading/trailing newlines
            .replace(/\n{3,}/g, '\n\n'); // Max 2 consecutive newlines

        return formatted;
    }

    // Convert plain text to HTML paragraphs
    return content
        .split(/\n{2,}/) // Split by double line breaks (paragraphs)
        .map((paragraph) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return '';

            return paragraph
                .trim()
                .split(/\n/) // Split by single line breaks
                .map((line) => line.trim())
                .filter((line) => line.length > 0)
                .join('<br />')
                .replace(/^/, '<p>')
                .replace(/$/, '</p>');
        })
        .filter((p) => p.length > 0)
        .join('\n')
        .trim();
};

/**
 * Alternative: Preserve line breaks and whitespace
 */
export const formatArticleContentWithWhitespace = (content: string): string => {
    if (!content) return '';

    // Check if content already has HTML tags
    const hasHTMLTags = /<[^>]*>/.test(content);

    if (hasHTMLTags) {
        return content.trim();
    }

    // For plain text: wrap in pre with white-space preservation
    const escaped = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    return `<pre style="white-space: pre-wrap; font-family: inherit; background: transparent; border: none; padding: 0;">${escaped}</pre>`;
};
