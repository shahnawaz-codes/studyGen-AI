import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Code2 } from 'lucide-react';

/**
 * Component to render markdown content with high contrast dark text and VS Code dark syntax highlighted code blocks
 */
export default function FormattedContent({ content, className = '' }) {
  let textContent = content;

  if (typeof content !== 'string' && content !== null && content !== undefined) {
    if (content.sections && Array.isArray(content.sections)) {
      textContent = content.sections
        .map(sec => `### ${sec.heading || sec.title || 'Section'}\n\n${sec.explanation || sec.content || ''}`)
        .join('\n\n---\n\n');
    } else {
      textContent = typeof content === 'object' ? JSON.stringify(content, null, 2) : String(content);
    }
  }

  return (
    <div className={`prose max-w-none text-zinc-900 text-xs sm:text-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Bold text styling - dark text with light emerald tint badge
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-zinc-950 bg-emerald-100/70 px-1.5 py-0.5 rounded border border-emerald-200/80" {...props} />
          ),
          // Headings styling
          h1: ({ node, ...props }) => <h1 className="text-lg font-extrabold text-zinc-950 mt-4 mb-2 tracking-tight" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-base font-bold text-zinc-900 mt-3 mb-2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-emerald-800 mt-2 mb-1" {...props} />,
          // List item styling
          li: ({ node, ...props }) => <li className="my-1 list-disc list-inside text-zinc-800 font-normal" {...props} />,
          // Paragraph styling
          p: ({ node, ...props }) => <p className="mb-3 leading-relaxed text-zinc-800 font-normal whitespace-pre-line" {...props} />,
          // Inline and block code rendering
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : 'javascript';
            const codeString = String(children).replace(/\n$/, '');

            if (inline) {
              return (
                <code className="bg-zinc-100 text-emerald-800 font-mono text-xs px-1.5 py-0.5 rounded border border-zinc-300/80 font-semibold" {...props}>
                  {children}
                </code>
              );
            }

            return <VSCodeBlock code={codeString} language={language} />;
          },
        }}
      >
        {textContent}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Custom VS Code Editor Window Component
 */
function VSCodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl font-mono text-xs">
      {/* VS Code Title Bar */}
      <div className="px-4 py-2 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-300 font-semibold px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800">
            <Code2 className="w-3 h-3 text-emerald-400" />
            <span>index.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : language}</span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700/60 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Syntax Highlighting Container */}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={true}
        customStyle={{
          margin: 0,
          padding: '1rem',
          fontSize: '0.825rem',
          lineHeight: '1.5',
          backgroundColor: '#030712',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
