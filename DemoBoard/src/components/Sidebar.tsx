'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const categories = [
  { name: '전체', count: 12 },
  { name: '기술', count: 5 },
  { name: '일상', count: 4 },
  { name: '뉴스', count: 3 },
]

export function Sidebar() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">카테고리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/posts?category=${category.name}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-700">{category.name}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {category.count}
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">인기 태그</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['React', 'Next.js', 'TypeScript', 'Tailwind', 'Web'].map((tag) => (
              <Link
                key={tag}
                href={`/posts?tag=${tag}`}
                className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
