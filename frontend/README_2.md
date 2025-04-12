# 🧠 Redux Toolkit Slice Kullanım Kılavuzu – Anastasia Massage

Bu doküman, proje kapsamında oluşturulan Redux slice'larının her birini açıklamakta ve ne amaçla, nasıl kullanılacağını örneklerle detaylandırmaktadır.


## 1. 🔐 `authSlice`
**Amaç:** Kullanıcı girişi, çıkışı ve token yönetimi.

**Kullanım:**
```ts
const dispatch = useAppDispatch();
dispatch(login({ email, password }));
```
**State:**
- `user`: Giriş yapan kullanıcı bilgisi
- `token`: JWT token

---

## 2. 👤 `profileSlice`
**Amaç:** Kullanıcının kendi profil bilgilerini görüntülemesi ve güncellemesi.

**Kullanım:**
```ts
dispatch(fetchMyProfile());
dispatch(updateMyProfile({ name, email }));
```

---

## 3. 👥 `userCrudSlice`
**Amaç:** Admin panelde tüm kullanıcıların listelenmesi, düzenlenmesi, silinmesi.

**Kullanım:**
```ts
dispatch(getUsers());
dispatch(updateUser({ id, data }));
```

---

## 4. 🧭 `userStatusSlice`
**Amaç:** Kullanıcının online/durum bilgisini takip etmek.

**Kullanım:** Admin statü yönetimi ya da analiz panellerinde kullanılabilir.

---

## 5. 🛒 `cartSlice`
**Amaç:** Kullanıcının alışveriş sepetini yönetmek (ürün ekleme, çıkarma, miktar güncelleme).

**Kullanım:**
```ts
dispatch(addToCart({ productId, quantity }));
dispatch(fetchCart());
```

---

## 6. 💆 `servicesSlice`
**Amaç:** Masaj hizmetlerini listeleme, ekleme, güncelleme, silme.

**Kullanım:**
```ts
dispatch(getAllServices());
dispatch(createService(data));
```

---

## 7. 📅 `appointmentsSlice`
**Amaç:** Kullanıcının randevu alması, admin tarafında tüm randevuların yönetilmesi.

**Kullanım:**
```ts
dispatch(createAppointment(data));
dispatch(getAllAppointments());
```

---

## 8. 🛍️ `productsSlice`
**Amaç:** Ürünleri (yağ, krem vb.) yönetmek.

**Kullanım:**
```ts
dispatch(getAllProducts());
dispatch(updateProduct({ id, data }));
```

---

## 9. 🧾 `ordersSlice`
**Amaç:** Sipariş oluşturma, siparişlerin listelenmesi ve durum güncellemesi.

**Kullanım:**
```ts
dispatch(createOrder(orderData));
dispatch(getAllOrders());
```

---

## 10. ✍️ `blogSlice`
**Amaç:** Blog yazılarını yönetmek.

**Kullanım:**
```ts
dispatch(getAllBlogs());
dispatch(createBlog(formData));
```

---

## 11. 🔔 `notificationSlice`
**Amaç:** Sistem bildirimlerini yönetmek (admin paneli).

**Kullanım:**
```ts
dispatch(getAllNotifications());
dispatch(deleteNotification(id));
```

---

## 12. 💬 `feedbackSlice`
**Amaç:** Kullanıcı geri bildirimlerini listeleme, yayınlama ve silme.

**Kullanım:**
```ts
dispatch(createFeedback(data));
dispatch(getAllFeedbacks());
```

---

## 13. ⚙️ `settingsSlice`
**Amaç:** Genel sistem ayarlarını yönetmek (örneğin site başlığı, footer bilgisi).

**Kullanım:**
```ts
dispatch(getAllSettings());
dispatch(upsertSetting({ key, value }));
```

---

## 14. 📧 `emailSlice`
**Amaç:** E-posta gönderme, gelen kutusunu listeleme ve yönetme.

**Kullanım:**
```ts
dispatch(sendTestEmail(data));
dispatch(getAllMails());
```

---

## 15. 🖼️ `gallerySlice`
**Amaç:** Galeri resim ve videolarını listelemek, eklemek, silmek.

**Kullanım:**
```ts
dispatch(getAllGalleryItems());
dispatch(uploadGalleryItem(formData));
```

---

## 16. ❓ `faqSlice`
**Amaç:** Sıkça Sorulan Sorular modülünü yönetmek.

**Kullanım:**
```ts
dispatch(getAllFAQs());
dispatch(createFAQ(data));
```

---

## 17. 🎟️ `couponSlice`
**Amaç:** Kupon kodu oluşturma, silme, güncelleme.

**Kullanım:**
```ts
dispatch(fetchCoupons());
dispatch(createCoupon(data));
```

---

## 18. 📦 `stockSlice`
**Amaç:** Ürün stok kayıtlarını oluşturmak, listelemek, silmek.

**Kullanım:**
```ts
dispatch(getAllStocks());
dispatch(createStock(data));
```

---

## 19. 📊 `dashboardSlice`
**Amaç:** Admin panelinde istatistikleri göstermek.

**Kullanım:**
```ts
dispatch(getDashboardStats());
```

---

## 20. 🧾 `accountSlice`
**Amaç:** Kullanıcının kendi hesabı üzerinden profil ve parola yönetimi.

**Kullanım:**
```ts
dispatch(updateMyPassword({ currentPassword, newPassword }));
dispatch(updateNotificationSettings(data));
```

---

## 21. 📩 `contactMessageSlice`
**Amaç:** Ziyaretçiler tarafından gönderilen iletişim mesajlarını admin tarafında yönetmek.

**Kullanım:**
```ts
dispatch(getAllMessages());
dispatch(deleteMessage(id));
```
Admin paneline "E-Posta Modülü" eklemek, hem gelen kutusunu yönetmek hem de manuel e-posta gönderimlerini yapmak için çok faydalı olur. Şu anda backend ve frontend slice yapın buna zaten oldukça uygun durumda. Aşağıda **email modülü için neler yapılabileceğini** adım adım öneriyorum:

---

## 📬 Admin Panel – E-Posta Modülü Özellikleri

### 1. **📥 Gelen Kutusu (Inbox)**
- `GET /emails`: Tüm gelen mesajları listeler.
- `GET /emails/:id`: Belirli bir e-posta mesajını detaylı şekilde gösterir.
- `PUT /emails/:id/mark`: Okundu / okunmadı olarak işaretler.
- `DELETE /emails/:id`: E-postayı siler.

**Kullanım:**
- Sidebar'da "📬 Gelen Kutusu" menü başlığı
- Listeleme tablosu: Gönderen adı, konu, tarih, okundu/okunmadı etiketi
- Filtreleme: Okundu / Okunmadı / Tarih aralığı
- Detay modal veya sayfa: Tam mesajı okuma ve hızlı aksiyonlar

---

### 2. **✉️ E-Posta Gönder (Send Email)**
- `POST /emails/send-test`: Belirtilen adrese HTML içerikli test e-postası gönderir.

**Kullanım:**
- "Yeni E-Posta" butonu
- Gerekli alanlar:
  - `Kime (to)`
  - `Konu (subject)`
  - `İleti (message)`
- Gönderimden sonra toast mesajı: ✅ Başarıyla gönderildi

---

### 3. **🔁 E-Postaları Manuel Yenileme**
- `GET /emails/fetch`: Yeni gelen e-postaları mail sunucusundan çekmek için tetiklenir.
- Arka planda `imap` gibi bir servis çalışıyorsa elle tetiklemek gerekebilir.

**Kullanım:**
- "📥 Yenile" butonu
- Yenileme sonrası toast bildirimi: `"Yeni e-postalar kontrol ediliyor..."`

---

### 4. **🔧 Gelişmiş Özellikler (Opsiyonel)**
- 📎 Ek dosya destekli gönderim (attachment)
- 🗃️ Kategori/etiket sistemi (Örn: Randevu, Sipariş, Geri Bildirim)
- 👥 Yanıtla / İlet fonksiyonu
- 📊 E-posta istatistikleri (okunan mesaj sayısı, en sık gelen alanlar)

---

## 🔧 Frontend'de Kullanım Önerileri

- `emailSlice.ts` zaten hazır ✅
- Aşağıdaki sayfaları oluşturabilirsin:

| Sayfa / Bileşen Adı       | Açıklama |
|--------------------------|----------|
| `EmailInboxPage.tsx`     | Tüm gelen mailleri listeleyen ana ekran |
| `EmailDetailsModal.tsx`  | Seçilen e-posta detayını gösterir |
| `EmailComposeForm.tsx`   | Yeni e-posta oluşturma formu |
| `EmailToolbar.tsx`       | Okundu/okunmadı butonları, silme, yenileme |

---

## ✅ Önerilen Sayfa Başlıkları

- **Gelen Kutusu (Inbox)**
- **Yeni E-Posta Gönder**
- **Okunmamışlar**
- **Silinenler (Opsiyonel)**

---

İstersen bu yapının `EmailInboxPage`, `EmailDetailsModal` ve `EmailComposeForm` gibi bileşenlerini birlikte yazabiliriz. Panelin görsel düzenini de Tailwind + Shadcn ile modern şekilde planlayabiliriz.

Hazırsan ilk bileşenden başlayalım mı? Yoksa bu modül dışında başka bir alana mı geçelim?
---

✅ Bu slice yapısı sayesinde frontend tarafında her bir backend modülüne doğrudan entegre olunmuştur. Her slice ayrı bir domain'e hizmet eder ve sade state yapısıyla kolay test edilebilir, yeniden kullanılabilir hale gelir.

