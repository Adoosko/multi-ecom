/* eslint-disable */
import { slugify } from "../../../utils/slugify";

export type HeadingNode = {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  format?: "start" | "end" | "";
  version: number;
  indent?: number;
  children: {
    text: string;
    [key: string]: any;
  }[];
};

export const headingConverter = ({ node }: { node: HeadingNode }) => {
  const text = node.children.map((child) => child.text).join("");
  const id = slugify(text);

  // Create the appropriate heading element based on level
  switch (node.level) {
    case 1:
      return (
        <h1 id={id} className="text-4xl font-bold mt-8 mb-4">
          {text}
        </h1>
      );
    case 2:
      return (
        <h2 id={id} className="text-3xl font-bold mt-6 mb-3">
          {text}
        </h2>
      );
    case 3:
      return (
        <h3 id={id} className="text-2xl font-bold mt-5 mb-2">
          {text}
        </h3>
      );
    case 4:
      return (
        <h4 id={id} className="text-xl font-bold mt-4 mb-2">
          {text}
        </h4>
      );
    case 5:
      return (
        <h5 id={id} className="text-lg font-bold mt-3 mb-1">
          {text}
        </h5>
      );
    case 6:
      return (
        <h6 id={id} className="text-base font-bold mt-2 mb-1">
          {text}
        </h6>
      );
    default:
      return (
        <h2 id={id} className="text-3xl font-bold mt-6 mb-3">
          {text}
        </h2>
      );
  }
};
