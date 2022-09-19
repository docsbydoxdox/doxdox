export const multiLinePatternMatch = (
    content: string,
    pattern: string
): { start?: number; end?: number; matched: boolean } => {
    const matched = content.includes(pattern);

    if (!matched) {
        return { matched };
    }

    const contentLines = content.split(/\r?\n/);
    const patternLines = pattern.split(/\r?\n/);

    for (let i = 0; i < contentLines.length; i += 1) {
        if (contentLines[i] === patternLines[0]) {
            const contentGroup = contentLines
                .slice(i, i + patternLines.length)
                .join('\n');

            const patternGroup = patternLines.join('\n');

            if (contentGroup === patternGroup) {
                return {
                    start: i,
                    end: i + patternLines.length,
                    matched
                };
            }
        }
    }

    return { matched: false };
};
