/**
 * 참조 탐지 + 위임 역인덱스 — 이 앱의 핵심 가치.
 *
 * 통찰 2: "대통령령으로 정한다"는 시행령 조문 번호를 알려주지 않는다.
 * 그래서 (1) 본문에서 참조 토큰을 탐지하고,
 *        (2) 시행령/시행규칙을 역으로 인덱싱해 모법 조문 ↔ 하위법령 조문을 잇는다.
 */

import type {
  ArticleNode,
  LawDocument,
  Reference,
  ReferenceKind,
} from "@/types/law";

/** 참조 종류별 탐지 정규식 (초안 — Phase 2에서 정교화) */
const PATTERNS: Array<{ kind: ReferenceKind; re: RegExp }> = [
  // 위임: 대통령령/총리령/○○부령으로 정한다·정하는
  { kind: "delegation", re: /(대통령령|총리령|[가-힣]+부령)으로\s*정(한다|하는)/g },
  // 타법참조: 「○○법」 제○조  (내부참조보다 먼저 매칭되어야 함)
  { kind: "external", re: /「[^」]+」\s*제\s*\d+\s*조(?:의\s*\d+)?/g },
  // 별표·서식
  { kind: "appendix", re: /별(표|지)\s*제?\s*\d+\s*호(?:서식)?/g },
  // 내부참조: 제○조(의○) / 제○항 / 제○호
  { kind: "internal", re: /제\s*\d+\s*(조(?:의\s*\d+)?|항|호|목)/g },
];

/**
 * 한 텍스트 조각에서 참조들을 탐지해 위치(span)와 함께 반환.
 * 타깃 해석(resolve)은 하지 않는다 — 탐지만.
 */
export function detectReferences(text: string): Reference[] {
  const found: Reference[] = [];
  for (const { kind, re } of PATTERNS) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      found.push({
        kind,
        rawText: m[0],
        span: [m.index, m.index + m[0].length],
      });
    }
  }
  // TODO: 겹치는 매치 정리 (external 안의 "제○조"가 internal로 중복 탐지되는 것 제거)
  return found.sort((a, b) => a.span[0] - b.span[0]);
}

/**
 * 위임 역인덱스: 하위법령(시행령/시행규칙)의 각 조문이 모법 몇 조를 인용하는지 매핑.
 * 시행령 본문의 "법 제15조제2항", "법 제15조" 같은 역참조를 파싱한다.
 *
 * 반환: Map<모법조키, 그 모법조를 인용하는 하위법령 조문들>
 *   모법조키 형식: "15" 또는 "15-2"(가지조)
 */
export function buildDelegationIndex(
  subordinateLaws: LawDocument[],
): Map<string, ArticleNode[]> {
  const index = new Map<string, ArticleNode[]>();
  const backRef = /법\s*제\s*(\d+)\s*조(?:의\s*(\d+))?/g;

  for (const law of subordinateLaws) {
    for (const article of law.articles) {
      const blob = articleToText(article);
      backRef.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = backRef.exec(blob)) !== null) {
        const key = m[2] ? `${m[1]}-${m[2]}` : m[1];
        const bucket = index.get(key) ?? [];
        if (!bucket.includes(article)) bucket.push(article);
        index.set(key, bucket);
      }
    }
  }
  return index;
}

/** 모법 조문에 대한 위임 키 ("15" / "15-2") */
export function delegationKey(article: ArticleNode): string {
  return article.branch ? `${article.no}-${article.branch}` : `${article.no}`;
}

/** 조문 트리를 평탄한 텍스트로 (역참조 스캔용) */
function articleToText(article: ArticleNode): string {
  const parts: string[] = [article.title ?? ""];
  const walk = (nodes: { text: string; children: unknown[] }[]) => {
    for (const n of nodes) {
      parts.push(n.text);
      walk(n.children as never);
    }
  };
  walk(article.content as never);
  return parts.join("\n");
}
