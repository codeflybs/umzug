# Multi-Service Offerte System

## Docker ile Çalıştırma

1. `backend/.env.docker` dosyasını ihtiyaçlarınıza göre düzenleyin (veya değişkenleri `docker compose` çağrısı sırasında dışarıdan geçin). Üretimde güçlü bir `JWT_SECRET_KEY` kullanmayı unutmayın.
2. İmajları oluşturup servisleri başlatmak için proje kök dizininde:
   ```bash
   docker compose up -d --build
   ```
3. Portlar:
   - Backend API: `http://localhost:8001`
   - Frontend (React + Nginx): `http://localhost:3000`
   - MongoDB: `mongodb://localhost:27017`

### Portainer Üzerinden

- `docker-compose.yml` dosyasını Portainer’daki *Stacks* bölümüne (Web Editor veya Git) yükleyebilir, aynı adımları Portainer arayüzünden uygulayabilirsiniz.
- Gerekli ortam değişkenlerini Portainer stack ayarlarına ekleyin veya `backend/.env.docker` içeriğini referans alın.

### Notlar

- Backend konteyneri `backend/uploads` klasörünü volume olarak paylaşıyor; dosyalar host üzerinde kalıcıdır.
- Geliştirme ortamında farklı portlar kullanacaksanız `REACT_APP_BACKEND_URL` değerini `docker-compose.yml` içindeki `frontend.build.args` bloğunda güncelleyin.
# umzug
# unit-umzug
# unit-umzug
# unit-umzug
# neu
# neu
# umzug
# umzug
# umzug
# umzug
# umzug
