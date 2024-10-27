import { Text, View, Image } from '@my/ui'
import React from 'react'

// Heading component with size prop
export const MarkdownHeading: React.FC<{
  level: number
  children: React.ReactNode
  size?: number
}> = ({ level, children, size = 16 }) => {
  const fontSize = size + (10 - level * 2) // Adjust font size based on heading level and base size
  return <Text style={{ fontSize, fontWeight: 'bold', marginVertical: 8 }}>{children}</Text>
}

// Paragraph component with size prop
export const MarkdownParagraph: React.FC<{ children: React.ReactNode; size?: number }> = ({
  children,
  size = 16,
}) => <Text style={{ fontSize: size, marginVertical: 4 }}>{children}</Text>

// Inline code component with size prop
export const MarkdownCode: React.FC<{ children: React.ReactNode; size?: number }> = ({
  children,
  size = 14,
}) => (
  <Text style={{ fontSize: size, fontFamily: 'monospace', backgroundColor: '#f0f0f0', padding: 4 }}>
    {children}
  </Text>
)

// Blockquote component with size prop
export const MarkdownBlockquote: React.FC<{ children: React.ReactNode; size?: number }> = ({
  children,
  size = 16,
}) => (
  <View style={{ borderLeftWidth: 4, borderLeftColor: '#ccc', paddingLeft: 16, marginVertical: 8 }}>
    <Text style={{ fontSize: size, fontStyle: 'italic' }}>{children}</Text>
  </View>
)

// Unordered list component with size prop
export const MarkdownUnorderedList: React.FC<{ children: React.ReactNode; size?: number }> = ({
  children,
  size = 16,
}) => (
  <View style={{ paddingVertical: 4 }}>
    <Text style={{ fontSize: size }}>{children}</Text>
  </View>
)

// Ordered list component with size prop
export const MarkdownOrderedList: React.FC<{ children: React.ReactNode; size?: number }> = ({
  children,
  size = 16,
}) => (
  <View style={{ paddingVertical: 4 }}>
    <Text style={{ fontSize: size }}>{children}</Text>
  </View>
)

// List item component with size prop
export const MarkdownListItem: React.FC<{ children: React.ReactNode; size?: number }> = ({
  children,
  size = 16,
}) => (
  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 2 }}>
    <Text style={{ fontSize: size, marginRight: 8 }}>•</Text>
    <Text style={{ fontSize: size }}>{children}</Text>
  </View>
)

// Link component with size prop
export const MarkdownLink: React.FC<{ href: string; children: React.ReactNode; size?: number }> = ({
  href,
  children,
  size = 16,
}) => (
  <Text
    style={{ fontSize: size, color: 'blue', textDecorationLine: 'underline' }}
    onPress={() => console.log('this should open the link')} //todo add the linking here
  >
    {children}
  </Text>
)

// Image component
export const MarkdownImage: React.FC<{ src: string; alt?: string }> = ({ src, alt }) => (
  <Image
    source={{ uri: src }}
    style={{ width: '100%', height: 200, marginVertical: 8 }}
    alt={alt}
  />
)

// Strong component (bold text) with size prop
export const MarkdownStrong: React.FC<{ children: React.ReactNode; size?: number }> = ({
  children,
  size = 16,
}) => <Text style={{ fontSize: size, fontWeight: 'bold' }}>{children}</Text>

// Emphasis component (italic text) with size prop
export const MarkdownEmphasis: React.FC<{ children: React.ReactNode; size?: number }> = ({
  children,
  size = 16,
}) => <Text style={{ fontSize: size, fontStyle: 'italic' }}>{children}</Text>

// Strikethrough component with size prop
export const MarkdownStrikethrough: React.FC<{ children: React.ReactNode; size?: number }> = ({
  children,
  size = 16,
}) => <Text style={{ fontSize: size, textDecorationLine: 'line-through' }}>{children}</Text>

// Horizontal rule component
export const MarkdownHorizontalRule: React.FC = () => (
  <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 8 }} />
)
