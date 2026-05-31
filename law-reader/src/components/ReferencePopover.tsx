import { useAppStore } from "@/store/appStore";

/**
 * 우측 참조/핀 패널: 클릭한 참조의 미리보기를 새 창 대신 여기에 띄우고,
 * 핀(pin)하면 계속 고정해 본문과 나란히 읽는다 (컨텍스트 보존).
 */
export function ReferencePopover() {
  const pinned = useAppStore((s) => s.pinned);

  if (pinned.length === 0) {
    return (
      <div style={{ padding: 12, color: "#888", fontSize: 13 }}>
        참조를 클릭하면 여기 미리보기로 뜹니다. 📌 핀하면 옆에 고정됩니다.
      </div>
    );
  }

  // TODO (Phase 2): pinned 각 항목을 미니 조문 카드로 렌더 + unpin 버튼
  return (
    <div style={{ padding: 12 }}>
      {pinned.map((p) => (
        <div key={p.id} style={{ marginBottom: 12 }}>
          <strong>{p.lawName}</strong> {p.article.label}
        </div>
      ))}
    </div>
  );
}
