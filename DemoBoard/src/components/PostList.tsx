'use client'

import { PostCard } from './PostCard'
import type { Post } from '@/lib/types'

interface PostListProps {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-12">
        <p className="text-gray-500 text-lg">게시물이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
