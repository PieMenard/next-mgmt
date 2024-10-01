import { prisma } from '@/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const id = parseInt(params?.userId);
  try {
    const data = await req.json();
    const project = await prisma.project.create({
      data: {
        name: data.name,
        unit: data.unit,
        user: {
          connect: {
            id: id,
          },
        },
      },
    });
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}
