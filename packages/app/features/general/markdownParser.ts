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
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
} from './MarkdownComponents'

export const parseMarkdown = (markdown: string) => {
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
        h1: H1,
        h2: H2,
        h3: H3,
        h4: H4,
        h5: H5,
        h6: H6,
        p: MarkdownParagraph,
        code: MarkdownCode,
        blockquote: MarkdownBlockquote,
        ul: MarkdownUnorderedList,
        ol: MarkdownOrderedList,
        li: MarkdownListItem,
        a: MarkdownLink,
        img: MarkdownImage,
        strong: MarkdownStrong,
        em: MarkdownEmphasis,
        del: MarkdownStrikethrough,
        hr: MarkdownHorizontalRule,
      },
    } as any)
    .processSync(markdown).result
}
