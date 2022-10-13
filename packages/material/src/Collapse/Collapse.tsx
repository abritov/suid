import { useTheme } from "..";
import { duration, easing } from "../styles/createTransitions";
import styled from "../styles/styled";
import { getTransitionProps } from "../transitions/utils";
import { CollapseTypeMap } from "./CollapseProps";
import { getCollapseUtilityClass } from "./collapseClasses";
import Transition from "@suid/base/Transition";
import createComponentFactory from "@suid/base/createComponentFactory";
import createRef from "@suid/system/createRef";
import { InPropsOf } from "@suid/types";
import clsx from "clsx";
import { splitProps, mergeProps, onCleanup, children } from "solid-js";
import { style } from "solid-js/web";

const $ = createComponentFactory<CollapseTypeMap>()({
  name: "MuiCollapse",
  selfPropNames: [
    "children",
    "classes",
    "collapsedSize",
    // "component",
    "easing",
    "in",
    "orientation",
    "timeout",
  ],
  // propDefaults: ({ set }) =>
  //   set({
  //     component: "div",
  //     components: {},
  //     componentsProps: {},
  //     invisible: false,
  //   }),
  utilityClass: getCollapseUtilityClass,
  slotClasses: (ownerState) => ({
    root: ["root", `${ownerState.orientation}`],
    entered: ["entered"],
    hidden: ["hidden"],
    wrapper: ["wrapper", `${ownerState.orientation}`],
    wrapperInner: ["wrapperInner", `${ownerState.orientation}`],
  }),
});

const CollapseRoot = styled("div", {
  name: "MuiCollapse",
  slot: "Root",
  overridesResolver: (props, styles) => {
    const { ownerState } = props;

    return [
      styles.root,
      styles[ownerState.orientation],
      ownerState.state === "entered" && styles.entered,
      ownerState.state === "exited" &&
        !ownerState.in &&
        ownerState.collapsedSize === "0px" &&
        styles.hidden,
    ];
  },
})<InPropsOf<CollapseTypeMap>>(({ theme, ownerState }) => ({
  height: 0,
  overflow: "hidden",
  transition: theme.transitions.create("height"),
  ...(ownerState.orientation === "horizontal" && {
    height: "auto",
    width: 0,
    transition: theme.transitions.create("width"),
  }),
  ...(ownerState.state === "entered" && {
    height: "auto",
    overflow: "visible",
    ...(ownerState.orientation === "horizontal" && {
      width: "auto",
    }),
  }),
  ...(ownerState.state === "exited" &&
    !ownerState.in &&
    ownerState.collapsedSize === "0px" && {
      visibility: "hidden",
    }),
}));

const CollapseWrapper = styled("div", {
  name: "MuiCollapse",
  slot: "Wrapper",
  overridesResolver: (props, styles) => styles.wrapper,
})<InPropsOf<CollapseTypeMap>>(({ ownerState }) => ({
  // Hack to get children with a negative margin to not falsify the height computation.
  display: "flex",
  width: "100%",
  ...(ownerState.orientation === "horizontal" && {
    width: "auto",
    height: "100%",
  }),
}));

const CollapseWrapperInner = styled("div", {
  name: "MuiCollapse",
  slot: "WrapperInner",
  overridesResolver: (props, styles) => styles.wrapperInner,
})<InPropsOf<CollapseTypeMap>>(({ ownerState }) => ({
  width: "100%",
  ...(ownerState.orientation === "horizontal" && {
    width: "auto",
    height: "100%",
  }),
}));

/**
 * The Collapse transition is used by the
 * [Vertical Stepper](https://mui.com/components/steppers/#vertical-stepper) StepContent component.
 * It uses [react-transition-group](https://github.com/reactjs/react-transition-group) internally.
 *
 * Demos:
 *
 * - [Cards](https://mui.com/components/cards/)
 * - [Lists](https://mui.com/components/lists/)
 * - [Transitions](https://mui.com/components/transitions/)
 *
 * API:
 *
 * - [Collapse API](https://mui.com/api/collapse/)
 * - inherits [Transition API](http://reactcommunity.org/react-transition-group/transition/#Transition-props)
 */
const Collapse = $.defineComponent(function Collapse(inProps) {
  // const ref = createRef(inProps);
  const props = $.useThemeProps({ props: inProps });
  const [, other] = splitProps(props, [
    "addEndListener",
    "children",
    "className",
    "collapsedSize",
    "component",
    "easing",
    "in",
    "onEnter",
    "onEntered",
    "onEntering",
    "onExit",
    "onExited",
    "onExiting",
    "orientation",
    "style",
    "timeout",
    "TransitionComponent",
  ]);

  const baseProps = mergeProps(
    {
      collapsedSize: "0px",
      in: inProps,
      orientation: "vertical",
      timeout: duration.standard,
      TransitionComponent: Transition,
    },
    props
  );

  const ownerState = mergeProps(props, {
    get orientation() {
      return baseProps.orientation;
    },
    get collapsedSize() {
      return baseProps.collapsedSize;
    },
  });

  const classes = $.useClasses(ownerState);

  let timer: NodeJS.Timeout;
  let wrapperRef: any = null;
  const autoTransitionDuration = { current: undefined as undefined | number };

  const theme = useTheme();
  const collapsedSize =
    typeof baseProps.collapsedSize === "number"
      ? `${baseProps.collapsedSize}px`
      : baseProps.collapsedSize;
  const isHorizontal = ownerState.orientation === "horizontal";
  const size = isHorizontal ? "width" : "height";

  onCleanup(() => clearInterval(timer));

  let nodeRef: any = null;
  // const handleRef = useForkRef(ref, nodeRef);
  const handleRef = nodeRef;

  const normalizedTransitionCallback =
    (callback: any) => (maybeIsAppearing: any) => {
      if (callback) {
        // onEnterXxx and onExitXxx callbacks have a different arguments.length value.
        if (maybeIsAppearing === undefined) {
          callback(nodeRef);
        } else {
          callback(nodeRef, maybeIsAppearing);
        }
      }
    };

  const getWrapperSize = () =>
    wrapperRef ? wrapperRef[isHorizontal ? "clientWidth" : "clientHeight"] : 0;

  const handleEnter = normalizedTransitionCallback(
    (node: { style: { [x: string]: string } }, isAppearing: any) => {
      if (wrapperRef && isHorizontal) {
        // Set absolute position to get the size of collapsed content
        wrapperRef.style.position = "absolute";
      }
      node.style[size] = collapsedSize;

      if (props.onEnter) {
        props.onEnter(node, isAppearing);
      }
    }
  );

  const handleEntering = normalizedTransitionCallback(
    (
      node: {
        style: {
          [x: string]: string;
          transitionDuration: string;
          transitionTimingFunction: string | undefined;
        };
      },
      isAppearing: any
    ) => {
      const wrapperSize = getWrapperSize();

      if (wrapperRef.current && isHorizontal) {
        // After the size is read reset the position back to default
        wrapperRef.current.style.position = "";
      }

      const { duration: transitionDuration, easing: transitionTimingFunction } =
        getTransitionProps(
          {
            style: props.style,
            timeout: baseProps.timeout,
            easing: props.easing,
          },
          {
            mode: "enter",
          }
        );

      if (baseProps.timeout === "auto") {
        const duration2 = theme.transitions.getAutoHeightDuration(wrapperSize);
        node.style.transitionDuration = `${duration2}ms`;
        autoTransitionDuration.current = duration2;
      } else {
        node.style.transitionDuration =
          typeof transitionDuration === "string"
            ? transitionDuration
            : `${transitionDuration}ms`;
      }

      node.style[size] = `${wrapperSize}px`;
      node.style.transitionTimingFunction = transitionTimingFunction;

      if (props.onEntering) {
        props.onEntering(node, isAppearing);
      }
    }
  );

  const handleEntered = normalizedTransitionCallback(
    (node: { style: { [x: string]: string } }, isAppearing: any) => {
      node.style[size] = "auto";

      if (props.onEntered) {
        props.onEntered(node, isAppearing);
      }
    }
  );

  const handleExit = normalizedTransitionCallback(
    (node: { style: { [x: string]: string } }) => {
      node.style[size] = `${getWrapperSize()}px`;

      if (props.onExit) {
        props.onExit(node);
      }
    }
  );

  const handleExited = normalizedTransitionCallback(onExited);

  const handleExiting = normalizedTransitionCallback(
    (node: {
      style: {
        [x: string]: string;
        transitionDuration: string;
        transitionTimingFunction: string | undefined;
      };
    }) => {
      const wrapperSize = getWrapperSize();
      const { duration: transitionDuration, easing: transitionTimingFunction } =
        getTransitionProps(
          {
            style: props.style,
            timeout: baseProps.timeout,
            easing: props.easing,
          },
          {
            mode: "exit",
          }
        );

      if (baseProps.timeout === "auto") {
        // TODO: rename getAutoHeightDuration to something more generic (width support)
        // Actually it just calculates animation duration based on size
        const duration2 = theme.transitions.getAutoHeightDuration(wrapperSize);
        node.style.transitionDuration = `${duration2}ms`;
        autoTransitionDuration.current = duration2;
      } else {
        node.style.transitionDuration =
          typeof transitionDuration === "string"
            ? transitionDuration
            : `${transitionDuration}ms`;
      }

      node.style[size] = collapsedSize;
      node.style.transitionTimingFunction = transitionTimingFunction;

      if (props.onExiting) {
        props.onExiting(node);
      }
    }
  );

  const handleAddEndListener = (next: any) => {
    if (baseProps.timeout === "auto") {
      timer = setTimeout(next, autoTransitionDuration.current || 0);
    }
    if (props.addEndListener) {
      // Old call signature before `react-transition-group` implemented `nodeRef`
      props.addEndListener(nodeRef, next);
    }
  };
  return (
    <Transition
      in={props.in}
      onEnter={handleEnter}
      onEntered={handleEntered}
      onEntering={handleEntering}
      onExit={handleExit}
      onExited={handleExited}
      onExiting={handleExiting}
      addEndListener={handleAddEndListener}
      nodeRef={nodeRef}
      timeout={baseProps.timeout === "auto" ? null : baseProps.timeout}
      {...other}
    >
      {(state: string, childProps: any) => (
        <CollapseRoot
          as={props.component}
          className={clsx(
            classes.root,
            {
              [classes.entered]: state === "entered",
              [classes.hidden]:
                state === "exited" && !props.in && collapsedSize === "0px",
            },
            props.className
          )}
          style={mergeProps(
            { [isHorizontal ? "minWidth" : "minHeight"]: collapsedSize },
            () => props.style
          )}
          ownerState={mergeProps(ownerState, { state: state })}
          ref={handleRef}
          {...childProps}
        >
          {/* <CollapseWrapper
            ownerState={mergeProps(ownerState, { state: state })}
            className={classes.wrapper}
            ref={wrapperRef}
          >
            <CollapseWrapperInner
              ownerState={mergeProps(ownerState, { state: state })}
              className={classes.wrapperInner}
            >
              {props.children}
            </CollapseWrapperInner>
          </CollapseWrapper> */}
        </CollapseRoot>
      )}
    </Transition>
  );
});
