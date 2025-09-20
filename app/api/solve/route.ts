import { NextResponse } from 'next/server';
import { gaussianElimination, matrixInversion } from '@/app/lib/equationSolver';
import dbConnect from '@/app/lib/dbConnect';
import Equation from '@/app/models/Equation';

export async function POST(request: Request) {
  try {
    const { equations, method, userId } = await request.json();
    
    if (!equations || !Array.isArray(equations) || equations.length < 2) {
      return NextResponse.json(
        { error: 'At least two equations are required' },
        { status: 400 }
      );
    }
    
    if (!method || (method !== 'Gaussian Elimination' && method !== 'Matrix Inversion')) {
      return NextResponse.json(
        { error: 'Valid method is required' },
        { status: 400 }
      );
    }
    
    // Solve the equations using the specified method
    const solution = method === 'Gaussian Elimination'
      ? gaussianElimination(equations)
      : matrixInversion(equations);
    
    // If solution was found and userId provided, save to database
    if (solution.status === 'solved' && userId) {
      try {
        await dbConnect();
        
        await Equation.create({
          userId,
          equations,
          method,
          solution: solution.variables,
        });
      } catch (dbError) {
        console.error('Error saving to database:', dbError);
        // Continue anyway, don't fail the request
      }
    }
    
    return NextResponse.json({ solution });
  } catch (error) {
    console.error('Error solving equations:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
