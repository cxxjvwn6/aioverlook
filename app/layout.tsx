import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'AI 이름 궁합', description: '두 이름 사이의 관계 흐름을 AI로 재미있게 살펴보세요.' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="ko"><body>{children}</body></html>; }
