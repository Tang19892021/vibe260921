'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const categories = [
  { name: '전체', emoji: '📂', count: 12 },
  { name: '기술', emoji: '🔧', count: 5 },
  { name: '일상', emoji: '📝', count: 4 },
  { name: '뉴스', emoji: '📰', count: 3 },
  { name: '질문', emoji: '❓', count: 2 },
  { name: '공지', emoji: '📢', count: 1 },
]

export function Sidebar() {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            📂 카테고리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/posts?category=${category.name}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-100 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <span className="text-gray-700 font-medium">
                  {category.emoji} {category.name}
                </span>
                <span className="text-xs text-white bg-blue-600 px-2 py-1 rounded-full font-semibold">
                  {category.count}
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            🏆 인기 태그
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['React', 'Next.js', 'TypeScript', 'Tailwind', 'Web', 'JavaScript', 'Design'].map((tag) => (
              <Link
                key={tag}
                href={`/posts?tag=${tag}`}
                className="text-xs bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 px-3 py-2 rounded-full hover:from-purple-200 hover:to-purple-100 transition-all duration-200 font-semibold border border-purple-200"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-white">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            ✨ 팁
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2">
              <span>💡</span>
              <span>제목을 구체적으로 작성하세요</span>
            </li>
            <li className="flex gap-2">
              <span>📌</span>
              <span>관련 태그를 추가하세요</span>
            </li>
            <li className="flex gap-2">
              <span>🤝</span>
              <span>다른 사람의 글에 댓글을 남기세요</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
