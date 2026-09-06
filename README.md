# 이서진 Product Leader 포트폴리오

빌드 도구 없는 정적 사이트. 모든 콘텐츠는 [`content.json`](content.json) 한 파일에 있습니다.

## 페이지
| 파일 | 내용 |
|---|---|
| `index.html` | Home — Hero / Journey / Principles |
| `work.html` | Selected Work 인덱스 |
| `case-01~04.html` | 케이스 상세 (지표 행 + 번호 아코디언) |
| `about.html` | About / Career / Education |

## 구조
- `styles.css` — 디자인. 색·간격은 상단 `:root` 변수만 조정
- `app.js` — 콘텐츠 렌더링, 이미지 원본 링크, 아코디언 접근성
- `content.json` — ★ 모든 콘텐츠
- `assets/screens/` — 실제 서비스 화면. 원본 파일명과 이미지를 유지합니다.
- `assets/case-*/` — 기존 기획 문서 슬라이드. 문제 분석·상품정보 설계·안전결제 기능 맵을 선택적으로 사용합니다.

## 케이스 페이지 옵션
`?open=all` — 아코디언 전체 펼침 (검토·인쇄용). 예: `case-01.html?open=all`

## 배포
배포 대상은 GitHub Pages입니다. 현재 폴더에는 Git 저장소 설정이 없으며, 이번 수정은 아직 업로드하지 않았습니다. 저장소와 Pages 설정을 확인한 후 배포해야 합니다.
https://simbaseojin.github.io/seojin-portfolio/

## 로컬 확인
```bash
python3 -m http.server 8000
```
`file://` 로 열면 content.json 을 못 읽습니다.
