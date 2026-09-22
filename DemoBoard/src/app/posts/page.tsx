'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PostList } from '@/components/PostList'
import { Sidebar } from '@/components/Sidebar'
import type { Post } from '@/lib/types'
import Link from 'next/link'
import { Search, Plus } from 'lucide-react'

// Mock 데이터
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Next.js 14 소개: App Router와 새로운 기능들',
    content: 'Next.js 14에서는 App Router가 더욱 안정화되었고, 서버 컴포넌트가 기본이 되었습니다.',
    author: '김개발',
    createdAt: new Date('2024-09-20'),
    updatedAt: new Date('2024-09-20'),
    views: 123,
    category: '기술',
    tags: ['Next.js', 'React'],
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
    tags: ['TypeScript'],
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
    tags: ['Tailwind', 'CSS'],
  },
  {
    id: '4',
    title: '오늘의 코딩 생각',
    content: '코딩을 배운 지 벌써 3년이 되었다. 처음에는 어려웠지만 이제는 재미있다.',
    author: '일상개발',
    createdAt: new Date('2024-09-17'),
    updatedAt: new Date('2024-09-17'),
    views: 45,
    category: '일상',
    tags: ['일상'],
  },
  {
    id: '5',
    title: '개발자 채용 정보',
    content: '대형 IT 회사에서 경력 개발자를 채용 중입니다. 자세한 사항은 공고를 참고하세요.',
    author: '뉴스팀',
    createdAt: new Date('2024-09-16'),
    updatedAt: new Date('2024-09-16'),
    views: 234,
    category: '뉴스',
    tags: ['채용', '뉴스'],
  },
  {
    id: '6',
    title: 'React Hooks 완벽 가이드',
    content: 'React Hooks를 사용하여 함수형 컴포넌트에서 상태 관리와 생명주기를 다루는 방법을 배워봅시다.',
    author: '김개발',
    createdAt: new Date('2024-09-15'),
    updatedAt: new Date('2024-09-15'),
    views: 312,
    category: '기술',
    tags: ['React', 'Hooks', 'JavaScript'],
  },
]

export default function PostsPage() {
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
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PostList posts={mockPosts} />
        </div>
        <div>
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
