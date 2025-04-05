# 📦 Anastasia Massage Backend API Dokümantasyonu

Bu dokümantasyon, **Anastasia Masaj Salonu** için geliştirilen tüm backend modüllerini detaylı şekilde açıklar. Amaç; frontend geliştiricilerin rahatlıkla entegre olabileceği, admin panelden kolay yönetim sağlayacak bir sistem ortaya koymaktır.

---

## 📁 Proje Modül Yapısı (src/routes/index.ts)

| Modül           | Açıklama                                                                 |
|----------------|--------------------------------------------------------------------------|
| `/users`       | Kullanıcı işlemleri (admin ve müşteri)                                   |
| `/appointments`| Randevu alma ve yönetim sistemi                                           |
| `/products`    | Ürün ekleme, düzenleme, listeleme                                         |
| `/orders`      | Sipariş oluşturma ve yönetimi                                            |
| `/blogs`       | Blog yazıları yayınlama, listeleme                                        |
| `/dashboard`   | Admin panel özet verileri (istatistikler)                                 |
| `/cart`        | Kullanıcının alışveriş sepeti işlemleri                                   |
| `/notifications` | Sistem içi bildirimler (sipariş, randevu vs.)                           |
| `/feedbacks`   | Müşteri yorum ve geri bildirimleri                                        |
| `/coupons`     | Kupon tanımlama ve indirim yönetimi                                      |
| `/contacts`    | İletişim formu mesajları                                                  |
| `/settings`    | Genel ayarlar: site başlığı, e-posta, footer bilgileri                    |
| `/faqs`        | Sıkça sorulan sorular                                                     |
| `/gallery`     | Galeri görselleri (masaj ortamları, hizmetler vs.)                        |
| `/stocks`      | Ürün stok takibi                                                          |
| `/payments`    | Ödeme (hazırlık, manuel ödeme tipi tanımı)                                |
| `/account`     | Kullanıcı profil ve parola işlemleri                                      |
| `/services`    | Masaj hizmet tanımları ve süre/fiyat bilgileri                             |
| `/emails`      | E-posta gönderme ve gelen e-posta kutusu yönetimi                         |

---

## 🔐 Authentication & Authorization

- JWT tabanlı kullanıcı doğrulama.
- `/users/login` endpoint’i ile token alınır.
- Admin yetkilendirmesi: `authorizeRoles("admin")` middleware'i kullanılır.

---

## 📆 Appointment Modülü

| Endpoint | Yöntem | Açıklama |
|---------|--------|----------|
| `/appointments` | `POST` | Randevu oluştur |
| `/appointments` | `GET` | Tüm randevuları listele (admin) |
| `/appointments/:id` | `GET` | Randevu detayları |
| `/appointments/:id/status` | `PUT` | Randevu durumunu güncelle |
| `/appointments/:id` | `DELETE` | Randevu sil |

**Otomatik İşlev:** Randevu oluşturulunca hem müşteriye hem de admin’e e-posta gider. Ayrıca admin panelde bildirim oluşturulur.

---

## 🛍️ Product Modülü

| Endpoint | Yöntem | Açıklama |
|----------|--------|----------|
| `/products` | `GET` | Ürünleri listele (herkese açık) |
| `/products/:id` | `GET` | Tekil ürün bilgisi |
| `/products` | `POST` | Ürün oluştur (admin) |
| `/products/:id` | `PUT` | Ürünü güncelle (admin) |
| `/products/:id` | `DELETE` | Ürünü sil (admin) |

**Özellik:** Çoklu görsel yükleme, ürün etiketleri ve kategori bazlı filtreleme.

---

## 🛒 Order Modülü

| Endpoint | Yöntem | Açıklama |
|----------|--------|----------|
| `/orders` | `POST` | Sipariş oluştur (kargo adresi, ürün listesi vs.) |
| `/orders` | `GET` | Siparişleri listele (admin) |
| `/orders/:id/delivered` | `PUT` | Teslimat durumunu güncelle |
| `/orders/:id` | `PUT` | Siparişi güncelle (detayları) |

**Otomatik İşlev:** Sipariş oluşturulunca müşteri ve admin’e e-posta gider. Bildirim paneline yansır. Stok otomatik olarak düşer.

---

## 🧺 Cart Modülü

- `POST /cart/add` → Sepete ürün ekle
- `PUT /cart/increase/:productId` → Miktarı artır
- `PUT /cart/decrease/:productId` → Miktarı azalt
- `DELETE /cart/remove/:productId` → Ürün çıkar
- `DELETE /cart/clear` → Sepeti temizle
- `GET /cart` → Mevcut sepeti getir

---

## 🧾 Blog Modülü

- Blog yazısı oluştur (admin)
- Başlık, özet, detay, görsel, etiket bilgileri

---

## 📩 E-posta Modülü

- `POST /emails/send` → Mail gönder (test amaçlı veya özel işlem)
- `GET /emails` → Gelen kutusu (IMAP ile senkronize)
- `POST /emails/fetch` → Gelen e-postaları sunucudan çek ve veritabanına kaydet

---

## 🔔 Notification Modülü

- Randevu veya sipariş sonrası otomatik kayıt
- `GET /notifications` → Bildirimleri getir (admin)
- `POST /notifications` → Bildirim oluştur
- `DELETE /notifications/:id` → Bildirimi sil

---

## 🧾 Diğer Modüller

### 📌 Services
- Masaj hizmetleri tanımı (isim, açıklama, süre, fiyat, aktiflik)

### 📌 Feedback
- Kullanıcılardan yorumlar alınır, admin panelden görüntülenir.

### 📌 Gallery
- Görsel yükleme (spa, ortam fotoğrafları)

### 📌 Settings
- İletişim bilgileri, site ayarları

### 📌 Contact
- İletişim formu ile gelen mesajlar

### 📌 Faq
- SSS yönetimi (başlık + açıklama)

### 📌 Coupon
- İndirim kuponları tanımlanır

### 📌 Dashboard
- Admin panelde istatistik verileri

### 📌 Stock
- Ürün stoku takibi, her ürün bir `stockRef` ile bağlıdır.

### 📌 Payment
- Şimdilik manuel (kapıda ödeme) tanımı. Genişletilebilir yapı.

---

## 📂 Upload Klasörleri

- `uploads/profile-images/`
- `uploads/product-images/`
- `uploads/service-images/`
- `uploads/blog-images/`
- `uploads/gallery-images/`

> ⚠️ Tüm yüklemelerde multer + custom `uploadType` kullanılır.

---

## ✅ Geliştirme Notları

- SCSS modüler yapı
- TypeScript tüm backend yapısında kullanılmakta
- Her model ayrı `interface` ile tanımlı
- Validasyon, hata yönetimi ve hata mesajları özenle düzenlenmiştir
- `.env` ile SMTP, MongoDB, JWT gibi değişkenler yönetilir

---

Frontend geliştiricisi olarak her modülde yukarıdaki endpointlere göre POST, GET, PUT, DELETE işlemlerini rahatlıkla gerçekleştirebilirsin.

---

Daha fazla entegrasyon için Swagger/OpenAPI dokümantasyonu istersen onu da hazırlayabiliriz ✨

