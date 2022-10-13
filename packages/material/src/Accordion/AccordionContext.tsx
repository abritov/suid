import { createContext, Context } from "solid-js";

/**
 * @ignore - internal component.
 */
const AccordionContext: Context<
  {} | { expanded: boolean; disabled: boolean; toggle: () => void }
> = createContext({});

// if (process.env.NODE_ENV !== "production") {
//   AccordionContext.displayName = "AccordionContext";
// }

export default AccordionContext;
