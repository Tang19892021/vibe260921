'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PostList } from '@/components/PostList'
import { Sidebar } from '@/components/Sidebar'
import type { Post } from '@/lib/types'
import { ArrowRight, MessageSquare, Users, Zap } from 'lucide-react'

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLatestPosts()
  }, [])

  const fetchLatestPosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/posts')
      const data = await response.json()

      const formattedPosts = data.slice(0, 3).map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.author,
        createdAt: new Date(post.created_at),
        updatedAt: new Date(post.updated_at),
        views: post.views || 0,
        category: post.category,
        tags: post.tags || [],
      }))

      setLatestPosts(formattedPosts)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="py-12 md:py-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ✨ 현대적인 게시판 플랫폼
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              DemoBoard에 <br /> 오신 것을 환영합니다
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Next.js 14, TypeScript, Supabase로 만든 완전한 기능의 커뮤니티 게시판입니다.
              <br />지금 바로 게시물을 작성하고 커뮤니티와 소통하세요!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/posts">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  게시물 둘러보기
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/posts/new">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  첫 글 작성하기
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-3xl opacity-30"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
              <div className="space-y-4 mb-6">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded"></div>
                <div className="h-3 bg-gray-100 rounded w-5/6"></div>
              </div>
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="h-2 bg-gray-100 rounded flex-1"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="h-2 bg-gray-100 rounded flex-1"></div>
                </div>
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
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <p className="text-gray-500">로딩 중...</p>
              </div>
            ) : (
              <PostList posts={latestPosts} />
            )}
          </div>
          <div>
            <Sidebar />
          </div>
        </div>
      </section>
    </div>
  )
}
