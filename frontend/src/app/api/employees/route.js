import { NextResponse } from "next/server";

export async function GET() {

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://atorix-backend-server.onrender.com";

  const response =
    await fetch(`${apiUrl}/api/admin/employees`);

  const data = await response.json();

  return NextResponse.json(data);
}
