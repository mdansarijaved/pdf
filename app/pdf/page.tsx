"use client";

import dynamic from "next/dynamic";
// import { Document, Page, Text, Image } from "@react-pdf/renderer";
import { Suspense } from "react";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
  }
);
const Document = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.Document),
  {
    ssr: false,
  }
);
const Page = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.Page),
  {
    ssr: false,
  }
);
const Text = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.Text),
  {
    ssr: false,
  }
);
const Image = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.Image),
  {
    ssr: false,
  }
);
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
  }
);
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
      <Suspense fallback={<div>Loading preview...</div>}>
        {/* <PdfPreview /> */}
        <PDFViewer className="w-full h-svh">{doc}</PDFViewer>
      </Suspense>

      <Suspense fallback={<div>Loading preview...</div>}>
        <PDFDownloadLink document={doc}>Download</PDFDownloadLink>
      </Suspense>
    </div>
  );
}
