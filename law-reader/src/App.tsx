import { SearchBar } from "@/components/SearchBar";
import { SystemTree } from "@/components/SystemTree";
import { ReadingPane } from "@/components/ReadingPane";
import { ReferencePopover } from "@/components/ReferencePopover";

/**
 * 3분할 레이아웃 (DESIGN.md §3):
 *  좌: 체계도 트리 | 중앙: 본문 읽기 패널 | 우: 핀/참조 미리보기
 */
export function App() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr 320px",
        gridTemplateRows: "auto 1fr",
        height: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <header style={{ gridColumn: "1 / -1", padding: 8, borderBottom: "1px solid #ddd" }}>
        <SearchBar />
      </header>
      <aside style={{ borderRight: "1px solid #eee", overflow: "auto" }}>
        <SystemTree />
      </aside>
      <main style={{ overflow: "auto", padding: 16 }}>
        <ReadingPane />
      </main>
      <aside style={{ borderLeft: "1px solid #eee", overflow: "auto" }}>
        <ReferencePopover />
      </aside>
    </div>
  );
}
