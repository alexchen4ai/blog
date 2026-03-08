import { visit } from "unist-util-visit";

const CALLOUT_TYPES = ["tip", "note", "warning", "info", "danger", "success", "caution", "important", "abstract", "example", "question", "todo", "bug", "failure", "quote"];

interface HastElement {
    type: string;
    tagName?: string;
    properties?: Record<string, unknown>;
    children?: HastNode[];
}

interface HastNode {
    type: string;
    tagName?: string;
    properties?: Record<string, unknown>;
    children?: HastNode[];
    value?: string;
}

/**
 * Rehype plugin: transform ::: tip / note / warning directive elements
 * into div structure with proper classes for CSS styling.
 * Works by transforming hast tree before React render - no component override needed.
 */
export default function rehypeCallout() {
    return (tree: HastNode) => {
        visit(tree, "element", (node, index, parent) => {
            if (!parent || typeof index !== "number") return;

            const el = node as HastElement;
            const tagName = el.tagName?.toLowerCase();

            if (!tagName || !CALLOUT_TYPES.includes(tagName)) return;

            const label = tagName.charAt(0).toUpperCase() + tagName.slice(1);

            // Replace with div structure: .markdown-callout > .markdown-callout-title + .markdown-callout-content
            (parent as HastElement).children![index] = {
                type: "element",
                tagName: "div",
                properties: {
                    className: [`markdown-callout`, `markdown-callout-${tagName}`],
                },
                children: [
                    {
                        type: "element",
                        tagName: "div",
                        properties: { className: ["markdown-callout-title"] },
                        children: [{ type: "text", value: label }],
                    },
                    {
                        type: "element",
                        tagName: "div",
                        properties: { className: ["markdown-callout-content"] },
                        children: el.children || [],
                    },
                ],
            };
        });
    };
}
