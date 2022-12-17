import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
