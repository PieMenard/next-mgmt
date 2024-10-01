//users/[userId]/projects/[projectId]/tasks/[taskId]

import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { projectId: string } }
) {
    try {
        const task = await prisma.task.findUnique({
            where: {
                id: parseInt(params.projectId),
            },
        });
        if (!task) {
            return NextResponse.json(
                { success: false, error: 'Task not found' },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, data: task });
    } catch (error) {
        return NextResponse.json({ success: false, error: error });
    }
}