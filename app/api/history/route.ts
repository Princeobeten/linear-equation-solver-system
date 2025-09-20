import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Equation from '@/app/models/Equation';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    const equations = await Equation.find({ userId })
      .sort({ createdAt: -1 }) // Most recent first
      .limit(50); // Limit to 50 results
    
    return NextResponse.json({ equations });
  } catch (error) {
    console.error('Error retrieving equation history:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve history' },
      { status: 500 }
    );
  }
}
