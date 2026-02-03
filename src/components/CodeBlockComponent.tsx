import { NodeViewContent, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

const CodeBlockComponent = ({ node: { attrs: { language: defaultLanguage }, textContent }, updateAttributes, extension }: NodeViewProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <NodeViewWrapper className="code-block relative my-4 rounded-lg overflow-hidden border border-gray-700 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-[#21252b] text-gray-300 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-blue-400" />
          <span className="text-xs font-mono lowercase">{defaultLanguage || 'text'}</span>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 text-xs hover:text-white transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="!m-0 !rounded-none !bg-[#282c34]">
        <NodeViewContent as={"code" as any} />
      </pre>
    </NodeViewWrapper>
  );
};

export default CodeBlockComponent;
