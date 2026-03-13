// /app/api/test-db/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    // simple test query to check DB connection
    const result = await query("SELECT NOW()");

    return NextResponse.json({
      success: true,
      time: result[0], // query() returns an array of rows
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}