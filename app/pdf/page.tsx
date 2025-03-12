"use client";

import { Document, Image, Page, Text } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
// import { Document, Page, Text, Image } from "@react-pdf/renderer";
import { Suspense } from "react";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
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
      {/* <Suspense fallback={<div>Loading preview...</div>}>

        <PDFViewer className="w-full h-svh">{doc}</PDFViewer>
      </Suspense> */}

      <PDFDownloadLink document={doc}>Download</PDFDownloadLink>
    </div>
  );
}
