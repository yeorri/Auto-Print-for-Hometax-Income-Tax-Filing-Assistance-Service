/** 법령 검색 입력. Phase 1에서 createLawClient().search()에 연결. */
export function SearchBar() {
  // TODO (Phase 1): 입력 → client.search(query) → 결과 드롭다운 → 선택 시 openLaw
  return (
    <input
      type="search"
      placeholder="법령명 검색 (예: 소득세법)"
      style={{ width: 360, padding: "6px 10px" }}
      disabled
    />
  );
}
