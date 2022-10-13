import { OwnerState } from "../InputBase";
import Paper from "../Paper";
import styled from "../styles/styled";
import { AccordionProps } from "./AccordionProps";
import accordionClasses, { getAccordionUtilityClass } from "./accordionClasses";
import composeClasses from "@suid/base/composeClasses";
import createComponentFactory from "@suid/base/createComponentFactory";
import { Component } from "solid-js";
import AccordionContext from "./AccordionContext";
import useThemeProps from "@suid/base/useThemeProps";

const useUtilityClasses = (ownerState: AccordionProps) => {
  const { classes, square, expanded, disabled, disableGutters } = ownerState;

  const slots = {
    root: [
      "root",
      !square && "rounded",
      expanded && "expanded",
      disabled && "disabled",
      !disableGutters && "gutters",
    ],
    region: ["region"],
  };

  return composeClasses(slots, getAccordionUtilityClass, classes);
};

const $ = createComponentFactory<AccordionProps, OwnerState>()({
  name: "MuiAccordion",
  selfPropNames: [
    "alt",
    "children",
    "classes",
    "imgProps",
    "sizes",
    "src",
    "srcSet",
    "variant",
  ],
  utilityClass: getAvatarUtilityClass,
  slotClasses: (ownerState) => ({
    root: [
      "root",
      ownerState.variant,
      ownerState.colorDefault && "colorDefault",
    ],
    img: ["img"],
    fallback: ["fallback"],
  }),
});

const AccordionRoot = styled(Paper, {
  name: "MuiAccordion",
  slot: "Root",
  overridesResolver: (props, styles) => {
    const { ownerState } = props;

    return [
      { [`& .${accordionClasses.region}`]: styles.region },
      styles.root,
      !ownerState.square && styles.rounded,
      !ownerState.disableGutters && styles.gutters,
    ];
  },
})(
  ({ theme }) => {
    const transition = {
      duration: theme.transitions.duration.shortest,
    };

    return {
      position: "relative",
      transition: theme.transitions.create(["margin"], transition),
      overflowAnchor: "none", // Keep the same scrolling position
      "&:before": {
        position: "absolute",
        left: 0,
        top: -1,
        right: 0,
        height: 1,
        content: '""',
        opacity: 1,
        backgroundColor: theme.palette.divider,
        transition: theme.transitions.create(
          ["opacity", "background-color"],
          transition
        ),
      },
      "&:first-of-type": {
        "&:before": {
          display: "none",
        },
      },
      [`&.${accordionClasses.expanded}`]: {
        "&:before": {
          opacity: 0,
        },
        "&:first-of-type": {
          marginTop: 0,
        },
        "&:last-of-type": {
          marginBottom: 0,
        },
        "& + &": {
          "&:before": {
            display: "none",
          },
        },
      },
      [`&.${accordionClasses.disabled}`]: {
        backgroundColor: theme.palette.action.disabledBackground,
      },
    };
  },
  ({ theme, ownerState }) => ({
    ...(!ownerState.square && {
      borderRadius: 0,
      "&:first-of-type": {
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
      },
      "&:last-of-type": {
        borderBottomLeftRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius,
        // Fix a rendering issue on Edge
        "@supports (-ms-ime-align: auto)": {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        },
      },
    }),
    ...(!ownerState.disableGutters && {
      [`&.${accordionClasses.expanded}`]: {
        margin: "16px 0",
      },
    }),
  })
);

const Accordion: Component = (inProps: AccordionProps) => {
  const props = useThemeProps({ props: inProps, name: 'MuiAccordion' });
  const {
    children: childrenProp,
    className,
    defaultExpanded = false,
    disabled = false,
    disableGutters = false,
    expanded: expandedProp,
    onChange,
    square = false,
    TransitionComponent = Collapse,
    TransitionProps,
    ...other
  } = props;

  return (
    <AccordionRoot
      className={clsx(classes.root, className)}
      ref={ref}
      ownerState={ownerState}
      square={square}
      {...other}
    >
      <AccordionContext.Provider value={contextValue}>
        {summary}
      </AccordionContext.Provider>
      <TransitionComponent in={expanded} timeout="auto" {...TransitionProps}>
        <div
          aria-labelledby={summary.props.id}
          id={summary.props["aria-controls"]}
          role="region"
          className={classes.region}
        >
          {children}
        </div>
      </TransitionComponent>
    </AccordionRoot>
  );
};

export default Accordion;
