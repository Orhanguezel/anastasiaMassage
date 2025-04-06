Admin panelinde modüller; yönetim kolaylığı, içerik kontrolü, kullanıcı denetimi ve sistem işleyişini sağlamak için gruplandırılmış yapılar olarak düşünülür. Anastasia Masaj Salonu gibi bir sistemde, **hem iş süreçlerini hem de müşteri deneyimini yöneten** kapsamlı bir admin paneli şu modülleri içerebilir:

---

## 🧩 Ana Modül Listesi (Anastasia Admin Panel)

### 1. **👥 Kullanıcı Yönetimi**

| Amaç | HTTP | Endpoint (Frontend) | Açıklama |
|------|------|----------------------|----------|
| 🔐 Kayıt | `POST` | `/users/register` | Yeni kullanıcı kaydı |
| 🔐 Giriş | `POST` | `/users/login` | Kullanıcı giriş |
| 🔐 Çıkış | `POST` | `/users/logout` | Çıkış işlemi |
| 🔒 Şifre değiştir | `POST` | `/users/change-password` | Şifre güncelleme |
| 👤 Profil al | `GET` | `/users/profile` | Kullanıcı profili |
| 👤 Profil güncelle | `PUT` | `/users/profile` | Profil bilgilerini güncelle |
| 🖼️ Profil resmi güncelle | `PUT` | `/users/:id/profile-image` | Tekli resim yükleme |
| 📋 Tüm kullanıcıları getir | `GET` | `/users/users` ✅ | Admin yetkisi ister |
| 🔄 Kullanıcı güncelle (admin) | `PUT` | `/users/users/:id` | Rol/resim dahil |
| 🗑️ Kullanıcı sil | `DELETE` | `/users/users/:id` | Admin yetkisi ister |
| 🛠️ Rol güncelle | `PUT` | `/users/users/:id/role` | Admin/user geçişi |
| ✅ Durum değiştir | `PUT` | `/users/users/:id/status` | Aktif / pasif |
| 🔄 Belirli kullanıcıyı al | `GET` | `/users/users/:id` | Tekil veri getirir |

---
---

### 2. **📅 Randevu Yönetimi**

| Amaç | HTTP | Endpoint (Frontend) | Açıklama |
|------|------|----------------------|----------|
| 📩 Randevu oluştur | `POST` | `/appointments` | Ziyaretçi / kullanıcı randevu oluşturur |
| 📋 Tüm randevuları getir | `GET` | `/appointments` | Tüm randevular (sadece admin) ✅ |
| 🔍 Randevu detay | `GET` | `/appointments/:id` | Tekil randevu bilgisi (admin) |
| ✅ Durum güncelle | `PUT` | `/appointments/:id/status` | Bekliyor, onaylandı, iptal gibi |
| 🗑️ Randevuyu sil | `DELETE` | `/appointments/:id` | Admin yetkisi gerekir |

---

### 3. **🛍️ Ürün ve Stok Yönetimi**

| Amaç | HTTP | Endpoint (Frontend) | Açıklama |
|------|------|----------------------|----------|
| ➕ Ürün oluştur | `POST` | `/products` | Yeni ürün ekleme (admin) ✅ |
| 📋 Tüm ürünleri getir | `GET` | `/products` | Tüm ürünleri listeler (herkese açık) ✅ |
| 🔍 Ürün detay | `GET` | `/products/:id` | Tekil ürün bilgisi (herkese açık) ✅ |
| ✏️ Ürün güncelle | `PUT` | `/products/:id` | Ürün bilgisi + görsel güncelleme (admin) ✅ |
| 🗑️ Ürünü sil | `DELETE` | `/products/:id` | Ürün silme işlemi (admin) ✅ |

---

### 4. **🧾 Sipariş Yönetimi**
- Tüm siparişleri listele
- Durum: Hazırlanıyor, Teslim Edildi, İptal
- Teslimat bilgileri görüntüleme
- Siparişe özel notlar

---

### 5. **💳 Kupon Yönetimi**
- Yeni kupon oluşturma
- İndirim oranı ve geçerlilik süresi
- Kupon durumu: aktif / pasif

---

### 6. **💆 Hizmet Yönetimi**
- Hizmet oluştur/güncelle/sil
- Süre ve fiyat belirleme
- Çoklu görsel ekleme
- Hizmetleri kategoriye göre filtreleme

---

### 7. **📮 E-Posta Modülü**
- Gelen kutusu yönetimi
- E-posta gönderme
- Okundu/okunmadı yönetimi
- Otomatik mail bildirimlerini listeleme (sipariş/randevu vs.)

---

### 8. **📰 Blog Yönetimi**
- Yeni yazı oluştur
- Kategorilere ayırma
- Görsel ve SEO slug yönetimi
- Yayında/geri çekilmiş yazılar

---

### 9. **🖼️ Galeri Yönetimi**
- Görsel/video yükleme
- Başlık ve medya türü seçimi
- Galeriden silme

---

### 10. **📬 İletişim Mesajları**
- Site üzerinden gelen mesajlar
- Okunma durumu
- Yanıtlama (manuel veya otomatik)

---

### 11. **🌿 Geri Bildirimler (Feedback)**
- Ziyaretçi değerlendirmeleri
- Puan sistemi
- Yayınlama / geri çekme

---

### 12. **🔔 Bildirimler**
- Sistem tarafından oluşturulan admin bildirimleri
- Yeni sipariş, yeni randevu, yeni mesaj vs.
- Okunma takibi

---

### 13. **⚙️ Ayarlar**
- Site başlığı, açıklaması
- Meta bilgileri, logo, favicon
- İletişim bilgileri (telefon, e-posta)

---

### 14. **📊 Dashboard (Anasayfa)**
- Genel istatistikler:
  - Kullanıcı sayısı
  - Günlük/aylık sipariş
  - Gelir toplamı
  - Blog sayısı
- Grafik/çizelge görünümleri (Opsiyonel: recharts, chart.js)

---

## 🧠 Ekstra İsteğe Bağlı Modüller
- 🔐 Rol ve Yetki Yönetimi
- 📂 Dosya Depolama Sistemi (upload edilenler arşivi)
- 📆 Özel kampanya planlayıcı (örneğin bayram indirimleri)
- 📢 Bildirim ayarları (kime ne zaman e-posta gidecek?)
- 🧑‍🎓 SSS (FAQ) Yönetimi

---

Hazırsan her bir modül için **sayfa tasarımı**, **slice yapısı** ya da **bileşen planı** oluşturabiliriz.

Hangi modülden başlamak istersin? Örneğin: “Dashboard istatistikleri”, “Sipariş listesi” ya da “Kullanıcı listesi”?