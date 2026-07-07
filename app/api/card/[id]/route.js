import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Card from "../../../models/card";

export async function DELETE(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const deletedCard = await Card.findByIdAndDelete(id);
    if (!deletedCard) {
      return NextResponse.json({ message: "Card not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "Card deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
export async function PUT(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await req.json();
    const card = await Card.findByIdAndUpdate(id, body, { new: true });
    if (!card) {
      return NextResponse.json({ message: "Card not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Card updated successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
