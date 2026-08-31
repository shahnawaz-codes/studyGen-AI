import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Code2 } from 'lucide-react';

/**
 * Component to render markdown content with VS Code dark syntax highlighted code blocks
 */
export default function FormattedContent({ content, className = '' }) {
  const textContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);

  return (
    <div className={`prose prose-invert max-w-none text-slate-300 text-xs sm:text-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Bold text styling
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-white bg-slate-800/60 px-1 py-0.5 rounded border border-slate-700/50" {...props} />
          ),
          // Headings styling
          h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-brand-300 mt-4 mb-2" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-base font-bold text-brand-300 mt-3 mb-2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-emerald-400 mt-2 mb-1" {...props} />,
          // List item styling
          li: ({ node, ...props }) => <li className="my-1 list-disc list-inside text-slate-300" {...props} />,
          // Paragraph styling
          p: ({ node, ...props }) => <p className="mb-3 leading-relaxed text-slate-300 whitespace-pre-line" {...props} />,
          // Code block rendering with VS Code Dark Plus theme
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : 'javascript';
            const codeString = String(children).replace(/\n$/, '');

            if (inline) {
              return (
                <code className="bg-slate-800 text-emerald-300 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-700/60" {...props}>
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
    <div className="my-4 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl font-mono text-xs">
      {/* VS Code Title Bar */}
      <div className="px-4 py-2 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800">
            <Code2 className="w-3 h-3 text-brand-400" />
            <span>index.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : language}</span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700/60 transition-all"
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
