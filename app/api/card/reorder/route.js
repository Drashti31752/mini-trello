import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Card from "../../../models/card";

export async function PUT(req) {
  try {
    await connectDB();

    const { cards } = await req.json();

    for (const card of cards) {
      const existingCard = await Card.findOne({
        title: card.title,
        _id: { $ne: card._id },
      });

      if (existingCard) {
        return NextResponse.json(
          {
            success: false,
            message: `Card title "${card.title}" already exists.`,
          },
          { status: 400 },
        );
      }

      await Card.findByIdAndUpdate(card._id, {
        title: card.title,
        seq: card.seq,
        column: card.column,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Cards updated successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}
