export function getFormattedBytes(bytes: number): string
{
    let mutableBytes = bytes as number; // mutable bytes
    const units = ["B", "KB", "MB", "GB", "TB"]; // units array
    let unitIndex = 0; // initialize unit index
    while (mutableBytes > 1024.0 && unitIndex < units.length - 1)
    {
        mutableBytes /= 1024.0; // divide bytes by 1024.0
        unitIndex += 1; // increment unit index
    }
    return `${mutableBytes.toFixed(2)} ${units[unitIndex]}`; // formatted string
}

export function round(value: number, precision: number): number
{
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}