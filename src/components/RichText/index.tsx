/* eslint-disable */
"use client";

import React from "react";

type Props = {
  content: any;
  className?: string;
};

const RichText: React.FC<Props> = ({ content, className = "" }) => {
  if (!content) {
    return null;
  }

  // Process the Lexical content structure
  const processLexicalContent = () => {
    try {
      if (typeof content === "string") {
        // If the content is already a string (HTML), return it
        return content;
      }

      // Handle Lexical format with root object
      if (content?.root) {
        return processLexicalNode(content.root);
      }

      // Basic text processing for Lexical nodes
      else if (Array.isArray(content)) {
        return content
          .map((node: any) => {
            // Process headings
            if (node.type === "heading") {
              const text =
                node.children?.map((child: any) => child.text).join("") || "";
              const level = node.level || 2;
              return `<h${level}>${text}</h${level}>`;
            }

            // Process paragraphs
            if (node.type === "paragraph") {
              const text =
                node.children
                  ?.map((child: any) => {
                    // Check for formatting
                    if (child.bold) return `<strong>${child.text}</strong>`;
                    if (child.italic) return `<em>${child.text}</em>`;
                    if (child.underline) return `<u>${child.text}</u>`;
                    return child.text;
                  })
                  .join("") || "";
              return `<p>${text}</p>`;
            }

            // Process lists
            if (node.type === "list") {
              const listItems =
                node.children
                  ?.map((item: any) => {
                    const text =
                      item.children?.map((child: any) => child.text).join("") ||
                      "";
                    return `<li>${text}</li>`;
                  })
                  .join("") || "";

              if (node.listType === "bullet") {
                return `<ul>${listItems}</ul>`;
              } else {
                return `<ol>${listItems}</ol>`;
              }
            }

            // Default fallback for unknown nodes
            return "";
          })
          .join("");
      }

      // Fallback for unknown content structure
      return "";
    } catch (error) {
      console.error("Error processing Lexical content:", error);
      return "<p>Error rendering content</p>";
    }
  };

  // Helper function to process Lexical nodes recursively
  const processLexicalNode = (node: any): string => {
    if (!node) return "";

    // Process node based on type
    if (node.type === "root") {
      // Root node - process its children
      return node.children?.map(processLexicalNode).join("") || "";
    }

    if (node.type === "heading") {
      const level = node.tag?.replace("h", "") || node.level || 2;
      const text = node.children?.map(processLexicalNode).join("") || "";
      return `<h${level} class="mt-6 mb-4 font-bold">${text}</h${level}>`;
    }

    if (node.type === "paragraph") {
      const text = node.children?.map(processLexicalNode).join("") || "";
      return `<p class="mb-4">${text}</p>`;
    }

    if (node.type === "text") {
      let result = node.text || "";

      // Apply text formatting
      if (node.bold) result = `<strong>${result}</strong>`;
      if (node.italic) result = `<em>${result}</em>`;
      if (node.underline) result = `<u>${result}</u>`;

      return result;
    }

    if (node.type === "list") {
      const items = node.children?.map(processLexicalNode).join("") || "";
      if (node.listType === "bullet" || node.tag === "ul") {
        return `<ul class="list-disc pl-5 mb-4">${items}</ul>`;
      } else {
        return `<ol class="list-decimal pl-5 mb-4">${items}</ol>`;
      }
    }

    if (node.type === "listitem") {
      const text = node.children?.map(processLexicalNode).join("") || "";
      return `<li>${text}</li>`;
    }

    if (node.type === "linebreak") {
      return "<br>";
    }

    if (node.children && Array.isArray(node.children)) {
      return node.children.map(processLexicalNode).join("");
    }

    // For any other nodes we don't explicitly handle
    return "";
  };

  const htmlContent = processLexicalContent();

  return (
    <div className={`rich-text prose prose-lg max-w-none ${className}`}>
      {/* Render content safely */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default RichText;
