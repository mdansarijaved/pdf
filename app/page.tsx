import Link from "next/link";
import React from "react";

function Page() {
  return (
    <div>
      Page
      <Link href={"/pdf"}>Download</Link>
    </div>
  );
}

export default Page;
