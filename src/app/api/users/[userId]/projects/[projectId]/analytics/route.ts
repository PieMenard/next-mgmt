import { prisma } from '@/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string; projectId: string } }
) {
  const projectId = parseInt(params.projectId);
  const userId = parseInt(params.userId);

  try {
    // Fetch user and project validation
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { projects: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: user.id },
      include: { tasks: true },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' });
    }

    // Extract task data
    const tasks = project.tasks;

    // Compute required stats
    const totalTasks = tasks.length;
    const maxTaskQuantity = Math.max(...tasks.map((task) => task.quantity));
    const minTaskQuantity = Math.min(...tasks.map((task) => task.quantity));
    const maxTaskDate = Math.max(
      ...tasks.map((task) => parseInt(task.dateOfRecording))
    );
    const minTaskDate = Math.min(
      ...tasks.map((task) => parseInt(task.dateOfRecording))
    );
    const avgTaskQuantity =
      totalTasks > 0
        ? tasks.reduce((sum, task) => sum + task.quantity, 0) / totalTasks
        : 0;

    // Breakdown per complexity and priority
    const complexityBreakdown = <any>{};
    const priorityBreakdown = <any>{};
    const complexityQuantityBreakdown = <any>{};
    const priorityQuantityBreakdown = <any>{};

    tasks.forEach((task) => {
      // Complexity breakdown
      complexityBreakdown[task.complexityLevel] =
        (complexityBreakdown[task.complexityLevel] || 0) + 1;
      complexityQuantityBreakdown[task.complexityLevel] =
        (complexityQuantityBreakdown[task.complexityLevel] || 0) +
        task.quantity;

      // Priority breakdown
      priorityBreakdown[task.priority] =
        (priorityBreakdown[task.priority] || 0) + 1;
      priorityQuantityBreakdown[task.priority] =
        (priorityQuantityBreakdown[task.priority] || 0) + task.quantity;
    });

    // Return analytics data
    return NextResponse.json({
      success: true,
      data: {
        totalTasks,
        maxTaskQuantity,
        minTaskQuantity,
        maxTaskDate: maxTaskDate.toString(),
        minTaskDate: minTaskDate.toString(),
        avgTaskQuantity,
        breakdown: {
          tasksPerComplexity: complexityBreakdown,
          taskQuantitiesPerComplexity: complexityQuantityBreakdown,
          tasksPerPriority: priorityBreakdown,
          taskQuantitiesPerPriority: priorityQuantityBreakdown,
        },
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}
