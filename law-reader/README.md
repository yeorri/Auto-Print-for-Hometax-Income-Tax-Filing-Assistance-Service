# 법조문 뷰어 (law-reader)

법조문을 읽을 때 "대통령령으로 정한다" 같은 위임 조항·상호참조를 새 창으로
타고 들어가지 않고, **한 화면에서 트리/임베드로 연결지어 읽게** 해주는 앱.

> 우선 웹앱으로 시작 → 추후 Tauri/Electron 데스크탑화.

## 빠른 시작 (Phase 1부터 구현 예정)

```bash
cd law-reader
npm install
cp .env.example .env      # VITE_LAW_OC 에 국가법령정보 OPEN API 인증키 입력
npm run dev
```

국가법령정보 공동활용 OPEN API 인증키(OC) 발급: https://open.law.go.kr → 가입 → 활용신청

## 현재 상태

**Phase 0 — 골격 + 설계 완료.** 설계 전체는 [`DESIGN.md`](./DESIGN.md) 참고.
`src/` 아래 모듈은 타입과 인터페이스만 정의된 스텁 상태이며, TODO 주석을 따라 구현한다.

## 구조

자세한 폴더 구조와 아키텍처는 [`DESIGN.md`](./DESIGN.md) 6장 참고.
