# Anastasia Massage - Frontend Uygulama Dökümanı

## 🌐 Teknolojiler
Bu frontend projesi aşağıdaki ana teknolojilerle geliştirilecektir:

- **Next.js** (App Router ile)
- **TypeScript** (tam tip güvenliği)
- **Redux Toolkit** (global state yönetimi)
- **Styled Components** (modüler arasi şık stiller)
- **Axios** (API istekleri)
- **Framer Motion** (animasyonlar)
- **React Hook Form + Yup** (form doğrulama)
- **JWT tabanlı Auth yapısı** (token auth)
- **Responsive tasarım + mobil uyumlulu
---

## 📅 Randevu Modülü (Appointments)
- [ ] Randevu alma formu: isim, email, telefon, hizmet, tarih, saat, not
- [ ] Takvim entegrasyonu (datepicker)
- [ ] İstek atılınca: `POST /appointments`
- [ ] Kullanıcıya bildirim ve e-posta gönderimi
- [ ] Admin panelde görüntüleme (table/list style)
- [ ] Randevu durumu güncelleme: confirmed / cancelled

## 🌟 Hizmetler Modülü (Services)
- [ ] Kartlar halinde gösterim (Styled Components + animasyon)
- [ ] Detay sayfası (slug bazlı route)
- [ ] Admin panel: hizmet ekle/güncelle/sil
- [ ] Resim yükleme (multiple image upload - preview)

## 🛎 Mağaza Modülü (Products & Shop)
- [ ] "Sepete ekle" fonksiyonelliği (Redux Toolkit ile)
- [ ] Ürün detay sayfası
- [ ] Sepet sayfası: artır/azalt/sil/toplam fiyat
- [ ] Sipariş formu + doğrulama
- [ ] Sipariş sonucu: e-posta + bildirim
- [ ] Admin panel: ürün CRUD

## 💳 Siparişler (Orders)
- [ ] Kullanıcının kendi siparişlerini görmesi ("Hesabım" sayfasında)
- [ ] Admin panel: sipariş durumu güncelleme, teslim edildi bilgisi

## 📰 Blog
- [ ] Blog listesi ve filtreleme
- [ ] Detay sayfası + şık markdown render
- [ ] Admin için yeni blog yazısı ekleme, silme

## ✉️ E-Posta Sistemi
- [ ] Formlardan sonra otomatik e-posta tetikleme (Redux thunk veya middleware ile)
- [ ] Admin panelde gelen kutusu ("Okundu/Okunmadı" sistemi)

## 🔔 Bildirim Sistemi
- [ ] Redux Toolkit slice: notification queue
- [ ] UI görseli: alert/modal/toast yapıları (styled-component ile)
- [ ] Admin bildirim listesi (Dashboard)

## 🪨 Kullanıcı Paneli
- [ ] Profili görme ve güncelleme
- [ ] Profil resmi yükleme (preview + upload)
- [ ] Şifre değiştirme formu
- [ ] Bildirim tercihleri (e-posta, sms)

## 🤝 Diğer Modül Bağlantıları
- [ ] SSS (FAQ) sayfası: Accordion yapısı
- [ ] Geri bildirim formu + listeleme
- [ ] Kupon kodu kullanma alanı (Checkout sırasında)
- [ ] Galeri sayfası: grid + lightbox
- [ ] Ayarlar modülü: footer bilgileri, sosyal medya linkleri vs.

---

## 🔍 Routing Yapısı (Next.js App Router)
- `/` → Anasayfa
- `/services` → Hizmetler
- `/shop` → Ürünler
- `/cart` → Sepet
- `/appointments` → Randevu formu
- `/blog` → Blog listesi
- `/blog/[slug]` → Blog detayı
- `/account` → Kullanıcı paneli (profil/siparişler)
- `/admin` → Admin panel (auth korumalı)

## 🤧 Auth Yapısı
- Giriş / Kayıt sayfaları
- JWT token depolama: HTTP-only cookie
- Oturum kontrolü: Redux + middleware

## 💡 Entegrasyon Önerileri
- Cloudinary / AWS S3: görsel yükleme
- EmailJS veya backend Nodemailer API
- Zustand veya TanStack Query ile alternatif state yapısı
- ThemeProvider ile karanlık/aydınlık tema

---

Bu plan frontend geliştirme sürecini modüler bazında organize etmene yardımcı olur. Her modül, backend yapısına birebir uyumludur. Hazırsan birlikte adım adım ekranları tasarlamaya başlayabiliriz ✨

