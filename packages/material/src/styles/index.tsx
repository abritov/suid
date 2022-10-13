export { default as useTheme } from "./useTheme";
export { default as useThemeProps } from "./useThemeProps";
export { createTheme } from "./createTheme";
export { default as ThemeProvider } from "./ThemeProvider";
export type { Theme } from "./createTheme";
export { default as StyledEngineProvider } from "@suid/system/StyledEngineProvider";

export type ClassNameMap<ClassKey extends string = string> = Record<ClassKey, string>;

export interface StyledComponentProps<ClassKey extends string = string> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ClassNameMap<ClassKey>>;
}