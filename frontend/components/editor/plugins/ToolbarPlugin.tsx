"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  $createParagraphNode,
} from "lexical";
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    INSERT_CHECK_LIST_COMMAND,
} from "@lexical/list";
import {
    $createHeadingNode,
    $createQuoteNode,
} from "@lexical/rich-text";
import {
    $createCodeNode,
} from "@lexical/code";
import {
    TOGGLE_LINK_COMMAND,
} from "@lexical/link";
import { $setBlocksType } from "@lexical/selection";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Link as LinkIcon,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { INSERT_IMAGE_COMMAND } from "./ImagesPlugin";

const LowPriority = 1;

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));
      
      // Check for link
      const node = selection.getNodes()[0];
      const parent = node.getParent();
      if ($isRangeSelection(selection)) {
          setIsLink(parent?.getType() === 'link');
      }

      // Check block type
      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === "root" 
        ? anchorNode 
        : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      
      if (elementDOM !== null) {
        if (element.getType() === "heading") {
            // @ts-ignore
            setBlockType(element.getTag());
        } else if (element.getType() === "list") {
            // @ts-ignore
            setBlockType(element.getListType());
        } else {
            setBlockType(element.getType());
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  const insertImage = () => {
      const src = prompt("Enter image URL", "https://source.unsplash.com/random/800x600");
      if (src) {
          editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
              altText: "Image",
              src,
          });
      }
  };


  const insertLink = () => {
      if (!isLink) {
          const url = prompt("Enter URL");
          if (url) {
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
          }
      } else {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      }
  };

  const formatHeading = (tag: "h1" | "h2" | "h3") => {
      if (blockType === tag) {
          editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createParagraphNode());
              }
          });
      } else {
          editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createHeadingNode(tag));
              }
          });
      }
  };

  const formatQuote = () => {
      if (blockType === "quote") {
          editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createParagraphNode());
              }
          });
      } else {
          editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createQuoteNode());
              }
          });
      }
  };

  const formatCode = () => {
      if (blockType === "code") {
          editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createParagraphNode());
              }
          });
      } else {
          editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createCodeNode());
              }
          });
      }
  };

  return (
    <div className="toolbar flex flex-nowrap items-center gap-1 md:gap-1.5 p-1.5 md:p-2 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-20 overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] *:shrink-0 touch-manipulation" ref={toolbarRef}>
      
      {/* Headings */}
      <Toggle size="sm" pressed={blockType === "h1"} onPressedChange={() => formatHeading("h1")} title="Heading 1" className="touch-manipulation h-9 w-9 md:h-auto md:w-auto">
        <Heading1 className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={blockType === "h2"} onPressedChange={() => formatHeading("h2")} title="Heading 2" className="touch-manipulation h-9 w-9 md:h-auto md:w-auto">
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={blockType === "h3"} onPressedChange={() => formatHeading("h3")} title="Heading 3" className="touch-manipulation h-9 w-9 md:h-auto md:w-auto">
        <Heading3 className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-6 mx-0.5 md:mx-1" />

      {/* Formatting */}
      <Toggle size="sm" pressed={isBold} onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")} title="Bold (Ctrl+B)" className="touch-manipulation h-9 w-9 md:h-auto md:w-auto">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={isItalic} onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")} title="Italic (Ctrl+I)" className="touch-manipulation h-9 w-9 md:h-auto md:w-auto">
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={isUnderline} onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")} title="Underline (Ctrl+U)" className="touch-manipulation h-9 w-9 md:h-auto md:w-auto">
        <Underline className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={isStrikethrough} onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")} title="Strikethrough" className="touch-manipulation h-9 w-9 md:h-auto md:w-auto">
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={isCode} onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")} title="Inline Code" className="touch-manipulation h-9 w-9 md:h-auto md:w-auto">
        <Code className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-6 mx-0.5 md:mx-1" />

      {/* Lists */}
      <Toggle size="sm" pressed={blockType === "bullet"} onPressedChange={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} title="Bullet List" className="touch-manipulation h-9 w-9 md:h-auto md:w-auto">
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={blockType === "number"} onPressedChange={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} title="Numbered List" className="touch-manipulation h-9 w-9 md:h-auto md:w-auto">
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={blockType === "check"} onPressedChange={() => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)} title="Check List" className="touch-manipulation h-9 w-9 md:h-auto md:w-auto">
        <CheckSquare className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-6 mx-0.5 md:mx-1 hidden md:block" />

      {/* Blocks */}
      <Toggle size="sm" pressed={blockType === "quote"} onPressedChange={formatQuote} title="Quote" className="touch-manipulation h-9 w-9 md:h-auto md:w-auto">
        <Quote className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={blockType === "code"} onPressedChange={formatCode} title="Code Block" className="touch-manipulation h-9 w-9 md:h-auto md:w-auto">
        <div className="flex items-center font-mono text-xs border rounded px-1">{'<>'}</div>
      </Toggle>

      <Separator orientation="vertical" className="h-6 mx-0.5 md:mx-1 hidden md:block" />

      {/* Alignment - Hidden on mobile for space */}
      <Button variant="ghost" size="icon" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")} title="Align Left" className="hidden md:flex touch-manipulation h-9 w-9 md:h-10 md:w-10">
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")} title="Align Center" className="hidden md:flex touch-manipulation h-9 w-9 md:h-10 md:w-10">
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")} title="Align Right" className="hidden md:flex touch-manipulation h-9 w-9 md:h-10 md:w-10">
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")} title="Justify" className="hidden md:flex touch-manipulation h-9 w-9 md:h-10 md:w-10">
        <AlignJustify className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-0.5 md:mx-1" />

      {/* Inserts */}
      <Toggle size="sm" pressed={isLink} onPressedChange={insertLink} title="Insert Link" className="touch-manipulation h-9 w-9 md:h-auto md:w-auto">
        <LinkIcon className="h-4 w-4" />
      </Toggle>
      <Button variant="ghost" size="icon" onClick={insertImage} title="Insert Image" className="touch-manipulation h-9 w-9 md:h-10 md:w-10">
        <ImageIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
