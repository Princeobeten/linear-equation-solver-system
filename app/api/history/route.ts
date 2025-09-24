import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Equation from '@/app/models/Equation';
import mongoose from 'mongoose';

// Sample data for fallback when database is unavailable
const sampleEquations = [
  {
    _id: 'sample1',
    equations: ['2x + y = 5', 'x - y = 1'],
    method: 'Gaussian Elimination',
    solution: { variables: { x: 2, y: 1 } },
    createdAt: new Date().toISOString(),
    userId: 'demo'
  },
  {
    _id: 'sample2',
    equations: ['x + y + z = 6', '2x - y + z = 3', 'x + 2y - z = 2'],
    method: 'Matrix Inversion',
    solution: { variables: { x: 1, y: 2, z: 3 } },
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    userId: 'demo'
  }
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }
  
  try {
    // Try to connect to MongoDB
    await dbConnect();
    
    // Check if mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      console.warn('MongoDB is not connected. Using sample data.');
      // Use sample data for development/testing when DB is unavailable
      return NextResponse.json({ equations: sampleEquations });
    }
    
    // If connected, query the database
    const equations = await Equation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
    
    console.log(`Found ${equations.length} equations for user ${userId}`);
    return NextResponse.json({ equations });
    
  } catch (error) {
    console.error('Error retrieving equation history:', error);
    
    // Log detailed error information
    if (error instanceof mongoose.Error) {
      console.error('MongoDB Error Type:', error.name);
      console.error('MongoDB Error Message:', error.message);
    }
    
    if (process.env.NODE_ENV === 'development') {
      // In development, use sample data as fallback
      console.warn('Using sample data as fallback due to database error');
      return NextResponse.json({ 
        equations: sampleEquations,
        warning: 'Using sample data due to database connection issue'
      });
    } else {
      // In production, return error
      return NextResponse.json(
        { error: 'Failed to retrieve history' },
        { status: 500 }
      );
    }
  }
}
