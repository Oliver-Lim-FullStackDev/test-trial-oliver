import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

/**
 * Handle POST request to the /api/register route.
 * Create a new user in the database and return a JSON response.
 *
 * @param {Request} req - The incoming request.
 * @return {Promise<Response>} - A JSON response with the created user's name and email.
 *                               If an error occurs, a JSON response with the error message.
 */
export async function POST(req: Request): Promise<Response> {
  try {
    // Parse incoming JSON data
    const { name, email, password, address } = (await req.json()) as {
      name: string;
      email: string;
      password: string;
      address: string;
    };

    // Hash the user's password
    const hashed_password = await hash(password, 12);

    // Create a new user in the database
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(), // Normalize the email to lowercase
        password: hashed_password,
        address,
      },
    });

    // Return a JSON response with the created user's name and email
    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    // Return a JSON response with the error message if an error occurred
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
