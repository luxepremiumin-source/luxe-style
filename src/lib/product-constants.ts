export type GenderOption = "mens" | "womens";
export type CategoryOption =
  | "goggles"
  | "watches"
  | "belts"
  | "gift box"
  | "wallets"
  | "handbags";

export const CATEGORY_LABELS: Record<CategoryOption, string> = {
  goggles: "Goggles",
  watches: "Watches",
  belts: "Belts",
  "gift box": "Gift Box",
  wallets: "Wallets",
  handbags: "Handbags",
};

export const CATEGORY_OPTIONS_BY_GENDER: Record<GenderOption, CategoryOption[]> = {
  mens: ["watches", "wallets", "goggles", "belts"],
  womens: ["handbags", "watches", "goggles", "wallets", "gift box", "belts"],
};

export const ALL_CATEGORY_OPTIONS: Array<{ value: CategoryOption; label: string }> = Object.entries(
  CATEGORY_LABELS,
).map(([value, label]) => ({ value: value as CategoryOption, label }));

export const COMMON_COLORS = [
  "Black",
  "White",
  "Grey",
  "Brown",
  "Gold",
  "Silver",
  "Blue",
  "Red",
  "Green",
  "Beige",
  "Pink",
  "Purple",
];
