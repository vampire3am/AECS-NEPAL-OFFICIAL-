import { getAuth } from "@/lib/auth";
import type { NextRequest } from "next/server";
type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
function handler(method: Method) {
  return (
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> },
  ) => getAuth().handler()[method](request, context);
}
export const GET = handler("GET"),
  POST = handler("POST"),
  PUT = handler("PUT"),
  DELETE = handler("DELETE"),
  PATCH = handler("PATCH");

