'use client'

import Link from 'next/link'
import { Button } from './ui/button'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold text-gray-900">DemoBoard</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              홈
            </Link>
            <Link href="/posts" className="text-gray-600 hover:text-gray-900 transition-colors">
              게시물
            </Link>
            <Link href="/posts/new" className="text-gray-600 hover:text-gray-900 transition-colors">
              카테고리
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="default" size="sm">
              글쓰기
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
