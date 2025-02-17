import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <title>InterviewIO</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
      </Head>
      <body style={{ height: "100%", margin: "0px" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
