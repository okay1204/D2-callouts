export const idToName = (str: string): string => {
    return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}