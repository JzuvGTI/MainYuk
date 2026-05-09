import { NextResponse } from "next/server";

export function ok<T>(data: T) {
  return NextResponse.json(data);
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

export function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}
