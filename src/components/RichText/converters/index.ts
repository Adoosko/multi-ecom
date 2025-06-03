import { headingConverter } from "./headingConverter";
import { internalLinkConverter } from "./internalLink";

/**
 * Maps Lexical node types to custom React components
 */
export const jsxConverter = {
  // Custom element converters
  h1: headingConverter,
  h2: headingConverter,
  h3: headingConverter,
  h4: headingConverter,
  h5: headingConverter,
  h6: headingConverter,
  
  // Custom node converters
  relationship: internalLinkConverter,
};
