"use client";
import { ApolloProvider as Provider, InMemoryCache, ApolloClient } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/", // BFF endpoint
  cache: new InMemoryCache(),
  credentials: "include", // send cookies for auth
});

export default function ApolloProvider({ children }: { children: React.ReactNode }) {
  return <Provider client={client}>{children}</Provider>;
}
