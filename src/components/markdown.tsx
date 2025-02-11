'use client'

import ReactMarkdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeRaw from 'rehype-raw'
import { HTMLProps } from 'react'

interface MarkdownProps {
  children: string
}

export function Markdown({ children }: MarkdownProps) {
  // YAML 프론트매터 파싱
  const processedContent = children
    .replace(/^---\n([\s\S]*?)\n---/, (_, frontmatter) => {
      const metadata = frontmatter.split('\n')
        .map((line: string) => line.trim())
        .filter(Boolean)
        .map((line: string) => {
          if (line.startsWith('- ')) {
            return `  ${line}`  // 리스트 항목 들여쓰기
          }
          return line
        })
        .join('\n')

      return `<div class="prose-frontmatter">${metadata}</div>`
    })

  const components: Components = {
    code({ className, children }) {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''
      
      return !language ? (
        <code className={className}>{children}</code>
      ) : (
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          PreTag="div"
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      )
    },
    div: ({ className, children }) => {
      if (className === 'prose-frontmatter') {
        return (
          <div className="mb-6 p-4 bg-muted/50 rounded-md">
            <pre className="whitespace-pre text-sm leading-relaxed">
              {children}
            </pre>
          </div>
        )
      }
      return <div className={className}>{children}</div>
    },
    hr: () => <hr className="my-4 border-t border-border" />,
    h1: ({ children }: HTMLProps<HTMLHeadingElement>) => (
      <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }: HTMLProps<HTMLHeadingElement>) => (
      <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }: HTMLProps<HTMLHeadingElement>) => (
      <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>
    ),
    p: ({ children }: HTMLProps<HTMLParagraphElement>) => (
      <p className="my-4 leading-7">{children}</p>
    ),
    ul: ({ children }: HTMLProps<HTMLUListElement>) => (
      <ul className="list-disc pl-6 my-4">{children}</ul>
    ),
    ol: ({ children }: HTMLProps<HTMLOListElement>) => (
      <ol className="list-decimal pl-6 my-4">{children}</ol>
    ),
    li: ({ children }: HTMLProps<HTMLLIElement>) => (
      <li className="my-1">{children}</li>
    ),
    blockquote: ({ children }: HTMLProps<HTMLQuoteElement>) => (
      <blockquote className="border-l-4 border-border pl-4 my-4 italic">
        {children}
      </blockquote>
    ),
    table: ({ children }: HTMLProps<HTMLTableElement>) => (
      <div className="my-8 overflow-x-auto">
        <table className="w-full border-collapse border border-border">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: HTMLProps<HTMLTableSectionElement>) => (
      <thead className="bg-muted/50">{children}</thead>
    ),
    tbody: ({ children }: HTMLProps<HTMLTableSectionElement>) => (
      <tbody className="divide-y divide-border">{children}</tbody>
    ),
    tr: ({ children }: HTMLProps<HTMLTableRowElement>) => (
      <tr className="hover:bg-muted/50 transition-colors">{children}</tr>
    ),
    th: ({ children }: HTMLProps<HTMLTableCellElement>) => (
      <th className="px-6 py-3 text-left text-sm font-medium border-b border-r border-border last:border-r-0">
        {children}
      </th>
    ),
    td: ({ children }: HTMLProps<HTMLTableCellElement>) => (
      <td className="px-6 py-4 text-sm border-r border-border last:border-r-0 whitespace-pre-line">
        {children}
      </td>
    ),
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={components}
    >
      {processedContent}
    </ReactMarkdown>
  )
}
