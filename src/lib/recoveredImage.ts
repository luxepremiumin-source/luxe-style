const missingRecoveredImageIds = new Set([
  "18ed53fc-84f4-4912-b418-3b8c24040a3d",
  "580bf0d7-2de1-4978-98d5-7e4cd9ab3703",
  "624971e2-5b1c-4e74-bd96-36196d2d6159",
]);

export function recoveredImageUrl(url: string): string {
  const match = url.match(/\/api\/storage\/([0-9a-f-]{36})(?:$|[?#])/i);

  if (!match || missingRecoveredImageIds.has(match[1].toLowerCase())) {
    return url;
  }

  return `/recovered-product-images/${match[1]}.webp`;
}
