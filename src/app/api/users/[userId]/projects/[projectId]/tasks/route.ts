//users/[userId]/projects/[projectId]/tasks

import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: { userId: string, projectId: string } }
) {
    const projectId = parseInt(params?.projectId);

    try {
        const data = await req.json();
        const task = await prisma.task.create({
            data: {
                name: data.name,
                dateOfRecording: (new Date()).toISOString().slice(0, 10).replace(/-/g, ""),
                complexityLevel: data.complexityLevel,
                priority: data.priority,
                description: data.description,
                quantity: data.quantity,
                project: {
                    connect: {
                        id: projectId,
                    },
                },
            },
        });
        return NextResponse.json({ success: true, data: task });
    } catch (error) {
        return NextResponse.json({ success: false, error: error });
    }
}

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
    const projectId = params?.projectId

    const { searchParams } = new URL(req.url);

    const complexityFilter = searchParams.get('complexity')
    const priorityFilter = searchParams.get('priority')

    const filters: any = {}

    if (projectId) {
        filters.projectId = parseInt(projectId)
    }
    if (complexityFilter) {
        filters.complexityLevel = parseInt(complexityFilter)
    }
    if (priorityFilter) {
        filters.priority = parseInt(priorityFilter)
    }

    try {
        const data = await prisma.task.findMany({
            where:
                filters

        })
        if (data.length === 0) {
            return NextResponse.json({ success: false, error: 'No tasks found' }, { status: 404 })
        }
        return NextResponse.json({ success: true, data: data })
    } catch (error) {
        return NextResponse.json({ success: false, error: error });
    }

}