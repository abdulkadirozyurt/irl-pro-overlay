# IRL Pro Location Overlay - Public Assets

Bu klasör IRL Pro Location Overlay uygulamasının frontend dosyalarını içerir.

## 📁 Klasör Yapısı

```
public/
├── index.html              # Ana HTML dosyası
├── css/                    # Stil dosyaları
│   └── styles.css         # Ana CSS stilleri
├── js/                     # JavaScript dosyaları
│   ├── app.js             # Ana uygulama dosyası
│   └── modules/           # JavaScript modülleri
│       ├── config.js      # Konfigürasyon modülü
│       ├── utils.js       # Yardımcı fonksiyonlar
│       ├── api-services.js # API servisleri
│       ├── ui-manager.js  # UI yönetimi
│       └── location-manager.js # Konum yönetimi
└── assets/                 # Statik dosyalar
    └── icons/             # İkon dosyaları
```

## 🎯 Modül Açıklamaları

### Core Files
- **index.html**: Ana HTML yapısı ve modül yüklemeleri
- **css/styles.css**: Tüm görsel stiller ve animasyonlar

### JavaScript Modules
- **js/app.js**: Ana uygulama sınıfı ve koordinatör
- **js/modules/config.js**: API anahtarları ve konfigürasyon
- **js/modules/utils.js**: DOM manipülasyonu ve yardımcı fonksiyonlar
- **js/modules/api-services.js**: Dış API çağrıları ve cache yönetimi
- **js/modules/ui-manager.js**: Kullanıcı arayüzü güncellemeleri
- **js/modules/location-manager.js**: Geolocation ve konum takibi

## 🔄 Modül Yükleme Sırası

JavaScript modülleri şu sırayla yüklenir:
1. config.js (Konfigürasyon)
2. utils.js (Yardımcı fonksiyonlar)
3. api-services.js (API servisleri)
4. ui-manager.js (UI yönetimi)
5. location-manager.js (Konum yönetimi)
6. app.js (Ana uygulama)

## 🛠️ Geliştirme Notları

- Tüm modüller `window` nesnesine bağlıdır
- API anahtarları CLI tarafından dinamik olarak enjekte edilir
- Modüller arası iletişim global namespace üzerinden yapılır
- Her modül kendi sorumluluğuna odaklanır (Single Responsibility Principle)

## 📦 Build Process

Bu dosyalar CLI uygulaması tarafından executable içine paketlenir:
- `pkg` konfigürasyonu `public/**/*` pattern'ini kullanır
- Tüm dosyalar ve klasörler otomatik olarak dahil edilir
- Build sonrası dist klasöründe kopyalanır
