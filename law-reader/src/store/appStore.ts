/**
 * 앱 상태 — 컨텍스트 보존(탭/핀/읽기 스택)이 UX의 핵심이므로 상태로 관리한다.
 */

import { create } from "zustand";
import type { ArticleNode, LawDocument, LawSystemTree } from "@/types/law";

/** 열린 법령 탭 하나 */
export interface LawTab {
  id: string; // mst
  doc: LawDocument;
  /** 현재 보고 있는 조문(스크롤 타깃) */
  focusedArticle?: { no: number; branch?: number };
}

/** 우측에 고정(pin)해 둔 참조 미리보기 */
export interface PinnedRef {
  id: string;
  lawName: string;
  article: ArticleNode;
}

interface AppState {
  tabs: LawTab[];
  activeTabId?: string;
  systemTree?: LawSystemTree;
  pinned: PinnedRef[];
  /** "어디서 여기로 왔는지" — 뒤로가기용 읽기 스택 */
  history: Array<{ tabId: string; articleNo: number; branch?: number }>;

  openLaw: (doc: LawDocument) => void;
  setActiveTab: (id: string) => void;
  focusArticle: (no: number, branch?: number) => void;
  pin: (ref: PinnedRef) => void;
  unpin: (id: string) => void;
  goBack: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  tabs: [],
  pinned: [],
  history: [],

  openLaw: (doc) =>
    set((s) => {
      const exists = s.tabs.find((t) => t.id === doc.meta.mst);
      if (exists) return { activeTabId: doc.meta.mst };
      return {
        tabs: [...s.tabs, { id: doc.meta.mst, doc }],
        activeTabId: doc.meta.mst,
      };
    }),

  setActiveTab: (id) => set({ activeTabId: id }),

  focusArticle: (no, branch) =>
    set((s) => {
      const tabId = s.activeTabId;
      if (!tabId) return {};
      return {
        history: [...s.history, { tabId, articleNo: no, branch }],
        tabs: s.tabs.map((t) =>
          t.id === tabId ? { ...t, focusedArticle: { no, branch } } : t,
        ),
      };
    }),

  pin: (ref) =>
    set((s) =>
      s.pinned.some((p) => p.id === ref.id)
        ? {}
        : { pinned: [...s.pinned, ref] },
    ),

  unpin: (id) => set((s) => ({ pinned: s.pinned.filter((p) => p.id !== id) })),

  goBack: () => {
    const { history } = get();
    if (history.length < 2) return;
    const prev = history[history.length - 2];
    set((s) => ({
      activeTabId: prev.tabId,
      history: s.history.slice(0, -1),
      tabs: s.tabs.map((t) =>
        t.id === prev.tabId
          ? { ...t, focusedArticle: { no: prev.articleNo, branch: prev.branch } }
          : t,
      ),
    }));
  },
}));
