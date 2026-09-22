-- Seed posts data
INSERT INTO posts (title, content, author, category, tags, views, created_at, updated_at) VALUES
(
  'Next.js 14 소개: App Router와 새로운 기능들',
  'Next.js 14에서는 App Router가 더욱 안정화되었고, 서버 컴포넌트가 기본이 되었습니다.

## 주요 변경 사항

### 1. App Router의 안정화
App Router는 이제 완전히 안정화되어 프로덕션 환경에서 안전하게 사용할 수 있습니다.

### 2. 서버 컴포넌트의 기본화
모든 컴포넌트가 기본적으로 서버 컴포넌트가 되어 성능을 크게 향상시킬 수 있습니다.

### 3. Streaming과 Suspense
더 나은 UX를 위해 Streaming과 Suspense를 활용할 수 있습니다.',
  '김개발',
  '기술',
  ARRAY['Next.js', 'React', 'Web'],
  123,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
),
(
  'TypeScript 5.0의 새로운 기능',
  'TypeScript 5.0에서는 Decorators, const type parameters 등 새로운 기능이 추가되었습니다. 이를 통해 더욱 강력한 타입 시스템을 구축할 수 있습니다.',
  '박개발',
  '기술',
  ARRAY['TypeScript', 'JavaScript'],
  89,
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
),
(
  'Tailwind CSS로 빠르게 UI 만들기',
  'Tailwind CSS는 유틸리티 우선 CSS 프레임워크로, 빠르고 효율적인 디자인을 가능하게 합니다. 클래스 기반의 접근으로 개발 속도를 크게 향상시킬 수 있습니다.',
  '이디자인',
  '기술',
  ARRAY['Tailwind', 'CSS', 'Design'],
  156,
  NOW() - INTERVAL '4 days',
  NOW() - INTERVAL '4 days'
),
(
  'React Hooks 완벽 가이드',
  'React Hooks를 사용하여 함수형 컴포넌트에서 상태 관리와 생명주기를 다루는 방법을 배워봅시다. useState, useEffect, useContext 등의 Hook을 마스터하세요.',
  '김개발',
  '기술',
  ARRAY['React', 'Hooks', 'JavaScript'],
  312,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
);

-- Seed comments data
INSERT INTO comments (post_id, author, content, created_at, updated_at)
SELECT id, '박개발', '정말 좋은 글입니다! 많이 배워갑니다.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
FROM posts WHERE title = 'Next.js 14 소개: App Router와 새로운 기능들'
LIMIT 1;

INSERT INTO comments (post_id, author, content, created_at, updated_at)
SELECT id, '이디자인', 'App Router를 사용해보니 정말 편하네요.', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours'
FROM posts WHERE title = 'Next.js 14 소개: App Router와 새로운 기능들'
LIMIT 1;
