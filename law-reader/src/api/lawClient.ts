/**
 * 데이터 접근 계층.
 *
 * 통찰 3: 웹앱에서 law.go.kr DRF API를 직접 부르면 CORS에 막힌다.
 * 그래서 LawApiClient 인터페이스로 추상화하고, 웹에서는 ProxyLawClient(Vite proxy),
 * 추후 데스크탑에서는 NativeLawClient(Tauri/Electron HTTP)로 교체한다.
 */

import type { LawDocument, LawMeta, LawSystemTree } from "@/types/law";

export interface LawSearchResult {
  results: LawMeta[];
  totalCount: number;
}

/** 모든 데이터 소스가 구현해야 하는 인터페이스 */
export interface LawApiClient {
  /** 법령명/키워드로 검색 */
  search(query: string): Promise<LawSearchResult>;
  /** 법령 본문(조문 트리) 조회 */
  getLaw(mst: string): Promise<LawDocument>;
  /** 법령 체계도(법-시행령-시행규칙) 조회 */
  getSystemTree(mst: string): Promise<LawSystemTree>;
}

/** 국가법령정보 공동활용 OPEN API의 DRF 경로 (개발 시 Vite proxy로 우회) */
const DRF_BASE = "/law-api/DRF";

/**
 * 웹용 구현 — Vite dev proxy(또는 배포 시 서버리스 프록시) 경유.
 */
export class ProxyLawClient implements LawApiClient {
  constructor(private oc: string) {}

  private url(path: string, params: Record<string, string>): string {
    const q = new URLSearchParams({ OC: this.oc, type: "JSON", ...params });
    return `${DRF_BASE}/${path}?${q.toString()}`;
  }

  async search(query: string): Promise<LawSearchResult> {
    // TODO: fetch(this.url("lawSearch.do", { target: "law", query }))
    //       → 응답 JSON에서 LawMeta[] 매핑
    void this.url("lawSearch.do", { target: "law", query });
    throw new Error("TODO: search() 구현 (Phase 1)");
  }

  async getLaw(mst: string): Promise<LawDocument> {
    // TODO: fetch(this.url("lawService.do", { target: "law", MST: mst }))
    //       → parser/articleParser 로 ArticleNode 트리 변환
    void this.url("lawService.do", { target: "law", MST: mst });
    throw new Error("TODO: getLaw() 구현 (Phase 1)");
  }

  async getSystemTree(mst: string): Promise<LawSystemTree> {
    // TODO: fetch(this.url("lawService.do", { target: "lsStmd", MST: mst }))
    void this.url("lawService.do", { target: "lsStmd", MST: mst });
    throw new Error("TODO: getSystemTree() 구현 (Phase 1)");
  }
}

/** 환경변수에서 OC키를 읽어 기본 클라이언트 생성 */
export function createLawClient(): LawApiClient {
  const oc = import.meta.env.VITE_LAW_OC as string | undefined;
  if (!oc) {
    console.warn("[law-reader] VITE_LAW_OC 미설정 — .env 에 인증키를 넣으세요.");
  }
  return new ProxyLawClient(oc ?? "");
}
