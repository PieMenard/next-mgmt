//users/[userId]/projects/[projectId]

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

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string; projectId: string } }
) {
  try {
    const data = await req.json();
    const project = await prisma.project.update({
      where: {
        id: parseInt(params.projectId),
        userId: parseInt(params.userId),
      },
      data: {
        name: data.name,
        unit: data.unit,
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string; projectId: string } }
) {
  try {
    const project = await prisma.project.delete({
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
    return NextResponse.json({
      success: true,
      message: `deleted ${project.name}`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}
