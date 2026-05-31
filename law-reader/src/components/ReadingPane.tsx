import { useAppStore } from "@/store/appStore";

/**
 * 중앙 본문 패널: 활성 탭의 조-항-호-목을 렌더.
 * Phase 2: 참조어를 하이라이트하고 클릭 시 팝오버/핀.
 * Phase 3: delegation 참조 자리에 시행령 조문을 아코디언으로 임베드.
 */
export function ReadingPane() {
  const tab = useAppStore((s) => s.tabs.find((t) => t.id === s.activeTabId));

  if (!tab) {
    return (
      <div style={{ color: "#888" }}>
        위에서 법령을 검색해 여세요. 조문을 열면 위임·상호참조를 한 화면에서 연결지어 봅니다.
      </div>
    );
  }

  // TODO (Phase 1): tab.doc.articles 렌더
  // TODO (Phase 2): ContentNode.references 로 하이라이트 span 분할
  // TODO (Phase 3): kind==="delegation" → 역인덱스 결과를 인라인 아코디언으로
  return <div>{tab.doc.meta.name} — 본문 렌더는 Phase 1에서 구현</div>;
}
