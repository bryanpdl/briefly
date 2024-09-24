import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
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
        return <Text key={index} style={styles.paragraph}>{line}</Text>;
      }
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