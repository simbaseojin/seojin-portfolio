# 포트폴리오 편집 가이드

이 사이트의 **모든 콘텐츠는 `content.json` 한 파일**에 들어 있습니다.
텍스트 수정, 프로젝트 추가, 케이스 확장은 전부 이 파일만 고치면 됩니다.
`index.html` / `styles.css` / `app.js` 는 디자인과 동작 코드라 평소엔 건드릴 필요 없습니다.

---

## 1. 파일 구조

```
seojin-portfolio/
  index.html      ← 뼈대 (수정 불필요)
  styles.css      ← 디자인 (색/폰트/레이아웃)
  app.js          ← content.json 을 읽어 화면을 그림 (수정 불필요)
  content.json    ← ★ 모든 콘텐츠. 여기만 고치면 됨
  EDITING.md      ← 이 문서
  assets/         ← 이미지 (히어로, 로고, 케이스 이미지)
```

## 2. 수정 방법 (택1)

- **직접 수정**: `content.json` 을 열어 값을 바꾸고 저장 → 재배포
- **AI에게 요청**: "content.json 의 OOO 프로젝트 제목을 XXX로 바꿔줘" 처럼 파일명과 위치를 지정
  - 어떤 AI(Claude, Gemini, GPT, Manus)든 이 파일 하나만 다루므로 결과가 동일하게 유지됩니다
  - 반드시 **JSON 문법**을 지킬 것: 문자열은 큰따옴표 `"`, 항목 사이 쉼표 `,`, 마지막 항목 뒤엔 쉼표 없음

## 3. 자주 하는 작업

### (A) 텍스트 한 줄 수정
해당 값을 찾아 큰따옴표 안 내용만 교체.

### (B) 경력 프로젝트 추가 (섹션 01 CAREER SYSTEM)
`careerSystem.capabilities[].projects` 배열에 아래 객체를 복사해 추가:
```json
{
  "date": "2025.01 — 2025.06",
  "company": "번개장터",
  "role": "역할 / 책임 범위",
  "title": "프로젝트 제목",
  "desc": "한 줄 설명",
  "whatIDid": ["한 일 1", "한 일 2"],
  "outcome": ["성과 1", "성과 2"],
  "tags": ["Tag1", "Tag2", "Tag3"]
}
```
- `outcome` 이 없으면 `"outcome": []` 로 두면 됨
- 회사별 보기는 `company` 값 기준으로 자동 그룹핑되므로 별도 작업 불필요

### (C) 대표 프로젝트/케이스 추가 (섹션 02 SELECTED PROJECTS) ← 포트폴리오 확장 지점
`selectedProjects.cases` 배열에 추가. 카드 + 클릭 시 상세 모달이 자동 생성됨:
```json
{
  "no": "05",
  "category": "카테고리 (영문 대문자)",
  "badge": "CONFIDENTIAL / CAREER CASE",
  "flow": "PROBLEM → DECISION → OUTCOME",
  "title": "케이스 제목",
  "desc": "카드에 보일 한 줄 설명",
  "period": "2025.01 — 2025.06",
  "role": "Silo Lead",
  "result": "핵심 성과 (예: 거래액 +30%)",
  "detail": {
    "sections": [
      { "no": "01", "title": "Background", "body": "배경 설명" },
      { "no": "02", "title": "My role", "body": "내 역할" },
      { "no": "03", "title": "Execution", "body": "실행 내용" },
      { "no": "04", "title": "Outcome", "body": "성과" }
    ],
    "note": "필요 시 하단 안내 문구 (없으면 빈 문자열)",
    "gallery": []
  }
}
```

### (D) 케이스에 이미지(스크린샷/도표) 추가
1. 이미지 파일을 `assets/` 폴더에 넣기 (예: `assets/case-safepay-1.png`)
2. 해당 케이스의 `detail.gallery` 배열에 추가:
```json
"gallery": [
  { "src": "assets/case-safepay-1.png", "caption": "안전결제 전환 플로우" },
  { "src": "assets/case-safepay-2.png", "caption": "판매자 수수료 화면" }
]
```
- 상세 모달 하단에 캡션과 함께 표시됨

## 4. 재배포

수정 후 아래 한 줄이면 반영됨 (터미널):
```bash
npx surge <이 폴더 경로> seojin-portfolio.surge.sh
```
또는 Claude에게 "포트폴리오 재배포해줘" 라고 요청.

## 5. 주의

- `content.json` 은 JSON 문법이 하나라도 틀리면 화면이 빈 채로 뜸.
  헷갈리면 수정 전 파일을 복사해 백업하거나, https://jsonlint.com 에서 검사
- 디자인(색/폰트/간격)을 바꾸려면 `styles.css` 상단의 `:root` 변수만 조정
- 섹션 순서나 새 섹션 추가 같은 구조 변경은 `app.js` / `index.html` 수정이 필요 → 이때만 개발/AI 도움 권장
