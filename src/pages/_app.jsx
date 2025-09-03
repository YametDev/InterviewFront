// ** Global css styles
import "../globals.css";
import Head from "next/head";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>JobSeeker</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;
