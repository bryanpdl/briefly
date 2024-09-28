import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 12,
    marginBottom: 5,
  },
  link: {
    color: '#1a0dab',
    textDecoration: 'underline',
  },
});

interface PDFDocumentProps {
  brief: string;
}

export const PDFDocument: React.FC<PDFDocumentProps> = ({ brief }) => {
  const formatBrief = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.match(/^[A-Z][a-z]+:$/)) {
        return <Text key={index} style={styles.heading}>{line}</Text>;
      } else {
        return (
          <Text key={index} style={styles.paragraph}>
            {formatLinks(line)}
          </Text>
        );
      }
    });
  };

  const formatLinks = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = text.split(linkRegex);

    return parts.map((part, index) => {
      if (index % 3 === 1) {
        // This is the link text
        return (
          <Link
            key={`link-${index}`}
            src={parts[index + 1]}
            style={styles.link}
          >
            {part}
          </Link>
        );
      } else if (index % 3 === 0) {
        // This is regular text
        return part;
      }
      return null;
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {formatBrief(brief)}
        </View>
      </Page>
    </Document>
  );
};