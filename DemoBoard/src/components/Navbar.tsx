'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900">DemoBoard</span>
              <p className="text-xs text-gray-500">Community Board</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`transition-colors font-medium ${
                isActive('/')
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-2'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🏠 홈
            </Link>
            <Link
              href="/posts"
              className={`transition-colors font-medium ${
                isActive('/posts')
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-2'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📝 게시물
            </Link>
          </div>

          {/* Desktop Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/posts/new">
              <Button className="gap-2">
                <span>✍️</span> 글쓰기
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link href="/posts/new">
              <Button size="sm" className="gap-2">
                ✍️
              </Button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
              onClick={() => setIsOpen(false)}
            >
              🏠 홈
            </Link>
            <Link
              href="/posts"
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
              onClick={() => setIsOpen(false)}
            >
              📝 게시물
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
