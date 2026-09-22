'use client'

import Link from 'next/link'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { formatDate, truncateText } from '@/lib/utils'
import type { Post } from '@/lib/types'
import { Eye, MessageCircle } from 'lucide-react'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
              </div>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2">
              {truncateText(post.content, 100)}
            </p>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{post.category}</Badge>
              {post.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{post.author}</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs">{post.views}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
