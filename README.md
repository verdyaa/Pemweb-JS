# Express + Prisma Products CRUD API

Proyek REST API menggunakan **Express.js** dan **Prisma ORM** (SQLite) dengan pemisahan **Route** dan **Controller**.

## Struktur Proyek

```
├── index.js                         # Entry point & konfigurasi Express
├── prisma/
│   └── schema.prisma                # Skema database Prisma (model Product)
├── routes/
│   └── productRoutes.js             # Definisi endpoint /products
├── controllers/
│   └── productController.js         # Logika CRUD dengan PrismaClient
├── test.js                          # Pengujian otomatis (GET, POST, PUT, DELETE, Validasi & 404)
└── README.md
```

## Cara Menjalankan

1. **Install dependencies & sinkronisasi database:**
   ```bash
   npm install
   npx prisma db push
   ```
2. **Jalankan server:**
   ```bash
   npm start
   ```
   Server berjalan di `http://localhost:3000`.
3. **Buka Prisma Studio (untuk screenshot database Before–After):**
   ```bash
   npx prisma studio
   ```
4. **Jalankan pengujian otomatis:**
   ```bash
   npm test
   ```

## Daftar Endpoint

| Method | Endpoint | Body JSON | Deskripsi | Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/products` | - | Menampilkan seluruh data produk | `200 OK` |
| `GET` | `/products/:id` | - | Menampilkan detail produk berdasarkan `id` | `200 OK` / `404` |
| `POST` | `/products` | `{ "name": "...", "price": 1000 }` | Membuat data produk baru | `201 Created` / `400` |
| `PUT` | `/products` *(atau `/products/:id`)* | `{ "id": 1, "name": "...", "price": 2000 }` | Mengupdate data yang sudah ada | `200 OK` / `400` / `404` |
| `DELETE` | `/products/:id` *(atau `/products`)* | `{ "id": 1 }` *(opsional jika via URL)* | Menghapus data berdasarkan `id` | `200 OK` / `400` / `404` |

## Skenario Pengujian & Bukti (Laporan Evidence)

Seluruh file screenshot tersimpan di folder [`screenshots/`](./screenshots):

### 1. Kondisi Awal Database (Before) & `GET /products` (`200 OK`)
- **Database Before:**
  ![Database Initial](./screenshots/01_db_initial_before.png)
- **GET `/products` (`200 OK`):**
  ![GET All Products](./screenshots/02_get_all_products.png)

### 2. `POST /products` — Membuat Data Baru (`201`), Database After, & Validasi (`400`)
- **POST `/products` Success (`201 Created`):**
  ![POST Success](./screenshots/03_post_create_success.png)
- **Database After POST:**
  ![Database After POST](./screenshots/04_db_after_post.png)
- **POST `/products` Kesalahan Validasi (`400 Bad Request`):**
  ![POST Validation Error](./screenshots/05_post_validation_error.png)

### 3. `PUT /products` — Mengupdate Data (`200`), Database After, & Not Found (`404`)
- **PUT `/products` Success (`200 OK`):**
  ![PUT Success](./screenshots/06_put_update_success.png)
- **Database After PUT:**
  ![Database After PUT](./screenshots/07_db_after_put.png)
- **PUT `/products` ID Tidak Ditemukan (`404 Not Found`):**
  ![PUT 404](./screenshots/08_put_not_found_404.png)

### 4. `DELETE /products/:id` — Menghapus Data (`200`), Database After, & Not Found (`404`)
- **DELETE `/products/2` Success (`200 OK`):**
  ![DELETE Success](./screenshots/09_delete_success.png)
- **Database After DELETE:**
  ![Database After DELETE](./screenshots/10_db_after_delete.png)
- **DELETE `/products/999` ID Tidak Ditemukan (`404 Not Found`):**
  ![DELETE 404](./screenshots/11_delete_not_found_404.png)
