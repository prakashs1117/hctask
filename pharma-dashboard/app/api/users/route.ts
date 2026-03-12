import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import * as mockData from '@/lib/data/users';
import * as dbData from '@/lib/data/users-db';
import { z } from 'zod';

const { getAllUsers, createUser } = env.useMockData ? mockData : dbData;

// Validation schema for creating a user
const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['Manager', 'Staff', 'Viewer'], {
    message: 'Role is required'
  }),
  assignedPrograms: z.array(z.string()).default([]),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = CreateUserSchema.parse(body);

    const newUser = await createUser(validatedData);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    console.error('Failed to create user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
