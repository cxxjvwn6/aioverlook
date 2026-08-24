import { randomInt } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

export const runtime = 'nodejs';

const input = z.object({
  nameA: z.string().trim().min(1).max(20).regex(/^[\p{L}\p{M}\s'-]+$/u),
  nameB: z.string().trim().min(1).max(20).regex(/^[\p{L}\p{M}\s'-]+$/u),
  genderA: z.enum(['male', 'female', 'unspecified']),
  genderB: z.enum(['male', 'female', 'unspecified']),
});
const tarotCard = z.object({position:z.string(),name:z.string(),meaning:z.string()});
const output = z.object({
  overallCompatibility:z.number().min(0).max(100), closenessPotential:z.number().min(0).max(100),
  relationshipStability:z.number().min(0).max(100), conversationCompatibility:z.number().min(0).max(100),
  mutualAwareness:z.number().min(0).max(100), comfortPotential:z.number().min(0).max(100),
  awkwardnessRisk:z.number().min(0).max(100), misunderstandingRisk:z.number().min(0).max(100),
  communicationDropRisk:z.number().min(0).max(100), conflictRisk:z.number().min(0).max(100),
  distancingRisk:z.number().min(0).max(100), summary:z.string().min(30).max(800),
  tarotCards:z.array(tarotCard).length(3), positiveFactors:z.array(z.string()).min(3).max(4),
  cautionFactors:z.array(z.string()).min(3).max(4), relationshipAdvice:z.array(z.string()).min(3).max(4),
});

const deck = [
  ['바보','새로운 시작, 솔직한 호기심',72],['마법사','먼저 다가가는 힘, 강한 표현력',84],['여사제','말하지 않아도 느끼는 직감',78],
  ['여황제','다정함, 편안한 애정',90],['황제','안정감, 관계의 주도권',76],['교황','신뢰, 약속을 지키는 마음',82],
  ['연인','끌림, 중요한 선택',94],['전차','빠른 진전, 같은 목표',86],['힘','부드러운 인내, 감정 조절',88],
  ['은둔자','천천히 알아가는 시간',62],['운명의 수레바퀴','예상 밖의 만남과 변화',83],['정의','솔직한 대화, 균형',80],
  ['매달린 사람','기다림, 관점 바꾸기',60],['죽음','묵은 흐름의 끝과 새 출발',68],['절제','서로 다른 속도를 맞추는 힘',87],
  ['악마','강한 끌림, 집착을 조심할 필요',65],['탑','갑작스러운 감정 변화와 깨달음',55],['별','기대, 오래 남는 설렘',92],
  ['달','헷갈리는 신호, 깊은 감정',64],['태양','함께 있을 때 커지는 밝은 에너지',96],['심판','다시 이어지는 대화, 중요한 결론',81],
  ['세계','잘 맞물리는 흐름, 완성감',95],
] as const;
const positions = ['지금 두 사람의 흐름','서로 끌리는 이유','앞으로의 방향'];
function drawTarot(){const pool=[...deck];return positions.map(position=>{const [name,meaning,energy]=pool.splice(randomInt(pool.length),1)[0];return {position,name,meaning,energy}})}
function pick<T>(items:T[],count=3){const pool=[...items],picked:T[]=[];while(picked.length<count&&pool.length)picked.push(pool.splice(randomInt(pool.length),1)[0]);return picked}
const positives=['같이 있으면 평소보다 말이 자연스럽게 이어져요','서로 다른 점이 오히려 신선한 매력으로 느껴져요','한쪽이 지칠 때 다른 한쪽이 분위기를 풀어 줘요','작은 공통점을 빠르게 찾아 친해지기 쉬워요','장난과 진지한 대화 사이의 균형이 좋아요','서로의 반응을 은근히 많이 신경 쓰는 조합이에요','오랜만에 만나도 어색함이 금방 풀릴 가능성이 커요'];
const cautions=['답장이 늦을 때 혼자 의미를 크게 만들지 않는 게 좋아요','장난이 세지면 한쪽은 생각보다 오래 마음에 담아둘 수 있어요','서로 눈치를 보다 중요한 말을 미룰 수 있어요','친해지는 속도가 다르면 한쪽이 부담을 느낄 수 있어요','질투가 생겨도 떠보기보다 바로 묻는 편이 좋아요','기분이 상했을 때 갑자기 연락을 줄이는 행동은 피하는 게 좋아요','주변 친구들의 말에 관계가 흔들리지 않게 조심해요'];
const advices=['오늘 있었던 사소한 일을 먼저 공유해 보세요','좋아하는 노래나 영상을 하나씩 주고받아 보세요','애매한 표현 대신 보고 싶다거나 서운했다고 짧게 말해 보세요','둘만 알아듣는 작은 농담을 만들어 보세요','짧게라도 다음에 만날 약속을 구체적으로 잡아 보세요','상대가 잘한 일을 발견하면 바로 말해 주세요','대화가 끊겼을 때 기다리기만 하지 말고 가벼운 질문을 보내 보세요'];
function fallback(a:string,b:string,tarot:ReturnType<typeof drawTarot>){const avg=Math.round(tarot.reduce((sum,c)=>sum+c.energy,0)/3),n=(low:number,high:number)=>randomInt(low,high+1),overall=Math.max(52,Math.min(96,Math.round(avg*.72+n(18,29))));const cards=tarot.map(({position,name,meaning})=>({position,name,meaning}));return {overallCompatibility:overall,closenessPotential:n(55,96),relationshipStability:n(50,94),conversationCompatibility:n(52,97),mutualAwareness:n(50,96),comfortPotential:n(54,97),awkwardnessRisk:n(10,58),misunderstandingRisk:n(14,62),communicationDropRisk:n(10,56),conflictRisk:n(8,52),distancingRisk:n(8,50),tarotCards:cards,summary:`${a}님과 ${b}님의 첫 카드인 ‘${cards[0].name}’는 지금 두 사람 사이에 ${cards[0].meaning}의 기운이 흐른다고 말해요. 두 번째 ‘${cards[1].name}’는 서로가 ${cards[1].meaning} 때문에 자꾸 신경 쓰일 수 있다는 뜻이에요. 마지막 ‘${cards[2].name}’를 보면 앞으로는 ${cards[2].meaning}이 관계의 중요한 열쇠가 될 가능성이 커요. 이미 가까운 사이라면 숨겨 둔 말을 꺼낼 타이밍이고, 아직 어색하다면 사소한 대화 하나가 분위기를 바꿀 수 있어요.`,positiveFactors:pick(positives),cautionFactors:pick(cautions),relationshipAdvice:pick(advices)} }

async function activity(names:string[]=[]){const url=process.env.NEXT_PUBLIC_SUPABASE_URL,pub=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;if(!url||!pub)return {runCount:78,popularNames:[] as string[]};const db=createClient(url,pub,{auth:{persistSession:false}}),{data,error}=await db.rpc('get_activity_snapshot',{input_names:names.slice(0,2)});if(error){console.error('activity',error.code);return {runCount:78,popularNames:[] as string[]}}const row=Array.isArray(data)?data[0]:null;return {runCount:Number(row?.run_count)||78,popularNames:Array.isArray(row?.popular_names)?row.popular_names:[] as string[]}}
export async function GET(){return NextResponse.json({activity:await activity()})}
export async function POST(req:Request){try{const v=input.parse(await req.json()),tarot=drawTarot();let result:unknown;const aiKey=process.env.AI_GATEWAY_API_KEY;if(aiKey){const res=await fetch('https://ai-gateway.vercel.sh/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${aiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.AI_MODEL||'openai/gpt-5-mini',response_format:{type:'json_object'},temperature:.95,messages:[{role:'system',content:'라이더 웨이트 타로의 전통적인 메이저 아르카나 의미를 바탕으로, 한국어로 흥미롭고 구체적인 두 사람의 관계 이야기를 쓴다. 어려운 말과 뻔한 반복을 피하고, 카드 세 장을 현재 흐름·끌리는 이유·앞으로의 방향 순서로 연결한다. 과학적 사실처럼 단정하지 않는다. 요청 스키마와 같은 JSON만 반환한다.'},{role:'user',content:JSON.stringify({...v,drawnTarot:tarot})}]})});if(!res.ok)throw new Error('AI 요청 실패');const d=await res.json();result=JSON.parse(d.choices?.[0]?.message?.content||'{}')}else result=fallback(v.nameA,v.nameB,tarot);const parsed=output.parse(result);const url=process.env.NEXT_PUBLIC_SUPABASE_URL,pub=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;if(url&&pub){const db=createClient(url,pub,{auth:{persistSession:false}});const {error}=await db.from('analysis_submissions').insert({name_a:v.nameA,gender_a:v.genderA,name_b:v.nameB,gender_b:v.genderB,overall_score:parsed.overallCompatibility,analysis_result:parsed});if(error)console.error('storage',error.code)}return NextResponse.json({result:parsed,activity:await activity([v.nameA,v.nameB]),engine:aiKey?'ai':'tarot'});}catch(e){console.error(e);return NextResponse.json({error:'분석을 완료하지 못했어요. 이름을 확인하고 잠시 후 다시 시도해 주세요.'},{status:400})}}
