import { prisma } from '@/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string; projectId: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: parseInt(params.projectId),
        userId: parseInt(params.userId),
      },
    });
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}
