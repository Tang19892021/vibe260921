'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PostList } from '@/components/PostList'
import { Sidebar } from '@/components/Sidebar'
import type { Post } from '@/lib/types'
import { ArrowRight, MessageSquare, Users, Zap } from 'lucide-react'

// Mock 데이터
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Next.js 14 소개: App Router와 새로운 기능들',
    content: 'Next.js 14에서는 App Router가 더욱 안정화되었고, 서버 컴포넌트가 기본이 되었습니다. 이 글에서는 주요 변경 사항을 알아봅니다.',
    author: '김개발',
    createdAt: new Date('2024-09-20'),
    updatedAt: new Date('2024-09-20'),
    views: 123,
    category: '기술',
    tags: ['Next.js', 'React', 'Web'],
  },
  {
    id: '2',
    title: 'TypeScript 5.0의 새로운 기능',
    content: 'TypeScript 5.0에서는 Decorators, const type parameters 등 새로운 기능이 추가되었습니다.',
    author: '박개발',
    createdAt: new Date('2024-09-19'),
    updatedAt: new Date('2024-09-19'),
    views: 89,
    category: '기술',
    tags: ['TypeScript', 'JavaScript'],
  },
  {
    id: '3',
    title: 'Tailwind CSS로 빠르게 UI 만들기',
    content: 'Tailwind CSS는 유틸리티 우선 CSS 프레임워크로, 빠르고 효율적인 디자인을 가능하게 합니다.',
    author: '이디자인',
    createdAt: new Date('2024-09-18'),
    updatedAt: new Date('2024-09-18'),
    views: 156,
    category: '기술',
    tags: ['Tailwind', 'CSS', 'Design'],
  },
]

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              DemoBoard에 오신 것을 환영합니다
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Next.js, TypeScript, Tailwind CSS, shadcn/ui로 만든 현대적인 게시판입니다.
              지금 바로 시작해보세요!
            </p>
            <div className="flex gap-4">
              <Link href="/posts">
                <Button size="lg" className="gap-2">
                  게시물 보기
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                글쓰기
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-lg p-8 shadow-lg">
              <div className="space-y-4">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">특징</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle>고속 성능</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Next.js와 서버 컴포넌트로 최고의 성능을 제공합니다.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <CardTitle>상호작용</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                댓글과 반응으로 다른 사용자와 소통하세요.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-pink-600" />
              </div>
              <CardTitle>커뮤니티</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                전 세계의 개발자들과 아이디어를 공유하세요.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Posts Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">최신 게시물</h2>
            <p className="text-gray-600 mt-2">커뮤니티의 최신 소식을 확인하세요</p>
          </div>
          <Link href="/posts">
            <Button variant="ghost">
              모두 보기
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PostList posts={mockPosts} />
          </div>
          <div>
            <Sidebar />
          </div>
        </div>
      </section>
    </div>
  )
}
