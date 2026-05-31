/**
 * 도메인 타입 — 법령 구조와 참조를 표현한다.
 * 한국 법령은 법 > 편 > 장 > 절 > 관 아래 "조-항-호-목"으로 내려간다.
 */

/** 법령 종류 */
export type LawKind =
  | "법률"
  | "대통령령" // 시행령
  | "총리령"
  | "부령" // 시행규칙 (○○부령)
  | "조약"
  | "기타";

/** 법령 식별자: 국가법령정보 API의 법령일련번호(MST) 또는 법령ID */
export interface LawId {
  mst: string; // 법령 마스터 일련번호
  lawId?: string; // 법령 ID (선택)
}

/** 법령 메타데이터 */
export interface LawMeta extends LawId {
  name: string; // 예: "소득세법"
  kind: LawKind;
  enforceDate?: string; // 시행일 YYYYMMDD
  promulgateNo?: string; // 공포번호
  ministry?: string; // 소관부처
}

/**
 * 조문 콘텐츠 트리 — 항(clause) > 호(item) > 목(subitem) 재귀 구조.
 * 각 노드는 자체 텍스트와 그 안에서 탐지된 참조를 가진다.
 */
export interface ContentNode {
  /** "항" | "호" | "목" | "문장" */
  level: "항" | "호" | "목" | "문장";
  /** 번호 라벨. 예: "②", "3.", "가." (없을 수 있음) */
  marker?: string;
  text: string;
  /** crossref가 채워 넣는, 이 노드 텍스트 안의 참조들 */
  references: Reference[];
  children: ContentNode[];
}

/** 조문(條) 한 개 */
export interface ArticleNode {
  /** 조 번호. 예: 15 */
  no: number;
  /** 가지조 번호. "제15조의2" → branch=2 (없으면 undefined) */
  branch?: number;
  /** 표시용 라벨. 예: "제15조의2" */
  label: string;
  title?: string; // 조 제목 (있으면)
  content: ContentNode[];
  references: Reference[]; // 조 제목/본문 직속 참조
}

/** 법령 본문 전체 */
export interface LawDocument {
  meta: LawMeta;
  articles: ArticleNode[];
}

/* ----------------------------- 참조(Reference) ----------------------------- */

export type ReferenceKind =
  | "delegation" // 위임: "대통령령으로 정한다" 등
  | "internal" // 내부참조: 같은 법령 "제2항", "제15조의2"
  | "external" // 타법참조: "「소득세법」 제12조"
  | "appendix"; // 별표·서식: "별표 제1호", "별지 제3호서식"

/** 본문 텍스트 안에서 탐지된 참조 한 건 */
export interface Reference {
  kind: ReferenceKind;
  /** 원문 그대로의 문자열. 예: "대통령령으로 정한다" */
  rawText: string;
  /** 노드 텍스트 내 위치 [start, end) — 하이라이트용 */
  span: [number, number];
  /** 해석된 타깃 (아직 못 풀었으면 undefined) */
  target?: ResolvedTarget;
}

/** 참조가 가리키는 대상 */
export interface ResolvedTarget {
  /** 다른 법령이면 그 식별자, 같은 법령 내부면 생략 */
  law?: LawId;
  /** 대상 조 번호 (가지조 포함) */
  articleNo?: number;
  articleBranch?: number;
  /** 위임의 경우, 역인덱스로 찾은 하위법령 조문들 */
  delegatedArticles?: Array<{ law: LawMeta; article: ArticleNode }>;
}

/* ----------------------------- 체계도(Tree) ----------------------------- */

/** 법령 체계도: 법 ↔ 시행령 ↔ 시행규칙 트리 */
export interface LawSystemTree {
  root: LawMeta; // 보통 법률
  children: LawSystemTree[]; // 하위: 시행령, 시행규칙 등
}
