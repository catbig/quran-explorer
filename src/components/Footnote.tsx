import parse, { domToReact } from "html-react-parser";

interface FootnoteProps {
  id: string;
  children: React.ReactNode;
}

function Footnote({ id, children }: FootnoteProps) {
  return (
    <sup
      className="text-xs text-gray-500 cursor-pointer"
      title={`Footnote: ${id}`}
      style={{ marginLeft: 2 }}
    >
      {children}
    </sup>
  );
}

export function parseTranslationWithFootnotes(text: string) {
  return parse(text, {
    replace: (domNode: any) => {
      if (domNode.name === "sup" && domNode.attribs?.foot_note) {
        return <Footnote id={domNode.attribs.foot_note}>{domNode.children[0].data}</Footnote>;
      }
    },
  });
}
