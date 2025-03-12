"use client";

import {
  Document,
  Image,
  Page,
  PDFDownloadLink,
  PDFViewer,
  Text,
} from "@react-pdf/renderer";
import dynamic from "next/dynamic";
// import { Document, Page, Text, Image } from "@react-pdf/renderer";
import { Suspense } from "react";
import { ClientOnly } from "./clientOnly";

export default function Home() {
  const doc = (
    <Document>
      <Page
        size={"A4"}
        style={{
          padding: 40,
          paddingTop: 32,
        }}
      >
        <Text>Hello world from client</Text>
        <Image src={"/image.jpg"} />
      </Page>
    </Document>
  );

  return (
    <div>
      <ClientOnly>
        <PDFViewer className="w-full h-svh">{doc}</PDFViewer>
      </ClientOnly>

      <ClientOnly>
        <PDFDownloadLink document={doc}>Download</PDFDownloadLink>
      </ClientOnly>
    </div>
  );
}
