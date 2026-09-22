'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PostList } from '@/components/PostList'
import { Sidebar } from '@/components/Sidebar'
import type { Post } from '@/lib/types'
import Link from 'next/link'
import { Search, Plus } from 'lucide-react'

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async (query?: string) => {
    try {
      setIsLoading(true)
      const url = new URL('/api/posts', window.location.origin)

      if (query) {
        url.searchParams.append('search', query)
      }

      const response = await fetch(url.toString())
      const data = await response.json()

      const formattedPosts = data.map((post: any) => ({
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

      setPosts(formattedPosts)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    fetchPosts(value)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">게시물</h1>
          <p className="text-gray-600 mt-2">모든 게시물을 한 곳에서 확인하세요</p>
        </div>
        <Link href="/posts/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            새 게시물 작성
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="게시물 검색..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-gray-500">로딩 중...</p>
            </div>
          ) : (
            <PostList posts={posts} />
          )}
        </div>
        <div>
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
