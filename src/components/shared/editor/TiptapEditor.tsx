"use client";

import {useEffect} from "react";
import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Undo2,
    Redo2,
    RemoveFormatting,
    Minus,
    Pilcrow,
} from "lucide-react";
import {cn} from "@/lib/utils";

interface TiptapEditorProps {
    value?: string;
    onChange?: (html: string) => void;
    placeholder?: string;
    dir?: "rtl" | "ltr";
    minHeight?: string;
    className?: string;
    disabled?: boolean;
}

export function TiptapEditor({
    value = "",
    onChange,
    placeholder = "اكتب الوصف هنا...",
    dir = "rtl",
    minHeight = "220px",
    className,
    disabled = false,
}: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
        ],
        content: value,
        editable: !disabled,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: cn(
                    "focus:outline-none p-4 text-sm text-slate-100 leading-relaxed",
                    "prose-headings:text-white prose-p:text-slate-200 prose-strong:text-white",
                    "prose-code:text-blue-300 prose-pre:bg-slate-950/70"
                ),
                dir,
            },
        },
        onUpdate: ({editor}) => {
            const html = editor.getHTML();
            onChange?.(html === "<p></p>" ? "" : html);
        },
    });

    // Synchronize external value changes (e.g. initial fetch)
    useEffect(() => {
        if (!editor) return;
        if (value !== editor.getHTML()) {
            editor.commands.setContent(value || "", {emitUpdate: false});
        }
    }, [value, editor]);

    // Update editable state if disabled changes
    useEffect(() => {
        if (!editor) return;
        editor.setEditable(!disabled);
    }, [disabled, editor]);

    if (!editor) {
        return (
            <div
                className={cn(
                    "rounded-xl border border-white/10 bg-[#060b26]/60 p-4 animate-pulse text-slate-500 text-xs",
                    className
                )}
                style={{minHeight}}>
                جاري تحميل محرر النصوص...
            </div>
        );
    }

    const buttonClass = (isActive: boolean) =>
        cn(
            "p-1.5 rounded-lg text-xs transition-all flex items-center justify-center cursor-pointer",
            isActive
                ? "bg-blue-600/30 text-blue-400 border border-blue-500/40 shadow-[0_0_8px_rgba(0,117,255,0.3)]"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
        );

    return (
        <div
            className={cn(
                "rounded-xl border border-white/10 bg-[#060b26]/75 backdrop-blur-xl overflow-hidden focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/30 transition-all",
                disabled && "opacity-60 pointer-events-none",
                className
            )}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-white/[0.02]">
                {/* Paragraph */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={buttonClass(editor.isActive("paragraph"))}
                    title="فقرة عادية">
                    <Pilcrow className="size-3.5" />
                </button>

                {/* Headings */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
                    className={buttonClass(editor.isActive("heading", {level: 2}))}
                    title="عنوان رئيسي (H2)">
                    <Heading2 className="size-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
                    className={buttonClass(editor.isActive("heading", {level: 3}))}
                    title="عنوان فرعي (H3)">
                    <Heading3 className="size-3.5" />
                </button>

                <div className="w-[1px] h-4 bg-white/10 mx-1" />

                {/* Inline Formatting */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={buttonClass(editor.isActive("bold"))}
                    title="عريض (Bold)">
                    <Bold className="size-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={buttonClass(editor.isActive("italic"))}
                    title="مائل (Italic)">
                    <Italic className="size-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={buttonClass(editor.isActive("strike"))}
                    title="يتوسطه خط (Strike)">
                    <Strikethrough className="size-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={buttonClass(editor.isActive("code"))}
                    title="كود مدمج (Code)">
                    <Code className="size-3.5" />
                </button>

                <div className="w-[1px] h-4 bg-white/10 mx-1" />

                {/* Lists */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={buttonClass(editor.isActive("bulletList"))}
                    title="قائمة نقطية">
                    <List className="size-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={buttonClass(editor.isActive("orderedList"))}
                    title="قائمة رقمية">
                    <ListOrdered className="size-3.5" />
                </button>

                <div className="w-[1px] h-4 bg-white/10 mx-1" />

                {/* Blockquote & Divider */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={buttonClass(editor.isActive("blockquote"))}
                    title="اقتباس">
                    <Quote className="size-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    className={buttonClass(false)}
                    title="فاصل أفقي">
                    <Minus className="size-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                    className={buttonClass(false)}
                    title="مسح التنسيق">
                    <RemoveFormatting className="size-3.5" />
                </button>

                <div className="w-[1px] h-4 bg-white/10 mx-1 mr-auto rtl:mr-1 rtl:ml-auto" />

                {/* Undo / Redo */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className={cn(
                        buttonClass(false),
                        !editor.can().undo() && "opacity-30 cursor-not-allowed hover:bg-transparent"
                    )}
                    title="تراجع (Ctrl+Z)">
                    <Undo2 className="size-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className={cn(
                        buttonClass(false),
                        !editor.can().redo() && "opacity-30 cursor-not-allowed hover:bg-transparent"
                    )}
                    title="إعادة (Ctrl+Y)">
                    <Redo2 className="size-3.5" />
                </button>
            </div>

            {/* Editor Content Area */}
            <div
                className="prose prose-invert max-w-none [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-3 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-100 [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pr-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pr-5 [&_ol]:mb-2 [&_blockquote]:border-r-2 [&_blockquote]:border-blue-500 [&_blockquote]:pr-3 [&_blockquote]:italic [&_blockquote]:text-slate-300 [&_code]:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-blue-300 [&_code]:text-xs [&_hr]:border-white/10 [&_hr]:my-3"
                style={{minHeight}}>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
