import { ExtendButtonBaseTypeMap } from "../ButtonBase";
import { TransitionHandlerKeys, TransitionProps } from "../transitions";
import { CollapseClasses } from "./collapseClasses";
import * as ST from "@suid/types";
import { Component, JSXElement } from "solid-js";

export type CollapseTypeMap<P = {}, D extends ST.ElementType = "div"> = {
  name: "MuiCollapse";
  defaultPropNames: "collapsedSize" | "orientation" | "timeout";
  selfProps: {
    // addEndListener",
    // className",
    // onEnter",
    // onEntered",
    // onEntering",
    // onExit",
    // onExited",
    // onExiting",
    TransitionComponent?: Component<TransitionProps>;
    addEndListener?: (done: () => void) => void;
    onEnter?: () => void;
    onEntering?: () => void;
    onEntered?: () => void;
    onExit?: () => void;
    onExiting?: () => void;
    onExited?: () => void;
    /**
     * The content node to be collapsed.
     */
    children: JSXElement;
    /**
     * Override or extend the styles applied to the component.
     */
    classes?: Partial<CollapseClasses>;
    className?: string;
    /**
     * The width (horizontal) or height (vertical) of the container when collapsed.
     * @default '0px'
     */
    collapsedSize?: string | number;
    /**
     * The transition timing function.
     * You may specify a single easing or a object containing enter and exit values.
     */
    easing?: TransitionProps["easing"];
    /**
     * If `true`, the component will transition in.
     */
    in?: boolean;
    /**
     * The transition orientation.
     * @default 'vertical'
     */
    orientation?: "horizontal" | "vertical";
    /**
     * The duration for the transition, in milliseconds.
     * You may specify a single timeout for all transitions, or individually with an object.
     *
     * Set to 'auto' to automatically calculate transition time based on height.
     * @default duration.standard
     */
    timeout?: TransitionProps["timeout"] | "auto";
    state: "entered" | "exited";
  };
  props: Omit<TransitionProps, "children"> & CollapseTypeMap["selfProps"];
};

export type CollapseProps = CollapseTypeMap["props"];

export default CollapseProps;
