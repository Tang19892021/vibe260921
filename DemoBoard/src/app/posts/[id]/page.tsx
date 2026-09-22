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
    <div>
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm">
        <Link href="/" className="text-blue-600 hover:text-blue-700">
          홈
        </Link>
        <span className="text-gray-400">/</span>
        <Link href="/posts" className="text-blue-600 hover:text-blue-700">
          게시물
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-600">상세보기</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Header */}
          <Card>
          <CardHeader className="border-0 pb-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge>{post.category}</Badge>
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <span>{post.author}</span>
                  <span>·</span>
                  <span>{formatDate(new Date(post.createdAt))}</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Post Content */}
        <Card>
          <CardContent className="p-6">
            <article className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </article>
          </CardContent>
        </Card>

        {/* Post Actions */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center gap-4 text-gray-600">
            <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
              <span className="text-sm">0</span>
            </button>
            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{comments.length}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Eye className="w-4 h-4" />
            <span className="text-sm">{post.views}</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">댓글 {comments.length}</h2>

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
                  className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmittingComment}>
                    {isSubmittingComment ? '작성 중...' : '댓글 작성'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="text-2xl">👤</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">{comment.author}</span>
                        <span className="text-xs text-gray-500">{formatDate(new Date(comment.created_at))}</span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                      <div className="mt-3 flex gap-3 text-sm text-gray-500">
                        <button className="hover:text-blue-500">좋아요</button>
                        <button className="hover:text-blue-500">답글</button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Sidebar />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">글쓴이</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl mb-3">👨‍💻</div>
              <h3 className="font-semibold text-gray-900 mb-2">{post.author}</h3>
              <p className="text-sm text-gray-600 mb-4">
                웹 개발자이며, Next.js와 React에 관심이 있습니다.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                프로필 보기
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">관련 글</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="#" className="block text-sm text-blue-600 hover:text-blue-700">
                → React Hooks 완벽 가이드
              </Link>
              <Link href="#" className="block text-sm text-blue-600 hover:text-blue-700">
                → TypeScript 5.0의 새로운 기능
              </Link>
              <Link href="#" className="block text-sm text-blue-600 hover:text-blue-700">
                → Tailwind CSS로 빠르게 UI 만들기
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
