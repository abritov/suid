import { DistributiveOmit, Ref } from "@suid/types";
import StyleProps from "@suid/system/styleProps";
import { StyledComponentProps } from "./styles";

export * from "./styles";
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PropTypes {
  // keeping the type structure for backwards compat
  // eslint-disable-next-line @typescript-eslint/no-shadow, @typescript-eslint/no-unused-vars
  export type Color = "inherit" | "primary" | "secondary" | "default";
}
export {};

/**
 * @internal
 * ONLY USE FROM WITHIN mui/material-ui
 *
 * Internal helper type for conform (describeConformance) components
 * However, we don't declare classes on this type.
 * It is recommended to declare them manually with an interface so that each class can have a separate JSDoc.
 */
export type InternalStandardProps<
  C,
  Removals extends keyof C = never
> = DistributiveOmit<C, "classes" | Removals> &
  // each component declares it's classes in a separate interface for proper JSDoc
  StyledComponentProps<never> & {
    ref?: C extends { ref?: infer RefType } ? RefType : Ref<unknown>;
    // TODO: Remove implicit props. Up to each component.
    className?: string;
    style?: StyleProps;
  };
