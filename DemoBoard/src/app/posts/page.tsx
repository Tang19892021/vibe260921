'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PostList } from '@/components/PostList'
import { Sidebar } from '@/components/Sidebar'
import type { Post, Category, CATEGORIES } from '@/lib/types'
import Link from 'next/link'
import { Search, Plus, ChevronDown, BarChart3 } from 'lucide-react'

type SortType = 'latest' | 'views' | 'oldest'

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortType>('latest')
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [posts, searchQuery, selectedCategory, sortBy])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/posts')
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

  const applyFiltersAndSort = () => {
    let result = [...posts]

    // 검색 필터
    if (searchQuery) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      result = result.filter((post) => post.category === selectedCategory)
    }

    // 정렬
    switch (sortBy) {
      case 'latest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'views':
        result.sort((a, b) => b.views - a.views)
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
    }

    setFilteredPosts(result)
    setCurrentPage(1)
  }

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  )
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">게시물</h1>
          <p className="text-gray-600 mt-2">
            총 {filteredPosts.length}개의 게시물 | 현재 {currentPage} / {totalPages} 페이지
          </p>
        </div>
        <Link href="/posts/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            새 게시물 작성
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="게시물 검색..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">📂 모든 카테고리</option>
                <option value="기술">🔧 기술</option>
                <option value="일상">📝 일상</option>
                <option value="뉴스">📰 뉴스</option>
                <option value="질문">❓ 질문</option>
                <option value="공지">📢 공지</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="latest">⏱️ 최신순</option>
                <option value="views">👁️ 조회순</option>
                <option value="oldest">📅 오래된순</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-500 text-lg mb-2">게시물이 없습니다</p>
              <p className="text-gray-400 text-sm">다른 검색어나 카테고리를 시도해보세요</p>
            </Card>
          ) : (
            <>
              <PostList posts={paginatedPosts} />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    ← 이전
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    다음 →
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <div>
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
