import { playlist } from "@/components/player/playlist"
import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json(playlist)
}
