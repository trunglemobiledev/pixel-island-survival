# Kế hoạch Triển khai Pixel Island: Survival

Dựa trên Game Design Document (GDD) bạn cung cấp, đây là lộ trình phát triển dự án sử dụng PixiJS và Vite.

## Giai đoạn 1: Khởi tạo & Cấu trúc Cơ bản (Core Setup)
- [ ] **Thiết lập Dự án**:
    - [ ] Khởi tạo Vite project (Vanilla JS).
    - [ ] Cài đặt `pixi.js`.
    - [ ] Thiết lập `style.css` (reset CSS, full screen canvas).
- [ ] **Cấu trúc Game Loop**:
    - [ ] Tạo `Application` class quản lý Pixi App.
    - [ ] Thiết lập hệ thống Scene (Scene Manager).
    - [ ] Tạo các Container cơ bản: `Background`, `Object`, `Entity`, `UI`.
- [ ] **Tài nguyên (Assets)**:
    - [ ] Tạo placeholder assets (pixel art cơ bản cho đất, nước, nhân vật).
    - [ ] Thiết lập Asset Loader.

## Giai đoạn 2: Hệ thống Bản đồ & Grid (Map System)
- [ ] **Grid System**:
    - [ ] Định nghĩa kích thước Grid (ví dụ: 32x32).
    - [ ] Tạo cấu trúc dữ liệu Map (Mảng 2D).
- [ ] **Rendering Map**:
    - [ ] Vẽ Tilemap dựa trên mảng 2D.
    - [ ] Triển khai `Vertical Scrolling` (Cuộn dọc) cho các Zone.
    - [ ] Phân chia Zone (Zone 0: Nhà, Zone 1: Vườn, v.v.).

## Giai đoạn 3: Nhân vật & Di chuyển (Player & Movement)
- [ ] **Player Entity**:
    - [ ] Tạo class `Player`.
    - [ ] Xử lý Animation (Idle, Walk).
- [ ] **Cơ chế Di chuyển**:
    - [ ] Implement Click-to-Move (Pathfinding đơn giản hoặc đi thẳng).
    - [ ] Camera follow nhân vật (giới hạn trục X, cuộn trục Y).
- [ ] **Va chạm (Collision)**:
    - [ ] Xử lý va chạm với chướng ngại vật (Đá, Cây, Nước).

## Giai đoạn 4: Tương tác & Nông trại (Interaction & Farming)
- [ ] **Hệ thống Công cụ (Tools)**:
    - [ ] Chuyển đổi công cụ (Cuốc, Rìu, Cần câu).
- [ ] **Cơ chế Trồng trọt**:
    - [ ] Cuốc đất -> Gieo hạt -> Tưới nước -> Thu hoạch.
    - [ ] Timer cho cây lớn.
- [ ] **Tương tác Môi trường**:
    - [ ] Chặt cây, đập đá.

## Giai đoạn 5: Sinh tồn & Game Loop (Survival & Polish)
- [ ] **Chỉ số Sinh tồn**:
    - [ ] Thanh Máu (HP), Thể lực (Stamina).
    - [ ] UI hiển thị chỉ số.
- [ ] **Chu kỳ Ngày/Đêm**:
    - [ ] Lớp phủ tối (Night Mask).
    - [ ] Hiệu ứng ánh sáng (Light source).
- [ ] **Quái vật (Mobs)**:
    - [ ] AI đơn giản cho quái vật ban đêm.
    - [ ] Cơ chế tấn công/nhận sát thương.

## Giai đoạn 6: Mở rộng (Expansion)
- [ ] Minigame Câu cá.
- [ ] Hệ thống Inventory & Crafting đơn giản.
- [ ] Lưu game (LocalStorage).
