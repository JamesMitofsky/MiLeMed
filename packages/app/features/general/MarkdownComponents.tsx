import { Text, View, Image } from '@my/ui'
import React from 'react'

// Heading components for different levels
const MarkdownHeading: React.FC<{ level: number; children: React.ReactNode }> = ({
  level,
  children,
}) => {
  console.log('level', level)
  const fontSize = 35 - level * 2 // Adjust font size based on heading level
  return <Text style={{ fontSize, fontWeight: 'bold', marginVertical: 8 }}>{children}</Text>
}

// Custom heading components for each level
export const H1: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MarkdownHeading level={1}>{children}</MarkdownHeading>
)

export const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MarkdownHeading level={2}>{children}</MarkdownHeading>
)

export const H3: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MarkdownHeading level={3}>{children}</MarkdownHeading>
)

export const H4: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MarkdownHeading level={4}>{children}</MarkdownHeading>
)

export const H5: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MarkdownHeading level={5}>{children}</MarkdownHeading>
)

export const H6: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MarkdownHeading level={6}>{children}</MarkdownHeading>
)

// Paragraph
export const MarkdownParagraph: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={{ fontSize: 16, marginVertical: 4 }}>{children}</Text>
)

// Inline code
export const MarkdownCode: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={{ fontFamily: 'monospace', backgroundColor: '#f0f0f0', padding: 4 }}>
    {children}
  </Text>
)

// Blockquote
export const MarkdownBlockquote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={{ borderLeftWidth: 4, borderLeftColor: '#ccc', paddingLeft: 16, marginVertical: 8 }}>
    <Text style={{ fontStyle: 'italic' }}>{children}</Text>
  </View>
)

// Unordered list
export const MarkdownUnorderedList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={{ paddingVertical: 4 }}>{children}</View>
)

// Ordered list
export const MarkdownOrderedList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={{ paddingVertical: 4 }}>{children}</View>
)

// List item
export const MarkdownListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 2 }}>
    <Text style={{ marginRight: 8 }}>•</Text>
    <Text>{children}</Text>
  </View>
)

// Link
export const MarkdownLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <Text
    style={{ color: 'blue', textDecorationLine: 'underline' }}
    onPress={() => console.log('this should open the link')} //todo add the linking here
  >
    {children}
  </Text>
)

// Image
export const MarkdownImage: React.FC<{ src: string; alt?: string }> = ({ src, alt }) => (
  <Image
    source={{ uri: src }}
    style={{ width: '100%', height: 200, marginVertical: 8 }}
    alt={alt}
  />
)

// Strong (bold text)
export const MarkdownStrong: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={{ fontWeight: 'bold' }}>{children}</Text>
)

// Emphasis (italic text)
export const MarkdownEmphasis: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={{ fontStyle: 'italic' }}>{children}</Text>
)

// Strikethrough
export const MarkdownStrikethrough: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={{ textDecorationLine: 'line-through' }}>{children}</Text>
)

// Horizontal rule
export const MarkdownHorizontalRule: React.FC = () => (
  <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 8 }} />
)
