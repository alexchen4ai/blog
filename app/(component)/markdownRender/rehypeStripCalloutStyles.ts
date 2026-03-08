import { visit } from "unist-util-visit";
import type { Element, Root } from "hast";

/**
 * Rehype plugin: strip inline styles from remark-callouts output
 * so CSS can control the appearance. Targets:
 * - blockquote.callout (border-left-color)
 * - div.callout-title (background-color)
 * - span.callout-icon (color)
 */
export default function rehypeStripCalloutStyles() {
    return (tree: Root) => {
        visit(tree, "element", (node) => {
            const el = node as Element;
            const props = el.properties || {};
            const className = Array.isArray(props.className) ? props.className.join(" ") : String(props.className || "");

            if (className.includes("callout") || className.includes("callout-title") || className.includes("callout-icon")) {
                delete props.style;
            }
        });
    };
}
