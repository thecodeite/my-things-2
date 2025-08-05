import { QueryClient } from "@tanstack/react-query";
import type { TypedDocumentString } from "./graphql";

const authorisation =
  "sam;my-things;1774993230;0b10eaddb89c6a485c1d961e37d0c603a7e4f3f3120c051bd4028239c2f6a86f";

export async function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const response = await fetch("http://localhost:4000/graphql/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/graphql-response+json",
      authorization: authorisation,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const { data } = (await response.json()) as { data: TResult };
  return data;
}

export const queryClient = new QueryClient();
