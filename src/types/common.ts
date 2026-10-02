export type ID = string;

export type StatusTone =
  | "neutral"
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "danger";

export interface SelectOption<T extends string = string> {
  label: string;
  value: T;
}

export interface TrendPoint {
  label: string;
  value: number;
  previous?: number;
}
