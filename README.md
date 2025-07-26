# 🌍 IRL Pro Location Overlay - CLI

**IRL Pro Android uygulaması için gelişmiş GPS tabanlı canlı yayın overlay sistemi** - Localtunnel entegrasyonu ile mobil cihazdan PC'ye konum, hava durumu ve h## 🐛 Sorun Giderme

### "Module not found" Hatası (PC)
```bash
# Node modules'ları yeniden yükle
rm -rf node_modules package-lock.json
npm install
```

### Tunnel Bağlantı Sorunu
- PC'de internet bağlantısını kontrol edin
- Farklı subdomain deneyin
- Servisleri yeniden başlatın
- Firewall/antivirus ayarlarını kontrol edin

### IRL Pro Bağlantı Sorunu
- Android cihazda internet bağlantısını kontrol edin
- GPS izinlerinin verildiğinden emin olun
- IRL Pro'da doğru URL'nin girildiğini kontrol edin
- Localtunnel URL'sinin aktif olduğunu doğrulayın

### GPS Konum Alınamıyor
- Android cihazda GPS'in açık olduğunu kontrol edin
- IRL Pro'ya konum izni verildiğinden emin olun
- Dış mekanda daha iyi GPS sinyali alabilirsiniz
- Uçak modunun kapalı olduğunu kontrol edin

### Overlay Görünmüyor
- OBS'de Browser Source URL'sinin doğru olduğunu kontrol edin
- Localtunnel bağlantısının aktif olduğunu doğrulayın
- Browser Source boyutlarını kontrol edin (800x100)
- F5 ile Browser Source'u yenileyinarır.

## ✨ Özellikler

- 📱 **IRL Pro Android entegrasyonu** - Mobil uygulamadan otomatik GPS verisi
- 🌍 **Gerçek zamanlı konum takibi** - Android GPS'inden canlı konum
- 🌤️ **Canlı hava durumu** - WeatherAPI entegrasyonu
- 🕐 **Otomatik saat dilimi** - TimezoneDB ile konum bazlı saat
- 🚗 **Hız göstergesi** - Hareket halindeyken otomatik görünür
- 🌐 **Localtunnel entegrasyonu** - Mobil cihazdan PC'ye veri aktarımı
- 🎯 **OBS Studio uyumlu** - PC'de Browser Source için optimize edilmiş
- ⚙️ **Kolay kurulum** - İnteraktif CLI kurulum sihirbazı
- 📱 **Responsive tasarım** - Tüm ekran boyutlarına uyumlu

## 🔄 Sistem Mimarisi

```
[Android IRL Pro] → [Internet/Localtunnel] → [PC/OBS Studio]
       ↓                     ↓                      ↓
   GPS Verisi          Tunnel Bağlantısı      Overlay Görüntüsü
```

1. **IRL Pro Android**: GPS konumunu toplar ve gönderir
2. **Localtunnel**: Mobil cihaz ile PC arasında köprü görevi
3. **PC Overlay**: Verileri alır, işler ve OBS'de gösterir

## 🚀 Kurulum ve Kullanım

### 1. PC'de Server Kurulumu

```bash
# Projeyi klonlayın
git clone <repo-url>
cd test-overlay-with-localtunnel

# Bağımlılıkları yükle
npm install

# CLI uygulamasını başlat
npm start
```

### 2. İlk Kurulum (PC)
PC'de CLI uygulaması ilk çalıştırıldığında, gerekli API anahtarlarını girmeniz istenecek:

- **📍 LocationIQ API Key** - Konum adreslerini almak için
- **🌤️ WeatherAPI Key** - Hava durumu bilgileri için  
- **🕐 TimezoneDB API Key** - Saat dilimi bilgileri için

### 3. IRL Pro Android Entegrasyonu

1. **PC'de servisleri başlatın** (CLI menüsünden "Servisleri Başlat")
2. **Localtunnel URL'sini kopyalayın** (Örn: `https://abc123.loca.lt`)
3. **IRL Pro Android uygulamasında**:
   - Overlay ayarlarına gidin
   - Server URL olarak Localtunnel URL'sini girin
   - GPS izinlerini aktifleştirin
   - Yayını başlatın

### 4. OBS Studio'da Görüntüleme

1. **Browser Source** ekleyin
2. **URL**: Localtunnel URL'sini girin (Örn: `https://abc123.loca.lt`)
3. **Width**: `800`, **Height**: `100`
4. IRL Pro'dan gelen GPS verisi otomatik olarak overlay'de görünecek

### 3. API Anahtarları Alma

#### LocationIQ (Ücretsiz: 5,000 request/ay)
1. https://locationiq.com/register adresinden hesap açın
2. Dashboard'dan API key'inizi kopyalayın

#### WeatherAPI (Ücretsiz: 1,000 request/gün)
1. https://weatherapi.com/signup.aspx adresinden hesap açın
2. API key'inizi kopyalayın

#### TimezoneDB (Ücretsiz: 1,000 request/ay)
1. https://timezonedb.com/register adresinden hesap açın  
2. API key'inizi kopyalayın

## 📋 CLI Menü Seçenekleri

- 🚀 **Servisleri Başlat** - HTTP server ve Localtunnel'ı başlatır
- ⏹️ **Servisleri Durdur** - Tüm servisleri kapatır
- ⚙️ **Ayarları Düzenle** - API anahtarları, port, subdomain ayarları
- 🌐 **Overlay'i Tarayıcıda Aç** - Tunnel URL'sini tarayıcıda açar
- 📋 **URL'yi Panoya Kopyala** - Tunnel URL'sini kopyalar
- 📊 **Durumu Yenile** - Mevcut durum bilgilerini gösterir

## 📺 OBS Studio Entegrasyonu

### Browser Source Ayarları:
- **URL**: CLI'da gösterilen Localtunnel URL'si (örn: `https://abc123.loca.lt`)
- **Width**: `800`
- **Height**: `100`
- **Custom CSS**: Gerekirse ek stil düzenlemeleri

### Veri Akışı:
1. **IRL Pro Android** → GPS verisi toplar
2. **Localtunnel** → Mobil cihazdan PC'ye veri aktarımı
3. **PC Overlay** → Verileri işleyip görsel oluşturur
4. **OBS Studio** → Browser Source ile overlay'i yayına ekler

### Overlay Konumu:
- Overlay otomatik olarak sol üst köşede görünür
- CSS ile pozisyon özelleştirilebilir
- Şeffaf arka plan ile diğer elementlerle uyumlu

## 🔧 Gelişmiş Ayarlar

### Subdomain Ayarları
- Özel subdomain belirleyerek sabit URL kullanabilirsiniz
- Örnek: `my-stream-overlay` → `https://my-stream-overlay.loca.lt`
- Boş bırakılırsa rastgele isim atanır

### Port Ayarları
- Varsayılan: `3000`
- 1000-65535 arası herhangi bir port kullanılabilir
- Firewall ayarlarına dikkat edin

### Hız Sınırı
- Varsayılan: `3 km/h`
- Bu değerin üzerinde hız göstergesi görünür
- 0-50 km/h arası ayarlanabilir

## 🛠️ Development

### Development Server
```bash
# Hot reload ile development server
npm run dev

# Standalone server (CLI olmadan)
npm run server
```

### Build Alma
```bash
# Windows için executable
npm run build-win

# Tüm platformlar için build
npm run build-all
```

Build çıktıları `dist/` klasöründe oluşturulur.

## 📂 Proje Yapısı

```
├── cli.js                 # Ana CLI uygulaması
├── server.js             # Development server
├── embedded-server.js    # Production server modülü  
├── public/
│   └── index.html        # Ana overlay dosyası
├── dist/                 # Build çıktıları (ignore)
├── package.json          # NPM ayarları
└── README.md            # Bu dosya
```

## 🌐 Overlay API Detayları

### IRL Pro Android → PC Veri Aktarımı:
Overlay şu teknolojileri kullanır:
- **IRL Pro GPS** - Android cihazdan gerçek zamanlı konum
- **Localtunnel** - Mobil cihaz ile PC arasında güvenli bağlantı
- **LocationIQ API** - Konum → Adres çevirimi
- **WeatherAPI** - Hava durumu bilgileri
- **TimezoneDB API** - Saat dilimi hesaplama

### Veri Güncelleme Sıklığı:
- **GPS verisi**: IRL Pro'dan gerçek zamanlı (1-3 saniye)
- **Hız bilgisi**: Anlık olarak güncellenir
- **Konum/adres**: 5km hareket sonrası yenilenir
- **Hava durumu**: 5km hareket sonrası yenilenir  
- **Saat**: 10 saniyede bir güncellenir

### API Endpoint:
IRL Pro Android uygulaması şu endpoint'e veri gönderir:
```
POST https://your-tunnel-url.loca.lt/location
Content-Type: application/json

{
  "latitude": 41.036667,
  "longitude": 28.985000,
  "speed": 25.5,
  "timestamp": 1672531200000
}
```

## 🔒 Güvenlik

- API anahtarları `settings.json` dosyasında saklanır
- Bu dosya `.gitignore` ile Git'ten hariç tutulur
- Production build'de ayarlar executable içinde gömülüdür

## � Sorun Giderme

### "Module not found" Hatası
```bash
# Node modules'ları yeniden yükle
rm -rf node_modules package-lock.json
npm install
```

### Tunnel Bağlantı Sorunu
- İnternet bağlantınızı kontrol edin
- Farklı subdomain deneyin
- Servisleri yeniden başlatın

### GPS Konum Alınamıyor
- Tarayıcıda konum izni verin
- HTTPS bağlantı gerekli (Localtunnel otomatik HTTPS sağlar)
- Dış mekanda daha iyi sinyal alabilirsiniz

## 📄 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasını inceleyin.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 Destek

Sorularınız için [Issues](https://github.com/username/repo/issues) bölümünü kullanabilirsiniz.
