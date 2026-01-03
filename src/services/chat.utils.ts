export function makeId(): string {
    try {
    return crypto.randomUUID();
    } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
}
