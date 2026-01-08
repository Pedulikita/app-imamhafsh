/**
 * Format article content with proper paragraphs and spacing
 * Handles both plain text and HTML content
 */
export const formatArticleContent = (content: string): string => {
    if (!content) return '';

    // Check if content already has HTML tags
    const hasHTMLTags = /<[^>]*>/.test(content);

    if (hasHTMLTags) {
        // Already has HTML, just ensure proper spacing between tags
        return content
            .replace(/\n+/g, '') // Remove extra line breaks
            .replace(/(<\/p>)(\s*)(<[p|h|ul|ol|blockquote|div])/g, '$1$3') // Fix spacing between block elements
            .trim();
    }

    // Convert plain text to HTML paragraphs
    return content
        .split(/\n{2,}/) // Split by double line breaks (paragraphs)
        .map(paragraph => {
            return paragraph
                .trim()
                .split(/\n/) // Split by single line breaks
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .join('<br />')
                .replace(/^/, '<p>')
                .replace(/$/, '</p>');
        })
        .join('')
        .replace(/(<p>.*?<\/p>)/gs, (match) => {
            // Wrap content with proper <p> tags
            return match.replace(/<br \/>$/, '');
        })
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
