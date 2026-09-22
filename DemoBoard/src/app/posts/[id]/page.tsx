'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Sidebar } from '@/components/Sidebar'
import { formatDate } from '@/lib/utils'
import { Heart, MessageCircle, Share2, Eye } from 'lucide-react'
import Link from 'next/link'
import type { Post } from '@/lib/types'

interface Comment {
  id: string
  post_id: string
  author: string
  content: string
  created_at: string
}

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [commentAuthor, setCommentAuthor] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [params.id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`)
      const data = await response.json()

      setPost({
        id: data.id,
        title: data.title,
        content: data.content,
        author: data.author,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        views: data.views || 0,
        category: data.category,
        tags: data.tags || [],
      })
    } catch (error) {
      console.error('Failed to fetch post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${params.id}`)
      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!commentAuthor.trim() || !commentContent.trim()) {
      alert('이름과 댓글 내용을 입력해주세요.')
      return
    }

    setIsSubmittingComment(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: params.id,
          author: commentAuthor,
          content: commentContent,
        }),
      })

      if (response.ok) {
        setCommentAuthor('')
        setCommentContent('')
        fetchComments()
      }
    } catch (error) {
      console.error('Failed to submit comment:', error)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500">게시물을 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge>{post.category}</Badge>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-3">
              {post.author} · {formatDate(post.createdAt)}
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-6 whitespace-pre-wrap">
            {post.content}
          </CardContent>
        </Card>

        <div className="flex gap-6 text-gray-600">
          <button className="flex items-center gap-2 hover:text-red-500">
            <Heart className="w-5 h-5" />
            <span>0</span>
          </button>
          <button className="flex items-center gap-2 hover:text-blue-500">
            <MessageCircle className="w-5 h-5" />
            <span>{comments.length}</span>
          </button>
          <button className="flex items-center gap-2 hover:text-blue-500">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">댓글 {comments.length}</h2>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <Input
                  placeholder="이름"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                />
                <textarea
                  placeholder="댓글을 작성해주세요..."
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={4}
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                />
                <Button type="submit" disabled={isSubmittingComment}>
                  {isSubmittingComment ? '작성 중...' : '댓글 작성'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-6">
                <div className="font-semibold">{comment.author}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {formatDate(new Date(comment.created_at))}
                </div>
                <p className="mt-2 whitespace-pre-wrap">{comment.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Sidebar />
      </div>
    </div>
  )
}
