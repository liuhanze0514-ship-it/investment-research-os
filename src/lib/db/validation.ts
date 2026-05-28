export type ActionState = {
  ok?: boolean;
  error?: string;
};

export function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function requiredText(formData: FormData, key: string, label: string) {
  const value = textValue(formData, key);
  if (!value) {
    throw new Error(`${label} is required`);
  }
  return value;
}

export function optionalText(formData: FormData, key: string) {
  const value = textValue(formData, key);
  return value || undefined;
}

export function optionalInt(formData: FormData, key: string) {
  const value = textValue(formData, key);
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`${key} must be a number`);
  }
  return parsed;
}

export function boundedInt(formData: FormData, key: string, min: number, max: number, fallback: number) {
  const parsed = optionalInt(formData, key) ?? fallback;
  if (parsed < min || parsed > max) {
    throw new Error(`${key} must be between ${min} and ${max}`);
  }
  return parsed;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}
