
# 📄 **Chat Modülü Backend Dökümantasyonu**

## 🧩 Genel Amaç
Bu modül, kullanıcılar arasında **anlık mesajlaşma** ve **admin paneli üzerinden sohbet takibi** gibi özellikleri destekler. `Socket.IO` ile gerçek zamanlı iletişim, `MongoDB` ile veri kalıcılığı sağlanmıştır.

---

## ⚙️ 1. Teknolojiler ve Kütüphaneler

| Araç | Açıklama |
|------|----------|
| `Socket.IO` | Gerçek zamanlı mesajlaşma altyapısı |
| `Express.js` | REST API yönetimi |
| `Mongoose` | MongoDB ODM |
| `JWT + Cookie` | Kimlik doğrulama |
| `TypeScript` | Tip güvenliği |
| `Bun` | Server çalıştırma ortamı |

---

## 🗃️ 2. ChatMessage Modeli (`chatMessage.model.ts`)

```ts
{
  sender: ObjectId (ref: "User"),
  roomId: string,
  message: string,
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

> 🧠 `roomId`: Kullanıcılar arası bireysel ya da grup odaları için string ID (örnek: `"room-123"`).

---

## 🔌 3. Socket.IO Entegrasyonu

### `src/socket.ts`

- Kullanıcı bağlantısı sırasında:
  - Cookie'den `accessToken` alınır
  - Token doğrulanır, `socket.user` nesnesi oluşur

- Olaylar:
  - `chat-message`: Mesaj alır ve tüm kullanıcılara yayar
  - `disconnect`: Kullanıcı ayrıldığında loglama yapılır

```ts
socket.on("chat-message", (msg) => {
  io.emit("chat-message", msg);
});
```

---

## 📡 4. API Endpoint'leri

### 🔹 `GET /api/chat/:roomId`  
> Belirli bir odanın tüm mesajlarını getirir.

```bash
GET /api/chat/room-123
Authorization: Cookie (accessToken)
```

---

### 🔹 `POST /api/chat/send`  
> Yeni mesaj gönderir (Socket bağlantısı yerine REST ile)

```bash
POST /api/chat/send
Content-Type: application/json
Authorization: Cookie (accessToken)

{
  "roomId": "room-123",
  "message": "Merhaba, destek ekibi burada!"
}
```

---

### 🔹 `DELETE /api/chat/:messageId`  
> Tek bir mesajı siler (Admin için)

---

### 🔹 `DELETE /api/chat/room/:roomId`  
> Belirli bir odadaki **tüm mesajları** siler (Admin için)

---

## 🔐 5. Kimlik Doğrulama
- Tüm işlemler `authenticate` middleware'i ile korunmaktadır
- Kullanıcı bilgisi `req.user` ve `socket.user` üzerinden alınır
- Cookie üzerinden HTTP-only `accessToken` doğrulanır

---

## 📂 6. Dosya Yapısı (İlgili)

```
src/
├── controllers/chat.controller.ts
├── models/chatMessage.model.ts
├── routes/chat.routes.ts
├── socket.ts
├── types/socket.d.ts (opsiyonel)
```

---

## 🔮 7. Sonraki Adımlar (Frontend İçin Hazır)

| Özellik | Açıklama |
|--------|----------|
| ✅ Gerçek zamanlı chat | Socket.IO ile hazır |
| ✅ Mesaj listeleme | REST API `/chat/:roomId` |
| ✅ Mesaj gönderme | Socket + REST destekli |
| ✅ Silme işlemleri | Admin için tamamlandı |
| 🔜 Kullanıcı listesi / oda yönetimi | Eklenebilir |
| 🔜 Okundu bilgisi / typing | Planlanabilir |

---

Bu dökümanla birlikte frontend için:
- Anlık mesajlaşma (socket)
- Eski mesajları listeleme (REST)
- Giriş yapan kullanıcıya özel sohbetler
- Admin için mesaj yönetimi

gibi tüm ihtiyaçları rahatlıkla karşılayabilirsin.

---

İstersen şimdi frontend tarafında:
- Chat page component
- Socket bağlantısı (client tarafı)
- Redux veya context ile mesaj state yönetimi

gibi yapılarla ilerleyebiliriz.

Hazırsan frontend mimarisiyle başlayalım mı? 💬⚡