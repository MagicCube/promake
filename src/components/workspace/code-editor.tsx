"use client";

import { javascriptLanguage } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { language } from "@codemirror/language";
import { languages } from "@codemirror/language-data";
import { basicLightInit } from "@uiw/codemirror-theme-basic";
import { monokaiInit } from "@uiw/codemirror-theme-monokai";
import type { Extension } from "@uiw/react-codemirror";
import CodeMirror, { Compartment, EditorState } from "@uiw/react-codemirror";
import { EditorView } from "codemirror";
import { useTheme } from "next-themes";

import { isJSON } from "@/core/utils/json";
import { cn } from "@/lib/utils";

import {
  usePromptInputAttachments,
  type AttachmentsContext,
} from "../ai-elements/prompt-input";

export interface EditorSettings {
  softWrap?: boolean;
  lineNumbers?: boolean;
  foldGutter?: boolean;
}

const customDarkTheme = monokaiInit({
  settings: {
    background: "transparent",
    gutterBackground: "transparent",
    gutterForeground: "#555",
    gutterActiveForeground: "#fff",
    fontSize: "var(--text-sm)",
  },
});

const customLightTheme = basicLightInit({
  settings: {
    fontSize: "var(--text-sm)",
  },
});

const languageConf = new Compartment();
const autoLanguage = EditorState.transactionExtender.of((tr) => {
  if (!tr.docChanged) return null;
  const content = tr.newDoc.sliceString(0, 100);
  const docIsJSON = isJSON(content);
  const currentLang = tr.startState.facet(language);
  const stateIsJSON = currentLang?.name === "json";
  if (docIsJSON === stateIsJSON) return null;
  return {
    effects: languageConf.reconfigure(
      docIsJSON
        ? json()
        : markdown({
            base: markdownLanguage,
            codeLanguages: languages,
            defaultCodeLanguage: javascriptLanguage,
          }),
    ),
  };
});

function imagePasteDetector(
  onImagePaste: (file: File, view: EditorView) => void,
) {
  return EditorView.domEventHandlers({
    paste(event, view) {
      const items = event.clipboardData?.items;
      if (!items) return false;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            onImagePaste(file, view);
          }
          return false;
        }
      }

      return false;
    },
  });
}

const buildCMExtension = ({
  attachments,
  settings,
}: {
  attachments: AttachmentsContext;
  settings?: EditorSettings;
}) => {
  const extensions: Extension[] = [];

  if (settings?.softWrap ?? true) {
    extensions.push(EditorView.lineWrapping);
  }

  extensions.push(
    languageConf.of(
      markdown({
        base: markdownLanguage,
        codeLanguages: languages,
        defaultCodeLanguage: javascriptLanguage,
      }),
    ),
    autoLanguage,
    imagePasteDetector((file) => {
      attachments.add([file]);
    }),
  );

  return extensions;
};

export interface CodeEditorProps {
  className?: string;
  value?: string;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  language?: "markdown" | "json";
  settings?: EditorSettings;
  onChange?: (val: string | undefined) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onPaste?: (e: React.ClipboardEvent) => void;
}

export function CodeEditor({
  className,
  placeholder,
  value,
  readonly,
  disabled,
  autoFocus,
  settings,
  onChange,
  onKeyDown,
  onPaste,
}: CodeEditorProps) {
  const { theme, systemTheme } = useTheme();
  const attachments = usePromptInputAttachments();

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div
      className={cn(
        "flex cursor-text flex-col overflow-hidden rounded-md",
        className,
      )}
    >
      <CodeMirror
        readOnly={readonly ?? disabled}
        placeholder={placeholder}
        className={cn(
          "h-full overflow-auto font-mono [&_.cm-editor]:h-full [&_.cm-focused]:outline-none!",
          "px-2 py-0! [&_.cm-line]:px-2! [&_.cm-line]:py-0!",
          {
            "opacity-50": readonly ?? disabled,
          },
        )}
        theme={currentTheme === "dark" ? customDarkTheme : customLightTheme}
        extensions={buildCMExtension({ attachments, settings })}
        basicSetup={{
          foldGutter: settings?.foldGutter ?? false,
          highlightActiveLine: false,
          highlightActiveLineGutter: false,
          lineNumbers: settings?.lineNumbers ?? false,
        }}
        autoFocus={autoFocus}
        value={value}
        onChange={onChange}
        onKeyDownCapture={onKeyDown}
        onPaste={onPaste}
      />
    </div>
  );
}
