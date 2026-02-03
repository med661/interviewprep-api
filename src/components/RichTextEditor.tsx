'use client';

import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { Bold, Italic, List, ListOrdered, Image as ImageIcon, Link as LinkIcon, Code, Quote } from 'lucide-react';
import CodeBlockComponent from './CodeBlockComponent';

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  content: any;
  onChange: (content: any) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image,
      Link,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Highlight,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({
        lowlight,
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] border p-4 rounded-md text-black',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md">
      <div className="border-b p-2 flex gap-2 flex-wrap bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          type="button"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          type="button"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          type="button"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          type="button"
        >
          <ListOrdered size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1 rounded ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''}`}
          type="button"
        >
          <Code size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1 rounded ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
          type="button"
        >
          <Quote size={18} />
        </button>
        <button
          onClick={() => {
            const url = window.prompt('URL');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          className="p-1 rounded hover:bg-gray-200"
          type="button"
        >
          <ImageIcon size={18} />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
