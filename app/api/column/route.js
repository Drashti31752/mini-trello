import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Column from "../../models/Columns";

export async function GET(req) {
  await connectDB();
  const columns = await Column.find();

  if (!columns) {
    return NextResponse.json({ message: "No columns found" }, { status: 404 });
  }
  return NextResponse.json({ columns });
}

export async function POST(req) {
  try {
    await connectDB();

    const { title } = await req.json();

    const lastColumn = await Column.findOne().sort({ seq: -1 });

    const seq = lastColumn ? lastColumn.seq + 1 : 1;

    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 },
      );
    }
    console.log();
    const existingColumn = await Column.findOne({ title });
    if (existingColumn) {
      return NextResponse.json(
        { message: "Column with this title already exists" },
        { status: 400 },
      );
    }

    const newColumn = await Column.create({ title, seq });
    return NextResponse.json({ message: "Column created successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
