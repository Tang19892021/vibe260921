'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Plus, X } from 'lucide-react'

const categories = ['기술', '일상', '뉴스', '질문', '공지']

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('기술')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      setError('제목과 내용은 필수입니다.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          category,
          tags,
          author: '사용자', // 향후 인증 시스템 추가 시 실제 사용자로 변경
        }),
      })

      if (!response.ok) {
        throw new Error('게시물 작성에 실패했습니다.')
      }

      const data = await response.json()
      router.push(`/posts/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/posts">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            게시물 목록으로 돌아가기
          </Button>
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">새 게시물 작성</h1>
        <p className="text-gray-600">커뮤니티와 공유할 내용을 작성해주세요</p>
      </div>

      <Card className="border border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle>새 게시물 작성</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <Input
                placeholder="게시물의 제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리
              </label>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      category === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용
              </label>
              <Textarea
                placeholder="게시물의 내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-64"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                태그
              </label>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="태그를 입력하고 Enter를 누르세요"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTag}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  추가
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-2">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:opacity-70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {(title || content) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">미리보기</h3>
                <div className="text-sm">
                  <h4 className="font-semibold text-gray-900 mb-1">{title || '제목'}</h4>
                  <p className="text-gray-600">{content.substring(0, 100)}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? '작성 중...' : '게시물 작성'}
              </Button>
              <Link href="/posts" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  취소
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">작성 팁</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 명확하고 구체적인 제목을 작성하세요.</li>
            <li>• 마크다운 형식을 사용할 수 있습니다.</li>
            <li>• 관련된 태그를 추가하면 검색이 용이합니다.</li>
            <li>• 정중하고 존중하는 언어를 사용하세요.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
