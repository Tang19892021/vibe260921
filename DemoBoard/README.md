# DemoBoard - 게시판 웹사이트

Next.js 14, TypeScript, Tailwind CSS, shadcn/ui를 사용하여 만든 현대적인 게시판 웹사이트입니다.

## 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: shadcn/ui
- **아이콘**: Lucide React

## 프로젝트 구조

```
DemoBoard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── page.tsx            # 홈페이지
│   │   ├── posts/
│   │   │   ├── page.tsx        # 게시물 목록
│   │   │   ├── new/
│   │   │   │   └── page.tsx    # 새 게시물 작성
│   │   │   └── [id]/
│   │   │       └── page.tsx    # 게시물 상세 페이지
│   │   └── api/                # API 라우트
│   ├── components/
│   │   ├── ui/                 # shadcn/ui 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── badge.tsx
│   │   ├── Navbar.tsx          # 네비게이션 바
│   │   ├── PostCard.tsx        # 게시물 카드
│   │   ├── PostList.tsx        # 게시물 목록
│   │   └── Sidebar.tsx         # 사이드바
│   ├── lib/
│   │   ├── types.ts            # TypeScript 타입 정의
│   │   └── utils.ts            # 유틸리티 함수
│   └── styles/
│       └── globals.css         # 전역 스타일
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── postcss.config.js
```

## 주요 기능

### 1. 홈페이지
- 서비스 소개
- 최신 게시물 미리보기
- 특징 설명 (고속 성능, 상호작용, 커뮤니티)

### 2. 게시물 목록
- 모든 게시물 표시
- 검색 기능
- 카테고리 필터링
- 태그 필터링

### 3. 게시물 작성
- 제목 입력
- 내용 작성
- 카테고리 선택
- 태그 추가/삭제
- 미리보기

### 4. 게시물 상세 페이지
- 게시물 전체 내용 표시
- 댓글 기능
- 좋아요/공유 기능
- 작성자 정보
- 관련 글 추천

### 5. UI 컴포넌트
- Button: 여러 스타일 변형
- Card: 카드 레이아웃
- Input: 텍스트 입력
- Textarea: 다중 줄 텍스트 입력
- Badge: 태그/카테고리 표시

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 3. 프로덕션 빌드

```bash
npm run build
npm start
```

## 커스터마이징

### 색상 변경

`src/styles/globals.css`와 `tailwind.config.ts`에서 색상을 변경할 수 있습니다.

### 컴포넌트 추가

`src/components/ui/` 디렉토리에 새로운 shadcn/ui 컴포넌트를 추가할 수 있습니다.

### 데이터 연결

현재는 Mock 데이터를 사용하고 있습니다. 다음과 같이 백엔드와 연결할 수 있습니다:

1. API 라우트 생성 (`src/app/api/`)
2. React Query 또는 SWR로 데이터 페칭
3. 데이터베이스 연결 (Prisma, Supabase 등)

## TypeScript 타입

### Post 타입
```typescript
interface Post {
  id: string
  title: string
  content: string
  author: string
  createdAt: Date
  updatedAt: Date
  views: number
  category: string
  tags: string[]
}
```

### Comment 타입
```typescript
interface Comment {
  id: string
  postId: string
  author: string
  content: string
  createdAt: Date
  updatedAt: Date
}
```

### User 타입
```typescript
interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user'
}
```

## 라이선스

MIT

## 기여

이 프로젝트에 기여하고 싶다면 Pull Request를 보내주세요!

## 문의

문제가 있거나 제안사항이 있으시면 Issues를 등록해주세요.
