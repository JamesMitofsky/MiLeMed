import * as devRuntime from 'react/jsx-dev-runtime'
import * as runtime from 'react/jsx-runtime'
import rehypeReact from 'rehype-react'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

import {
  MarkdownParagraph,
  MarkdownCode,
  MarkdownBlockquote,
  MarkdownEmphasis,
  MarkdownHorizontalRule,
  MarkdownImage,
  MarkdownLink,
  MarkdownListItem,
  MarkdownOrderedList,
  MarkdownStrikethrough,
  MarkdownStrong,
  MarkdownUnorderedList,
  MarkdownHeading,
} from './MarkdownComponents'

export const parseMarkdown = (markdown: string, size?: number) => {
  const isDev = process.env.NODE_ENV === 'development'

  const jsxOptions = isDev
    ? { ...devRuntime, development: true }
    : { ...runtime, development: false }

  return unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeReact, {
      ...jsxOptions,
      components: {
        h1: (props) => <MarkdownHeading level={1} size={size} {...props} />,
        h2: (props) => <MarkdownHeading level={2} size={size} {...props} />,
        h3: (props) => <MarkdownHeading level={3} size={size} {...props} />,
        h4: (props) => <MarkdownHeading level={4} size={size} {...props} />,
        h5: (props) => <MarkdownHeading level={5} size={size} {...props} />,
        h6: (props) => <MarkdownHeading level={6} size={size} {...props} />,
        p: (props) => <MarkdownParagraph size={size} {...props} />,
        code: (props) => <MarkdownCode size={size} {...props} />,
        blockquote: (props) => <MarkdownBlockquote size={size} {...props} />,
        ul: (props) => <MarkdownUnorderedList size={size} {...props} />,
        ol: (props) => <MarkdownOrderedList size={size} {...props} />,
        li: (props) => <MarkdownListItem size={size} {...props} />,
        a: (props) => <MarkdownLink size={size} {...props} />,
        img: (props) => <MarkdownImage {...props} />,
        strong: (props) => <MarkdownStrong size={size} {...props} />,
        em: (props) => <MarkdownEmphasis size={size} {...props} />,
        del: (props) => <MarkdownStrikethrough size={size} {...props} />,
        hr: (props) => <MarkdownHorizontalRule {...props} />,
      },
    } as any)
    .processSync(markdown).result
}
