import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "a", "ul", "ol", "li", "blockquote",
  "strong", "em", "code", "pre", "br", "hr",
  "img", "table", "thead", "tbody", "tr", "th", "td",
  "span", "div", "figure", "figcaption",
];

const allowedAttributes: sanitizeHtml.IOptions["allowedAttributes"] = {
  a: ["href", "target", "rel"],
  img: ["src", "alt", "width", "height", "loading"],
  code: ["class"],
  pre: ["class"],
  span: ["class"],
  div: ["class"],
  td: ["colspan", "rowspan"],
  th: ["colspan", "rowspan"],
  h1: ["id"],
  h2: ["id"],
  h3: ["id"],
  h4: ["id"],
};

export function sanitize(html: string): string {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ["http", "https", "mailto"],
  });
}
