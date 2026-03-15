# Peter's Archive - AI 협업 가이드

이 문서는 AI 어시스턴트가 Peter's Archive 블로그를 관리하고 컨텐츠를 작성할 때 참고해야 할 모든 정보를 담고 있습니다.

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [파일 구조](#파일-구조)
4. [컨텐츠 작성 규칙](#컨텐츠-작성-규칙)
5. [카테고리 관리](#카테고리-관리)
6. [글 작성 가이드](#글-작성-가이드)
7. [배포 가이드](#배포-가이드)
8. [자주 하는 작업](#자주-하는-작업)

---

## 프로젝트 개요

### 기본 정보
- **프로젝트명**: Peter's Archive
- **목적**: PARA 방법론과 제텔카스텐을 결합한 개인 지식 아카이브
- **URL**: https://hoonick12.github.io/peters-archive/
- **로컬 개발**: http://localhost:3000/peters-archive/

### PARA 방법론이란?
PARA는 정보를 4가지 카테고리로 분류하는 방법론입니다:
- **P**rojects (프로젝트): 시작과 끝이 명확한 단기 작업
- **A**reas (영역): 지속적으로 관리하는 관심 분야
- **R**esources (자료): 나중에 참고할 유용한 정보
- **A**rchives (보관소): 완료되거나 비활성화된 내용

### 제텔카스텐이란?
- 하나의 노트 = 하나의 아이디어
- 노트 간 연결을 통한 지식 네트워크 구축
- Notes 섹션에서 사용

---

## 기술 스택

### 프레임워크 및 라이브러리
```json
{
  "framework": "Next.js 16.1.6",
  "router": "App Router (Pages Router 아님!)",
  "theme": "Nextra 4.6.1 (nextra-theme-docs)",
  "react": "19.2.4",
  "output": "static export (GitHub Pages용)"
}
```

### 중요한 설정
- **basePath**: `/peters-archive` (GitHub Pages 서브디렉토리)
- **output**: `export` (정적 사이트 생성)
- **ES Modules**: `.mjs` 확장자 사용 (CommonJS 아님!)

---

## 파일 구조

### 디렉토리 구조
```
peters-archive/
├── app/                          # Next.js App Router 루트
│   ├── layout.jsx               # 전역 레이아웃 (Nextra 테마)
│   ├── page.mdx                 # 홈페이지
│   ├── _meta.js                 # 최상위 네비게이션 설정
│   │
│   ├── about/                   # About 페이지
│   │   └── page.mdx
│   │
│   ├── projects/                # 🚀 Projects (PARA - P)
│   │   ├── _meta.js
│   │   ├── active/              # 진행 중인 프로젝트
│   │   │   └── page.mdx
│   │   └── completed/           # 완료된 프로젝트
│   │       └── page.mdx
│   │
│   ├── areas/                   # 📊 Areas (PARA - A)
│   │   ├── _meta.js
│   │   ├── ai/                  # AI 관련
│   │   │   ├── _meta.js
│   │   │   └── claude-code/
│   │   │       ├── _meta.js
│   │   │       ├── page.mdx
│   │   │       └── 2026-features/
│   │   │           └── page.mdx
│   │   ├── development/         # 개발
│   │   │   └── page.mdx
│   │   ├── investment/          # 투자
│   │   │   └── page.mdx
│   │   └── learning/            # 학습
│   │       └── page.mdx
│   │
│   ├── resources/               # 📚 Resources (PARA - R)
│   │   └── page.mdx
│   │
│   ├── archives/                # 🗄️ Archives (PARA - A)
│   │   ├── _meta.js
│   │   ├── page.mdx
│   │   └── issues/              # 이슈 아카이브
│   │       ├── _meta.js
│   │       └── 2026/
│   │           ├── _meta.js
│   │           └── us-iran/
│   │               ├── _meta.js
│   │               ├── page.mdx (개요)
│   │               ├── 2026-03-15/
│   │               │   └── page.mdx
│   │               ├── 2026-03-14/
│   │               │   └── page.mdx
│   │               └── 2026-03-01/
│   │                   └── page.mdx
│   │
│   └── notes/                   # 💡 Notes (제텔카스텐)
│       └── page.mdx
│
├── public/
│   └── .nojekyll               # GitHub Pages에서 Jekyll 비활성화
│
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions 배포 설정
│
├── next.config.mjs             # Next.js 설정 (ES Modules!)
├── mdx-components.js           # MDX 컴포넌트 설정
├── package.json
└── CONTEXT.md                  # 이 문서
```

### 파일 명명 규칙

**중요**: Nextra 4.x App Router에서는 모든 페이지가 `폴더명/page.mdx` 형식이어야 합니다!

❌ 잘못된 예:
```
areas/ai/claude-code.mdx         # 작동하지 않음!
```

✅ 올바른 예:
```
areas/ai/claude-code/page.mdx    # 정상 작동
```

---

## 컨텐츠 작성 규칙

### 1. 파일 형식
- 모든 컨텐츠는 **MDX** 형식 (`.mdx` 확장자)
- Markdown + JSX 컴포넌트 사용 가능
- 파일명은 반드시 `page.mdx`

### 2. 프론트매터 사용 안 함
Nextra 4.x에서는 프론트매터를 사용하지 않습니다. 제목은 `_meta.js`에서 설정합니다.

❌ 사용하지 마세요:
```mdx
---
title: My Page
---
# My Page
```

✅ 올바른 방법:
```mdx
# My Page

내용 시작...
```

제목은 `_meta.js`에서 설정:
```javascript
export default {
  'my-page': 'My Page Title'
}
```

### 3. 제목 규칙
- H1 (`#`)은 페이지당 1개만
- H2 (`##`)부터 섹션 구분
- 이모지는 최상위 카테고리에만 사용

### 4. 링크 작성
```mdx
# 내부 링크 (basePath 자동 적용됨)
[프로젝트로 이동](/projects)
[AI 카테고리](/areas/ai)

# 외부 링크
[Nextra 공식 문서](https://nextra.site)
```

### 5. 이미지 사용
```mdx
# Public 폴더의 이미지
![설명](/images/example.png)

# 외부 이미지
![설명](https://example.com/image.png)
```

---

## 카테고리 관리

### _meta.js 파일의 역할
`_meta.js` 파일은 해당 폴더의 사이드바 순서와 제목을 제어합니다.

### 기본 구조
```javascript
export default {
  'folder-name': 'Display Title',
  'another-folder': 'Another Title'
}
```

### 현재 최상위 카테고리 (_meta.js)
```javascript
export default {
  about: '📖 About',
  projects: '🚀 Projects',
  areas: '📊 Areas',
  resources: '📚 Resources',
  archives: '🗄️ Archives',
  notes: '💡 Notes'
}
```

### 하위 카테고리 예시 (areas/_meta.js)
```javascript
export default {
  ai: 'AI',
  development: '개발',
  investment: '투자',
  learning: '학습'
}
```

### 중요: page.mdx는 표시하지 않음
폴더에 `page.mdx`가 있고 하위 항목도 있는 경우, `_meta.js`에 page를 명시하지 마세요. 자동으로 상위 메뉴 역할을 합니다.

❌ 잘못된 예:
```javascript
export default {
  page: 'Claude Code',  // 중복 표시됨!
  '2026-features': '2026년 신기능'
}
```

✅ 올바른 예:
```javascript
export default {
  '2026-features': '2026년 신기능'
}
```

---

## 글 작성 가이드

### Areas에 새 카테고리 추가하기

**시나리오**: Areas 아래에 "디자인" 카테고리 추가

1. **폴더 생성**
```bash
mkdir -p app/areas/design
```

2. **_meta.js 업데이트**
```javascript
// app/areas/_meta.js
export default {
  ai: 'AI',
  development: '개발',
  design: '디자인',        // 추가!
  investment: '투자',
  learning: '학습'
}
```

3. **페이지 작성**
```bash
# app/areas/design/page.mdx 생성
```

```mdx
# 디자인

**UI/UX 디자인과 그래픽 디자인**

---

## 관심 분야

### UI/UX 디자인
- 사용자 경험 설계
- 프로토타이핑
- 디자인 시스템

### 그래픽 디자인
- 브랜딩
- 타이포그래피
- 컬러 이론

---

## 학습 목표

- [ ] Figma 마스터하기
- [ ] 디자인 시스템 구축
```

### Archives에 날짜별 글 추가하기

**시나리오**: 미국-이란 이슈에 3월 16일 글 추가

1. **폴더 생성**
```bash
mkdir -p app/archives/issues/2026/us-iran/2026-03-16
```

2. **_meta.js 업데이트**
```javascript
// app/archives/issues/2026/us-iran/_meta.js
export default {
  '2026-03-16': '2026.03.16 - 새로운 뉴스',  // 최상단에 추가
  '2026-03-15': '2026.03.15 - 휴전 협상 임박',
  '2026-03-14': '2026.03.14 - 하르그섬 공습',
  '2026-03-01': '2026.03.01 - 이란 고위 관료 사망'
}
```

3. **페이지 작성**
```bash
# app/archives/issues/2026/us-iran/2026-03-16/page.mdx
```

```mdx
# 2026.03.16 - 새로운 뉴스 제목

**요약 한 줄**

---

## 주요 내용

내용 작성...

---

## 출처

- [링크](https://example.com)
```

### Notes에 제텔카스텐 노트 추가하기

**시나리오**: PARA 방법론에 대한 노트 추가

1. **폴더 생성**
```bash
mkdir -p app/notes/para-methodology
```

2. **_meta.js 생성/업데이트**
```javascript
// app/notes/_meta.js (없으면 생성)
export default {
  'para-methodology': 'PARA 방법론'
}
```

3. **페이지 작성**
```bash
# app/notes/para-methodology/page.mdx
```

```mdx
# PARA 방법론

**정보를 4가지 카테고리로 분류하는 생산성 시스템**

---

## 핵심 개념

PARA는 Tiago Forte가 만든 정보 분류 시스템입니다.

### 4가지 카테고리

1. **Projects**: 목표가 있는 단기 작업
2. **Areas**: 지속적으로 관리하는 영역
3. **Resources**: 참고 자료
4. **Archives**: 비활성화된 내용

---

## 연결된 노트

- [[GTD 방법론]]
- [[제텔카스텐]]
- [[개인 지식 관리]]

---

## 참고 자료

- [Building a Second Brain](https://www.buildingasecondbrain.com)
```

---

## 배포 가이드

### 로컬 개발 서버 실행
```bash
cd ~/Desktop/peters-archive
npm run dev
```
- URL: http://localhost:3000/peters-archive/

### GitHub에 푸시하기
```bash
cd ~/Desktop/peters-archive

# 변경사항 확인
git status

# 모든 변경사항 추가
git add .

# 커밋 (의미있는 메시지 작성)
git commit -m "Add new article about XXX"

# GitHub에 푸시
git push
```

### 자동 배포
- `main` 브랜치에 푸시하면 GitHub Actions가 자동으로 빌드 및 배포
- 약 1-2분 후 https://hoonick12.github.io/peters-archive/ 에서 확인 가능

### 배포 상태 확인
- https://github.com/hoonick12/peters-archive/actions

---

## 자주 하는 작업

### 1. 새 글 작성하기

**질문**: "Areas의 AI 카테고리에 ChatGPT에 대한 글을 추가해줘"

**단계**:
```bash
# 1. 폴더 생성
mkdir -p app/areas/ai/chatgpt

# 2. _meta.js 업데이트
# app/areas/ai/_meta.js 파일 수정
export default {
  'claude-code': 'Claude Code',
  'chatgpt': 'ChatGPT'  // 추가
}

# 3. 페이지 작성
# app/areas/ai/chatgpt/page.mdx 생성
```

### 2. 카테고리 순서 변경하기

**질문**: "Areas에서 AI를 맨 위로 올려줘"

**단계**:
```javascript
// app/areas/_meta.js 수정
export default {
  ai: 'AI',           // 맨 위로 이동
  development: '개발',
  investment: '투자',
  learning: '학습'
}
```

### 3. 글 제목 변경하기

**질문**: "Claude Code 제목을 'Claude 코딩 도구'로 변경해줘"

**단계**:
```javascript
// app/areas/ai/_meta.js 수정
export default {
  'claude-code': 'Claude 코딩 도구'  // 제목만 변경
}
```

### 4. 이모지 추가/제거하기

**규칙**: 최상위 카테고리에만 이모지 사용

```javascript
// ✅ 좋은 예 (최상위)
export default {
  about: '📖 About',
  projects: '🚀 Projects'
}

// ❌ 나쁜 예 (하위 카테고리)
export default {
  ai: '🤖 AI',              // 이모지 제거
  development: '💻 개발'     // 이모지 제거
}

// ✅ 올바른 예 (하위 카테고리)
export default {
  ai: 'AI',
  development: '개발'
}
```

### 5. 컨텐츠에 날짜 표시하기

```mdx
# 글 제목

**2026년 3월 15일**

내용 시작...
```

또는 상세하게:

```mdx
# 글 제목

**작성일**: 2026년 3월 15일
**수정일**: 2026년 3월 16일

---

내용 시작...
```

---

## 에러 해결 가이드

### 에러 1: "Cannot find module"
```
Error: Cannot find module 'next-mdx-import-source-file'
```

**원인**: MDX 설정 문제
**해결**:
```bash
rm -rf .next
npm run dev
```

### 에러 2: "Validation of _meta file has failed"
```
The field key "page" in `_meta` file refers to a page that cannot be found
```

**원인**: `_meta.js`에 존재하지 않는 페이지 참조
**해결**: `_meta.js`에서 해당 키 제거 또는 실제 페이지 생성

### 에러 3: "require(...) is not a function"
```
TypeError: require(...) is not a function
```

**원인**: CommonJS 사용 (Nextra 4.x는 ES Modules 필요)
**해결**: `next.config.js` → `next.config.mjs`로 변경, `export default` 사용

### 에러 4: 사이드바에 중복 표시
```
🚀 Projects
🚀 Projects
  진행 중
```

**원인**: `page.mdx`가 자동으로 표시됨
**해결**: 하위 폴더가 있는 경우 `_meta.js`에 명시하지 않기

---

## 스타일 가이드

### 한글 작성 규칙
- 존댓말 사용 ("~합니다", "~입니다")
- 기술 용어는 영어 그대로 (예: React, Next.js, API)
- 약어는 풀어서 설명 (예: PARA = Projects, Areas, Resources, Archives)

### 코드 블록
````mdx
```javascript
// 언어 지정 필수
const example = 'code';
```
````

### 강조 표시
```mdx
**굵게**: 중요한 내용
*기울임*: 강조
`코드`: 인라인 코드
```

### 목록 작성
```mdx
# 순서 있는 목록
1. 첫 번째
2. 두 번째

# 순서 없는 목록
- 항목 1
- 항목 2
  - 하위 항목

# 체크리스트
- [ ] 할 일
- [x] 완료
```

---

## 자주 묻는 질문

### Q: 새 카테고리를 만들 때 어떤 위치에 넣어야 하나요?
A: PARA 방법론에 따라:
- 시작과 끝이 있는 작업 → Projects
- 지속적으로 관리하는 분야 → Areas
- 참고 자료 → Resources
- 완료된 내용 → Archives
- 아이디어 노트 → Notes

### Q: 이미지는 어디에 저장하나요?
A: `public/images/` 폴더에 저장하고 `/images/파일명.png`로 참조

### Q: 한 글에 여러 날짜의 업데이트를 추가하려면?
A:
1. 날짜별 폴더로 분리 (권장)
2. 또는 하나의 페이지에 섹션으로 구분

### Q: 글을 삭제하려면?
A:
```bash
# 1. 폴더 삭제
rm -rf app/areas/category/article

# 2. _meta.js에서 항목 제거
# app/areas/category/_meta.js 수정

# 3. Git 커밋 및 푸시
git add .
git commit -m "Remove article about XXX"
git push
```

### Q: 글을 다른 카테고리로 이동하려면?
A:
```bash
# 1. 폴더 이동
mv app/areas/old/article app/areas/new/article

# 2. 두 _meta.js 파일 모두 업데이트

# 3. 내부 링크 확인 및 수정
```

---

## 체크리스트

### 새 글 작성 시
- [ ] 올바른 위치에 폴더 생성 (`폴더명/page.mdx`)
- [ ] `_meta.js` 업데이트
- [ ] H1 제목 1개만 사용
- [ ] 섹션 구분 명확하게 (H2, H3 사용)
- [ ] 외부 링크는 출처 명시
- [ ] 로컬에서 확인 (`npm run dev`)
- [ ] Git 커밋 및 푸시
- [ ] GitHub Pages 배포 확인

### 카테고리 관리 시
- [ ] `_meta.js` 파일 위치 확인
- [ ] 순서 논리적으로 배치
- [ ] 최상위 카테고리에만 이모지 사용
- [ ] 하위 카테고리는 이모지 제거
- [ ] 중복 표시 확인

---

## 마지막 팁

1. **항상 로컬에서 먼저 테스트**: `npm run dev`로 확인 후 푸시
2. **작은 단위로 커밋**: 한 번에 하나의 작업만
3. **의미있는 커밋 메시지**: "Add article about ChatGPT features"
4. **PARA 원칙 준수**: 각 카테고리의 목적에 맞게 분류
5. **제텔카스텐 원칙**: Notes는 하나의 아이디어만
6. **일관성 유지**: 기존 글의 형식 참고

---

## 버전 정보

- **문서 버전**: 1.0
- **최종 수정일**: 2026년 3월 15일
- **Next.js**: 16.1.6
- **Nextra**: 4.6.1
- **React**: 19.2.4

---

이 문서는 AI 어시스턴트가 블로그를 효과적으로 관리할 수 있도록 작성되었습니다. 질문이 있거나 불확실한 부분이 있다면 이 문서를 다시 참고하세요.
