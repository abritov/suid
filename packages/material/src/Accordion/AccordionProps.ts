import { InternalStandardProps as StandardProps, Theme } from "..";
import { PaperProps } from "../Paper";
import { TransitionProps } from "../transitions/transition";
import { AccordionClasses } from "./accordionClasses";
import { SxProps } from "@suid/system";
import { ChangeEvent, ElementType } from "@suid/types";
import { JSXElement, Component } from "solid-js";

// export interface AccordionPropsVariantOverrides {}
// export type AccordionTypeMap<P = {}, D extends ElementType = "div"> = {
//   name: "MuiAccordion";
//   defaultPropNames: "variant";
//   selfProps: {
//     /**
//      * Used in combination with `src` or `srcSet` to
//      * provide an alt attribute for the rendered `img` element.
//      */
//     alt?: string;

//     /**
//      * Used to render icon or text elements inside the Avatar if `src` is not set.
//      * This can be an element, or just a string.
//      */
//     children?: JSXElement;

//     /**
//      * Override or extend the styles applied to the component.
//      */
//     classes?: Partial<AvatarClasses>;

//     /**
//      * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attributes) applied to the `img` element if the component is used to display an image.
//      * It can be used to listen for the loading error event.
//      */
//     imgProps?: ST.PropsOf<"img"> & {
//       sx?: SxProps<Theme>;
//     };

//     /**
//      * The `sizes` attribute for the `img` element.
//      */
//     sizes?: string;

//     /**
//      * The `src` attribute for the `img` element.
//      */
//     src?: string;

//     /**
//      * The `srcSet` attribute for the `img` element.
//      * Use this attribute for responsive image display.
//      */
//     srcSet?: string;

//     /**
//      * The system prop that allows defining system overrides as well as additional CSS styles.
//      */
//     sx?: SxProps<Theme>;

//     /**
//      * The shape of the avatar.
//      * @default 'circular'
//      */
//     variant?: OverridableStringUnion<
//       "circular" | "rounded" | "square",
//       AvatarPropsVariantOverrides
//     >;
//   };
//   props: P & AvatarTypeMap["selfProps"];
//   defaultComponent: D;
// };

// export type AccordionProps<
//   D extends ST.ElementType = AvatarTypeMap["defaultComponent"],
//   P = {}
// > = ST.OverrideProps<AvatarTypeMap<P, D>, D>;

export interface AccordionProps extends StandardProps<PaperProps, "onChange"> {
  /**
   * The content of the component.
   */
  children: NonNullable<JSXElement>;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<AccordionClasses>;
  /**
   * If `true`, expands the accordion by default.
   * @default false
   */
  defaultExpanded?: boolean;
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, it removes the margin between two expanded accordion items and the increase of height.
   * @default false
   */
  disableGutters?: boolean;
  /**
   * If `true`, expands the accordion, otherwise collapse it.
   * Setting this prop enables control over the accordion.
   */
  expanded?: boolean;
  /**
   * Callback fired when the expand/collapse state is changed.
   *
   * @param {ChangeEvent<HTMLElement>} event The event source of the callback. **Warning**: This is a generic event not a change event.
   * @param {boolean} expanded The `expanded` state of the accordion.
   */
  onChange?: (event: ChangeEvent<HTMLElement>, checked: boolean) => void;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * The component used for the transition.
   * [Follow this guide](/material-ui/transitions/#transitioncomponent-prop) to learn more about the requirements for this component.
   * @default Collapse
   */
  TransitionComponent?: Component<TransitionProps & { children: JSXElement }>;
  /**
   * Props applied to the transition element.
   * By default, the element is based on this [`Transition`](http://reactcommunity.org/react-transition-group/transition/) component.
   */
  TransitionProps?: TransitionProps;
}
