"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  $createParagraphNode,
} from "lexical";
import { 
    INSERT_TABLE_COMMAND 
} from "@lexical/table";
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    INSERT_CHECK_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
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
  Undo,
  Redo,
  Image as ImageIcon,
  Table as TableIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Link as LinkIcon,
  Type,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { INSERT_IMAGE_COMMAND } from "./ImagesPlugin";

const LowPriority = 1;

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
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
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
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

  const insertTable = () => {
      editor.dispatchCommand(INSERT_TABLE_COMMAND, {
          columns: "3",
          rows: "3",
          includeHeaders: true,
      });
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
    <div className="toolbar flex flex-nowrap items-center gap-1 p-2 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-20 overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] *:shrink-0" ref={toolbarRef}>
      <Button
        variant="ghost"
        size="icon"
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        title="Undo (Ctrl+Z)"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        title="Redo (Ctrl+Y)"
      >
        <Redo className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      {/* Headings */}
      <Toggle size="sm" pressed={blockType === "h1"} onPressedChange={() => formatHeading("h1")} title="Heading 1">
        <Heading1 className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={blockType === "h2"} onPressedChange={() => formatHeading("h2")} title="Heading 2">
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={blockType === "h3"} onPressedChange={() => formatHeading("h3")} title="Heading 3">
        <Heading3 className="h-4 w-4" />
      </Toggle>
      
      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Formatting */}
      <Toggle size="sm" pressed={isBold} onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")} title="Bold (Ctrl+B)">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={isItalic} onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")} title="Italic (Ctrl+I)">
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={isUnderline} onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")} title="Underline (Ctrl+U)">
        <Underline className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={isStrikethrough} onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")} title="Strikethrough">
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={isCode} onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")} title="Inline Code">
        <Code className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Lists */}
      <Toggle size="sm" pressed={blockType === "bullet"} onPressedChange={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} title="Bullet List">
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={blockType === "number"} onPressedChange={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} title="Numbered List">
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={blockType === "check"} onPressedChange={() => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)} title="Check List">
        <CheckSquare className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Blocks */}
      <Toggle size="sm" pressed={blockType === "quote"} onPressedChange={formatQuote} title="Quote">
        <Quote className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={blockType === "code"} onPressedChange={formatCode} title="Code Block">
        <div className="flex items-center font-mono text-xs border rounded px-1">{'<>'}</div>
      </Toggle>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Alignment */}
      <Button variant="ghost" size="icon" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")} title="Align Left">
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")} title="Align Center">
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")} title="Align Right">
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")} title="Justify">
        <AlignJustify className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Inserts */}
      <Toggle size="sm" pressed={isLink} onPressedChange={insertLink} title="Insert Link">
        <LinkIcon className="h-4 w-4" />
      </Toggle>
      <Button variant="ghost" size="icon" onClick={insertImage} title="Insert Image">
        <ImageIcon className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={insertTable} title="Insert Table">
        <TableIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
