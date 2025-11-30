// lib/utils.ts

/**
 * cn: helper để gộp nhiều className vào 1 string,
 * bỏ qua các giá trị falsy (undefined, false, null)
 */
export function cn(...classes: (string | undefined | boolean | null)[]) {
  return classes.filter(Boolean).join(" ");
}
