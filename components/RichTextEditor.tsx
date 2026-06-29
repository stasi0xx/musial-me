"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapImage from "@tiptap/extension-image";
import { useEffect, useCallback, useRef, useState } from "react";
import MediaPicker from "@/components/MediaPicker";

const FONT_SIZES = [
  { label: "Małe", value: "12px" },
  { label: "Normalne", value: "" },
  { label: "Duże", value: "18px" },
  { label: "Bardzo duże", value: "24px" },
  { label: "Ogromne", value: "32px" },
];

interface Props {
  value: string;
  onChange: (html: string) => void;
}

type ToolbarButtonProps = {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
};

function ToolbarButton({ onClick, active, disabled, children, title }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      className={`h-7 min-w-[28px] px-2 border font-sans text-[10px] uppercase tracking-[0.15em] transition-colors ${
        active
          ? "bg-black text-white border-black"
          : "bg-transparent border-black/20 hover:border-black"
      } disabled:opacity-30`}
    >
      {children}
    </button>
  );
}

type EditorWithFontSize = {
  setFontSize: (size: string) => { run: () => void };
  unsetFontSize: () => { run: () => void };
};

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
        link: { openOnClick: false, HTMLAttributes: { class: "underline" } },
      }),
      TextStyleKit.configure({ fontSize: {}, textStyle: {} }),
      Placeholder.configure({ placeholder: "Pełna treść artykułu…" }),
      TiptapImage.configure({ inline: false, allowBase64: false }),
    ],
    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "min-h-[320px] w-full px-4 py-3 font-serif text-sm leading-relaxed focus:outline-none prose prose-sm max-w-none",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL:", prev ?? "https://");
    if (url === null) return;
    if (url === "") { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const currentFontSize = editor?.getAttributes("textStyle")?.fontSize as string | undefined;

  const imageFileRef = useRef<HTMLInputElement>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const insertImage = useCallback((url: string) => {
    if (!editor) return;
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;
    setImageUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) insertImage(data.url);
    setImageUploading(false);
  }, [editor, insertImage]);

  if (!editor) return null;

  return (
    <div className="border border-black/20 focus-within:border-black transition-colors">
      <div className="flex flex-wrap gap-1 px-3 py-2 border-b border-black/10 bg-black/[0.02]">

        {/* Font size */}
        <select
          title="Rozmiar tekstu"
          value={currentFontSize ?? ""}
          onMouseDown={e => e.stopPropagation()}
          onChange={e => {
            const size = e.target.value;
            const chain = editor.chain().focus() as unknown as EditorWithFontSize;
            if (size) chain.setFontSize(size).run();
            else chain.unsetFontSize().run();
          }}
          className="h-7 px-2 border border-black/20 bg-transparent font-sans text-[10px] uppercase tracking-[0.1em] focus:outline-none hover:border-black transition-colors cursor-pointer"
        >
          {FONT_SIZES.map(s => (
            <option key={s.label} value={s.value}>{s.label}</option>
          ))}
        </select>

        <span className="w-px bg-black/10 mx-1 self-stretch" />

        <ToolbarButton title="Pogrubienie" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>B</ToolbarButton>
        <ToolbarButton title="Kursywa" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><em>I</em></ToolbarButton>

        <span className="w-px bg-black/10 mx-1 self-stretch" />

        <ToolbarButton title="Nagłówek H2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>H2</ToolbarButton>
        <ToolbarButton title="Nagłówek H3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>H3</ToolbarButton>

        <span className="w-px bg-black/10 mx-1 self-stretch" />

        <ToolbarButton title="Lista punktowana" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>• Lista</ToolbarButton>
        <ToolbarButton title="Lista numerowana" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>1. Lista</ToolbarButton>

        <span className="w-px bg-black/10 mx-1 self-stretch" />

        <ToolbarButton title="Cytat" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>&quot; Cytat</ToolbarButton>
        <ToolbarButton title="Linia pozioma" onClick={() => editor.chain().focus().setHorizontalRule().run()}>—</ToolbarButton>

        <span className="w-px bg-black/10 mx-1 self-stretch" />

        <ToolbarButton title="Link" onClick={setLink} active={editor.isActive("link")}>Link</ToolbarButton>
        <ToolbarButton title="Usuń link" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")}>↗̶</ToolbarButton>

        <span className="w-px bg-black/10 mx-1 self-stretch" />

        <ToolbarButton title="Cofnij" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>↩</ToolbarButton>
        <ToolbarButton title="Ponów" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>↪</ToolbarButton>

        <span className="w-px bg-black/10 mx-1 self-stretch" />

        <ToolbarButton
          title="Wgraj zdjęcie"
          onClick={() => imageFileRef.current?.click()}
          disabled={imageUploading}
        >
          {imageUploading ? "Wysyłanie…" : "Zdjęcie"}
        </ToolbarButton>
        <ToolbarButton
          title="Zdjęcie z biblioteki"
          onClick={() => setMediaPickerOpen(true)}
        >
          Biblioteka
        </ToolbarButton>
      </div>

      <input
        ref={imageFileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
          if (imageFileRef.current) imageFileRef.current.value = "";
        }}
      />

      <EditorContent editor={editor} />

      <MediaPicker
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={url => insertImage(url)}
      />
    </div>
  );
}
