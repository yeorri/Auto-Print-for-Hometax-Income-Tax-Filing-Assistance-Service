/**
 * 원시 API 응답(JSON/XML) → 조문 트리(ArticleNode[]) 변환.
 *
 * 국가법령정보 API는 조문을 조문단위로 내려주지만, 항/호/목은 한 덩어리
 * 텍스트 안에 마커(①②, 1., 가.)로 섞여 오는 경우가 많아 추가 파싱이 필요하다.
 */

import type { ArticleNode, ContentNode } from "@/types/law";

/** 조 라벨 파싱. "제15조의2" → { no: 15, branch: 2 } */
export function parseArticleLabel(label: string): {
  no: number;
  branch?: number;
} {
  const m = label.match(/제\s*(\d+)\s*조(?:의\s*(\d+))?/);
  if (!m) return { no: NaN };
  return { no: Number(m[1]), branch: m[2] ? Number(m[2]) : undefined };
}

/**
 * 항/호/목 마커가 섞인 본문 텍스트를 ContentNode 트리로 분해.
 * 마커: 항 = ①②③… , 호 = 1. 2. 3. , 목 = 가. 나. 다.
 */
export function parseContent(_rawText: string): ContentNode[] {
  // TODO (Phase 1): 마커 기반 분해.
  //  - ①~⑮ (원문자) → level "항"
  //  - /^\s*\d+\./ → level "호"
  //  - /^\s*[가-힣]\./ → level "목"
  //  references는 비워두고, crossref 단계에서 채운다.
  throw new Error("TODO: parseContent() 구현 (Phase 1)");
}

/** API 법령 본문 응답(JSON) → ArticleNode[] */
export function parseLawArticles(_apiJson: unknown): ArticleNode[] {
  // TODO (Phase 1): 응답의 조문단위 배열을 순회하며
  //   parseArticleLabel + parseContent 로 ArticleNode 구성.
  throw new Error("TODO: parseLawArticles() 구현 (Phase 1)");
}
