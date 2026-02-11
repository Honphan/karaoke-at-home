# 🎤 Karaoke at Home

Ứng dụng web karaoke real-time cho phép bạn và bạn bè hát karaoke ngay tại nhà. Một người mở **Host** trên TV/Laptop để hiển thị video, những người khác dùng **Remote** trên điện thoại để tìm và chọn bài hát.

## ✨ Tính năng

- **🏠 Tạo phòng** — Tạo phòng karaoke với mã 6 ký tự, chia sẻ qua QR code
- **📱 Điều khiển từ xa** — Dùng điện thoại tìm bài, thêm vào hàng chờ
- **🔄 Đồng bộ real-time** — Firebase Realtime Database đồng bộ tức thời giữa tất cả thiết bị
- **🎵 Phát video YouTube** — Tìm kiếm và phát nhạc karaoke trực tiếp từ YouTube
- **⬆️ Quản lý hàng chờ** — Ưu tiên bài, xóa bài, bỏ qua bài đang phát
- **❤️ Danh sách yêu thích** — Lưu bài yêu thích theo tên người dùng, dùng lại cho các phiên sau
- **📷 QR Code** — Quét QR trên TV để tham gia phòng nhanh chóng

## 🛠 Tech Stack

| Công nghệ | Vai trò |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Styling & design system |
| **Firebase Realtime Database** | Real-time data sync |
| **YouTube Data API v3** | Tìm kiếm bài hát |
| **React Router** | Client-side routing |
| **React Player** | Phát video YouTube |
| **qrcode.react** | Tạo QR code |
| **Lucide React** | Icons |

## 📦 Cài đặt

### Yêu cầu

- [Node.js](https://nodejs.org/) >= 18
- Tài khoản [Firebase](https://firebase.google.com/) (Realtime Database)
- [YouTube Data API v3](https://console.cloud.google.com/) key

### Bước 1: Clone project

```bash
git clone https://github.com/Honphan/karaoke-at-home.git
cd karaoke-at-home
```

### Bước 2: Cài dependencies

```bash
npm install
```

### Bước 3: Cấu hình environment

Tạo file `.env` tại thư mục gốc:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# YouTube Data API v3
VITE_YOUTUBE_API_KEY=your_youtube_api_key
```

### Bước 4: Chạy ứng dụng

```bash
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`

### Build production

```bash
npm run build
npm run preview
```

## 🎮 Cách sử dụng

### Trên TV / Laptop (Host)

1. Mở trang chủ → nhấn **"Tạo Phòng Mới"**
2. Màn hình Host sẽ hiển thị video player + QR code + hàng chờ
3. Chia sẻ **mã phòng** hoặc cho bạn bè quét **QR code**

### Trên Điện thoại (Remote)

1. Quét QR code hoặc nhập mã phòng 6 ký tự
2. Nhập tên của bạn
3. Sử dụng 3 tab:
   - **🔍 Tìm bài** — Tìm kiếm bài hát, nhấn ➕ thêm vào queue, nhấn ❤️ lưu yêu thích
   - **❤️ Yêu thích** — Xem bài đã lưu, thêm nhanh vào queue
   - **🎵 Hàng chờ** — Quản lý thứ tự phát

## 📁 Cấu trúc project

```
src/
├── config/
│   └── firebase.js            # Firebase configuration
├── services/
│   ├── roomService.js         # Room CRUD & queue management
│   ├── youtubeService.js      # YouTube search API
│   └── favoriteService.js     # Favorites CRUD (per user)
├── components/
│   ├── VideoPlayer.jsx        # YouTube video player
│   ├── SearchBar.jsx          # Search input
│   ├── SearchResult.jsx       # Search results list
│   ├── QueueList.jsx          # Song queue display
│   ├── QRCodeView.jsx         # QR code for room
│   └── FavoriteList.jsx       # Favorites list
├── pages/
│   ├── Home.jsx               # Landing page
│   ├── HostRoom.jsx           # Host view (TV/Laptop)
│   └── RemoteControl.jsx      # Remote control (Phone)
├── App.jsx                    # Router setup
├── main.jsx                   # Entry point
└── index.css                  # Global styles & design system
```

## 🎨 Design System

Ứng dụng sử dụng **Neon-Noir** design system với:

- **Glassmorphism** cards với backdrop blur
- **Neon glow** effects (Magenta, Cyan, Violet, Pink)
- **Dark theme** với noise overlay
- **Micro-animations** (float, slide-up, fade-in, heart-pop)
- Font: **Outfit** (headings) + **DM Sans** (body)

## 📄 License

MIT © [HonPhan](https://github.com/Honphan)
