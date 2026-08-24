# AI 이름 궁합

Stitch 디자인 기반 한국어 모바일 퍼스트 Next.js 앱입니다. `.env.example`을 참고해 Supabase를 연결하세요. 실제 AI 해석에는 `AI_GATEWAY_API_KEY`가 필요하며, 키가 없으면 서버에서 일관된 데모 해석을 생성합니다.

관리자는 Supabase Auth 사용자의 `app_metadata.role`을 `admin`으로 설정해야 `/owner`에서 원본 제출 내역을 조회할 수 있습니다. 일반 사용자는 RLS 때문에 조회할 수 없습니다.
