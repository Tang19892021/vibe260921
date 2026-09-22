import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // 조회수 증가
    await supabase
      .from('posts')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', id)

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const { data, error } = await supabase
      .from('posts')
      .update({
        title: body.title,
        content: body.content,
        category: body.category,
        tags: body.tags,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update post' },
        { status: 400 }
      )
    }

    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete post' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
