import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete comment' },
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
