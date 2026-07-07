import Card from "../../models/card";
import { connectDB } from "../../../lib/db";
import { NextResponse } from "next/server";
import Column from "../../models/Columns";

export async function GET() {
  try {
    await connectDB();
    const cards = await Card.find();

    if (!cards) {
      return NextResponse.json({ message: "No cards found" }, { status: 404 });
    }
    return NextResponse.json({ cards });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { columnId, title, description } = await req.json();

    const lastCard = await Card.findOne({
      column: columnId,
    }).sort({ seq: -1 });
    const seq = lastCard ? lastCard.seq + 1 : 1;

    if (!title || !description || !columnId) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }
    const existingCard = await Card.findOne({ title, column: columnId });
    if (existingCard) {
      return NextResponse.json(
        { message: "Card already exists" },
        { status: 400 },
      );
    }
    const newCard = await Card.create({
      title,
      description,
      seq,
      column: columnId,
    });
    return NextResponse.json({
      message: "Card created successfully",
      card: newCard,
    });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
