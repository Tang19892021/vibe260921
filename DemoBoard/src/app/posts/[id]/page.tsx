'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sidebar } from '@/components/Sidebar'
import { formatDate } from '@/lib/utils'
import { Heart, MessageCircle, Share2, Eye } from 'lucide-react'
import Link from 'next/link'

// Mock 데이터
const post = {
  id: '1',
  title: 'Next.js 14 소개: App Router와 새로운 기능들',
  content: `Next.js 14에서는 App Router가 더욱 안정화되었고, 서버 컴포넌트가 기본이 되었습니다.

## 주요 변경 사항

### 1. App Router의 안정화
App Router는 이제 완전히 안정화되어 프로덕션 환경에서 안전하게 사용할 수 있습니다.

### 2. 서버 컴포넌트의 기본화
모든 컴포넌트가 기본적으로 서버 컴포넌트가 되어 성능을 크게 향상시킬 수 있습니다.

### 3. Streaming과 Suspense
더 나은 UX를 위해 Streaming과 Suspense를 활용할 수 있습니다.

이러한 변경 사항들은 Next.js를 더욱 강력하고 효율적인 프레임워크로 만들어줍니다.`,
  author: '김개발',
  createdAt: new Date('2024-09-20'),
  updatedAt: new Date('2024-09-20'),
  views: 123,
  category: '기술',
  tags: ['Next.js', 'React', 'Web'],
}

const comments = [
  {
    id: '1',
    author: '박개발',
    content: '정말 좋은 글입니다! 많이 배워갑니다.',
    createdAt: new Date('2024-09-20T10:30:00'),
    avatar: '👨‍💻',
  },
  {
    id: '2',
    author: '이디자인',
    content: 'App Router를 사용해보니 정말 편하네요.',
    createdAt: new Date('2024-09-20T11:00:00'),
    avatar: '👩‍💻',
  },
]

export default function PostDetailPage() {
  return (
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
                  <span>{formatDate(post.createdAt)}</span>
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
              <span className="text-sm">123</span>
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
              <textarea
                placeholder="댓글을 작성해주세요..."
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
              />
              <div className="mt-3 flex justify-end">
                <Button>댓글 작성</Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="text-2xl">{comment.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">{comment.author}</span>
                        <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
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
