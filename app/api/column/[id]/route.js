import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Column from "../../../models/Columns";
import Card from "../../../models/card";

export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;
  const column = await Column.findById(id);
  if (!column) {
    return NextResponse.json({ message: "Column not found" }, { status: 404 });
  }
  return NextResponse.json({ column });
}

export async function DELETE(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const deletedColumn = await Column.findByIdAndDelete(id);
    await Card.deleteMany({ column: id });

    if (!deletedColumn) {
      return NextResponse.json(
        { message: "Column not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Column deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req, context) {
  await connectDB();
  const { id } = await context.params;
  const { title } = await req.json();
  const column = await Column.findByIdAndUpdate(id, { title });
  if (!column) {
    return NextResponse.json({ message: "Column not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Column updated successfully" });
}
