//users/[userId]/projects/[projectId]/tasks/[taskId]

import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { projectId: string, taskId: string } }
) {
    try {
        const task = await prisma.task.findUnique({
            where: {
                projectId: parseInt(params.projectId),
                id: parseInt(params.taskId),
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

export async function PUT(
    req: NextRequest,
    { params }: { params: { projectId: string, taskId: string } }
) {
    try {
        const data = await req.json();
        const task = await prisma.task.update({
            where: {
                id: parseInt(params.taskId),
                projectId: parseInt(params.projectId),
            },
            data: {
                name: data.name,
                complexityLevel: data.complexityLevel,
                priority: data.priority,
                description: data.description,
                quantity: data.quantity,
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


export async function DELETE(
    req: NextRequest,
    { params }: { params: { projectId: string, taskId: string } }
) {
    try {
        const task = await prisma.task.delete({
            where: {
                id: parseInt(params.taskId),
                projectId: parseInt(params.projectId),
            },
        });
        if (!task) {
            return NextResponse.json(
                { success: false, error: 'Task not found' },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, message: `deleted ${task.name}` });
    } catch (error) {
        return NextResponse.json({ success: false, error: error });
    }
}