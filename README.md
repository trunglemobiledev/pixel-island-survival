# Pixel Island: Survival / Đảo Pixel Sinh Tồn

![Pixel Art](https://img.shields.io/badge/Style-Pixel%20Art-ff69b4)
![PixiJS](https://img.shields.io/badge/Engine-PixiJS-e72264)
![Vite](https://img.shields.io/badge/Build-Vite-646cff)

[English](#english) | [Tiếng Việt](#tiếng-việt)

---

<a name="english"></a>
## 🇬🇧 English

### Overview
**Pixel Island: Survival** is a web-based 2D survival and farming simulation game inspired by titles like *Tiny Pixel Farm*. Players find themselves on a mysterious island where they must gather resources, farm, and survive against night monsters.

### Features
- ** immersive World**: Vertical scrolling map with distinct zones (Home, Garden, Forest, Water).
- **Interactive Gameplay**:
  - **Movement**: Click-to-move pathfinding or Virtual Joystick (Touch/Mouse).
  - **Camera**: Smooth follow camera with Zoom In/Out capabilities (Scroll wheel).
  - **Gathering**: Chop trees to spawn wood resources.
  - **Item System**: Auto-pickup mechanism for dropped items (Wood, Stone, Gold, Potions).
- **Entities**:
  - **Player**: Custom pixel art character with animations (idle, walk, bobbing) and a backpack.
  - **NPCs**: Guide NPC with dialogue and quest system; wandering villagers.
  - **Enemies**: Slimes with squish animations.
- **UI/UX**:
  - On-screen Joystick for mobile-friendly controls.
  - Toolbar for tool selection (Hand, Hoe, Axe, Sword, Watering Can).
  - Quest Box displaying current objectives.

### Screenshots
Here are some in-game captures from the project (click to enlarge):

<p align="center">
  <img src="capture_game/Screenshot%202025-12-18%20082148.png" alt="screenshot1" width="320" style="margin:6px;" />
  <img src="capture_game/Screenshot%202025-12-18%20082746.png" alt="screenshot2" width="320" style="margin:6px;" />
  <img src="capture_game/Screenshot%202025-12-18%20082751.png" alt="screenshot3" width="320" style="margin:6px;" />
</p>

<p align="center">
  <img src="capture_game/Screenshot%202025-12-18%20082824.png" alt="screenshot4" width="320" style="margin:6px;" />
  <img src="capture_game/Screenshot%202025-12-18%20082832.png" alt="screenshot5" width="320" style="margin:6px;" />
  <img src="capture_game/Screenshot%202025-12-18%20082902.png" alt="screenshot6" width="320" style="margin:6px;" />
</p>


### Tech Stack
- **Core**: HTML5, Vanilla JavaScript.
- **Rendering**: [PixiJS](https://pixijs.com/) (v8+).
- **Build Tool**: [Vite](https://vitejs.dev/).
- **Input**: [nipple.js](https://yoannmoi.net/nipplejs/) for virtual joystick.

### Installation & Running
1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd pixel-island-survival
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run locally**:
    ```bash
    npm run dev
    ```
4.  **Run for Local Network Access (Mobile Testing)**:
    ```bash
    npm run dev -- --host
    ```
    Access via `http://YOUR_LOCAL_IP:5173`.

### Controls
- **PC**:
  - **Left Click**: Move to tile / Interact with entities / Select UI.
  - **Scroll Wheel**: Zoom In / Zoom Out.
  - **Mouse Drag (Bottom Left)**: Use Virtual Joystick.
- **Mobile**:
  - **Touch Drag (Bottom Left)**: Move character.
  - **Tap**: Interact / Select tools.

---

<a name="tiếng-việt"></a>
## 🇻🇳 Tiếng Việt

### Tổng quan
**Pixel Island: Survival** (Đảo Pixel Sinh Tồn) là một tựa game web mô phỏng sinh tồn và nông trại với đồ họa pixel 2D, lấy cảm hứng từ *Tiny Pixel Farm*. Người chơi lạc vào một hòn đảo bí ẩn, nơi họ phải thu thập tài nguyên, trồng trọt và sống sót qua màn đêm đầy quái vật.

### Tính năng
- **Thế giới sống động**: Bản đồ cuộn dọc với các khu vực sinh thái riêng biệt (Nhà chính, Vườn, Rừng, Hồ nước).
- **Lối chơi tương tác**:
  - **Di chuyển**: Click chuột để đi hoặc sử dụng Joystick ảo (Hỗ trợ cảm ứng).
  - **Camera**: Camera mượt mà đi theo nhân vật, hỗ trợ Phóng to/Thu nhỏ (Lăn chuột).
  - **Thu thập**: Chặt cây để lấy gỗ.
  - **Hệ thống vật phẩm**: Tự động nhặt vật phẩm rơi ra (Gỗ, Đá, Vàng, Thuốc).
- **Thực thể (Entities)**:
  - **Nhân vật chính**: Đồ họa pixel tùy chỉnh với hoạt ảnh (đứng yên, đi bộ, nhún nhảy) và ba lô.
  - **NPC**: NPC Hướng dẫn với hệ thống hội thoại/nhiệm vụ; dân làng tự do đi lại.
  - **Quái vật**: Slime với hiệu ứng co giãn sinh động.
- **Giao diện (UI)**:
  - Joystick ảo trên màn hình giúp điều khiển dễ dàng trên điện thoại.
  - Thanh công cụ (Toolbar) để chọn dụng cụ (Tay, Cuốc, Rìu, Kiếm, Bình tưới).
  - Hộp nhiệm vụ hiển thị mục tiêu hiện tại.

### Công nghệ sử dụng
- **Cốt lõi**: HTML5, Vanilla JavaScript.
- **Đồ họa**: [PixiJS](https://pixijs.com/) (v8+).
- **Công cụ Build**: [Vite](https://vitejs.dev/).
- **Điều khiển**: [nipple.js](https://yoannmoi.net/nipplejs/) cho joystick ảo.

### Cài đặt & Chạy game
1.  **Tải dự án**:
    ```bash
    git clone <repository-url>
    cd pixel-island-survival
    ```
2.  **Cài đặt thư viện**:
    ```bash
    npm install
    ```
3.  **Chạy trên máy**:
    ```bash
    npm run dev
    ```
4.  **Chạy để truy cập qua mạng LAN (Test trên điện thoại)**:
    ```bash
    npm run dev -- --host
    ```
    Truy cập bằng địa chỉ `http://ĐỊA_CHỈ_IP_CỦA_BẠN:5173`.

### Điều khiển
- **Máy tính (PC)**:
  - **Chuột trái**: Di chuyển đến ô đất / Tương tác / Chọn giao diện.
  - **Lăn chuột**: Phóng to / Thu nhỏ bản đồ.
  - **Kéo chuột (Góc dưới trái)**: Sử dụng Joystick ảo.
- **Điện thoại (Mobile)**:
  - **Vuốt/Kéo (Góc dưới trái)**: Di chuyển nhân vật.
  - **Chạm**: Tương tác / Chọn công cụ.

---

## Author / Tác giả
**Trung Le** - [GitHub Profile](https://github.com/trunglemobiledev)
