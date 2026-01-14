"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $createParagraphNode, $createTextNode, BLUR_COMMAND } from "lexical";
import { useEffect, useState, useRef } from "react";

import theme from "./theme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";
import { ImageNode } from "./nodes/ImageNode";
import { fileService } from "@/lib/services/fileService";
import { useStore } from "@/context/store";
import { Loader2 } from "lucide-react";

function Placeholder() {
  return <div className="editor-placeholder absolute top-4.5 left-4.5 text-muted-foreground pointer-events-none select-none">Enter some text...</div>;
}

function LoadContentPlugin({ fileId, setIsLoading }: { fileId: string, setIsLoading: (loading: boolean) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    fileService.fetchFileContent(fileId, controller.signal).then(file => {
      if (file && file.content) {
        try {
          const editorState = editor.parseEditorState(file.content);
          editor.setEditorState(editorState);
        } catch (e) {
          editor.update(() => {
            const root = $getRoot();
            root.clear();
            const p = $createParagraphNode();
            p.append($createTextNode(file.content || ""));
            root.append(p);
          });
        }
      } else {
        editor.update(() => {
          const root = $getRoot();
          root.clear();
          const p = $createParagraphNode();
          root.append(p);
        });
      }

      setIsLoading(false);
    }).catch(err => {
      if (err.name !== 'CanceledError' && err.code !== "ERR_CANCELED") {
        console.error("Failed to load content", err);
        setIsLoading(false);
      }
    });

    return () => {
      controller.abort();
    };
  }, [fileId, editor, setIsLoading]);

  return null;
}

const URL_MATCHER = /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const EMAIL_MATCHER = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

const MATCHERS = [
  (text: string) => {
    const match = URL_MATCHER.exec(text);
    if (match === null) {
      return null;
    }
    const fullMatch = match[0];
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: fullMatch.startsWith('http') ? fullMatch : `https://${fullMatch}`,
    };
  },
  (text: string) => {
    const match = EMAIL_MATCHER.exec(text);
    if (match === null) {
      return null;
    }
    const fullMatch = match[0];
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: `mailto:${fullMatch}`,
    };
  },
];

const editorConfig = {
  namespace: "SyncoEditor",
  theme,
  onError(error: Error) {
    throw error;
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    ImageNode
  ],
};

export default function Editor({ fileId }: { fileId: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const { updateItemContent, isLoading: storeLoading, setSaveStatus } = useStore();



  // We need a plugin to handle Blur.
  // Since we are inside the component, we can define a simple one or use OnBlurPlugin if available?
  // Lexical doesn't have a direct "OnBlurPlugin" in the core packages usually, 
  // but we can use `editor.registerCommand(BLUR_COMMAND, ...)`
  // Or simpler: use `OnBlur` prop if explicitly supported by a plugin or just write a small effect.

  // Let's write a small custom plugin inside.

  function BlurAutoSavePlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
      return editor.registerCommand(
        BLUR_COMMAND,
        (payload) => {
          // We can access properties here.
          // However, to keep it clean, we should just invoke the logic.
          editor.getEditorState().read(() => {
            const json = JSON.stringify(editor.getEditorState());
            setSaveStatus("saving");
            fileService.updateFile(fileId, { content: json })
              .then(() => setSaveStatus("saved"))
              .catch(() => setSaveStatus("error"));
          });
          return false;
        },
        0
      );
    }, [editor]);
    return null;
  }

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container relative flex flex-col w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <ToolbarPlugin />
        <div className="editor-inner relative w-full flex-1 overflow-auto">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input w-full h-full p-4 outline-none" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin matchers={MATCHERS} />
          <TablePlugin />
          <ImagesPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <BlurAutoSavePlugin />
          <LoadContentPlugin fileId={fileId} setIsLoading={setIsLoading} />
        </div>
      </div>
    </LexicalComposer>
  );
}
