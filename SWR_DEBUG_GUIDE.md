# راهنمای دیباگ SWR

این راهنما به شما کمک می‌کند تا متوجه شوید که SWR درست کار می‌کند یا نه.

## ویژگی‌های SWR

### پارامترهای قابل تنظیم:

| پارامتر             | پیش‌فرض  | توضیح                                         |
| ------------------- | -------- | --------------------------------------------- |
| `key`               | -        | کلید یکتا برای کش (اجباری)                    |
| `fetcher`           | -        | تابع برای دریافت داده (اجباری)                |
| `staleTime`         | 5 دقیقه  | مدت زمانی که داده تازه محسوب می‌شود           |
| `cacheTime`         | 30 دقیقه | مدت زمان نگهداری داده در کش                   |
| `immediate`         | `true`   | آیا بلافاصله fetch شود؟                       |
| `revalidateOnMount` | `false`  | آیا هنگام mount دوباره fetch شود؟             |
| `revalidateOnFocus` | `false`  | آیا هنگام focus کردن window دوباره fetch شود؟ |

### مثال استفاده:

```typescript
const { data, pending, error, status, refresh, invalidate } = useSWR({
  key: `product-${productId}`,
  fetcher: () => api.getProduct(productId),
  staleTime: 60000, // 1 دقیقه
  cacheTime: 300000, // 5 دقیقه
});
```

## روش‌های فعال‌سازی Debug Mode

### روش 1: از طریق Console مرورگر (ساده‌ترین روش)

1. صفحه را باز کنید
2. Console مرورگر را باز کنید (F12)
3. این کد را اجرا کنید:

```javascript
window.__SWR_DEBUG__ = true;
```

4. حالا تمام لاگ‌های SWR در Console نمایش داده می‌شوند

### روش 2: مشاهده وضعیت کش

برای مشاهده وضعیت کش در Console:

```javascript
// Import در کد
import { getSWRCacheStats, invalidateSWRCache } from "~/composables/useSWR.composable";

// یا در Console
// وضعیت کش را ببینید
console.log(getSWRCacheStats());

// خروجی نمونه:
// {
//   size: 3,
//   keys: ['product-1', 'product-2', 'categories'],
//   entries: [
//     { key: 'product-1', timestamp: 1702..., age: 5000, hasError: false },
//     ...
//   ]
// }

// پاک کردن کل کش
invalidateSWRCache();

// پاک کردن یک کلید خاص
invalidateSWRCache("product-1");
```

### روش 3: از طریق Environment Variable

در فایل `.env` یا `.env.local`:

```env
VITE_SWR_DEBUG=true
```

سپس سرور را restart کنید.

## چه چیزهایی را می‌توانید ببینید؟

### 1. لاگ‌های خودکار در Console

وقتی Debug Mode فعال باشد، این اطلاعات در Console نمایش داده می‌شوند:

- **Initialization**: وقتی SWR برای اولین بار initialize می‌شود
- **Cache Hit**: وقتی داده از کش برگردانده می‌شود (بدون fetch جدید)
- **Stale Data**: وقتی داده از کش برگردانده می‌شود ولی revalidation در پس‌زمینه انجام می‌شود
- **Pending State**: وقتی در حال fetch کردن است
- **Data Loaded**: وقتی داده‌ها با موفقیت لود شدند
- **Error**: اگر خطایی رخ دهد
- **Key Changes**: وقتی key تغییر می‌کند (مثلاً وقتی فیلتر تغییر می‌کند)

### مثال خروجی:

```
[SWR] Initializing with key: product-1
[SWR] product-1 - Cache Hit (fresh) - returning cached data
[SWR] product-1 - Data: { id: 1, title: "...", ... }
```

یا در صورت stale بودن:

```
[SWR] Initializing with key: product-1
[SWR] product-1 - Cache Hit (stale) - returning cached data, revalidating in background
[SWR] product-1 - Background revalidation complete
```

### 2. استفاده از useSWRDebug در کامپوننت‌ها

می‌توانید در کامپوننت‌های خود از `useSWRDebug` استفاده کنید:

```vue
<script setup>
import { useSWRDebug } from "~/composables/useSWRDebug.composable";

const { debugSWR } = useSWRDebug();

// در watch یا computed
watch(
  () => data.value,
  (newData) => {
    debugSWR("my-key", newData, pending.value, error.value);
  }
);
</script>
```

## چک‌لیست بررسی کارکرد SWR

### ✅ نشانه‌های کارکرد صحیح:

1. **اولین بازدید**:
   - `pending: true` نمایش داده می‌شود
   - Network request ارسال می‌شود
   - بعد از لود شدن، `pending: false` و `status: success`

2. **بازدید مجدد (قبل از staleTime)**:
   - داده فوری از کش نمایش داده می‌شود
   - `pending: false` از همان ابتدا
   - **هیچ Network request جدیدی نباید ارسال شود** ✨

3. **بازدید مجدد (بعد از staleTime)**:
   - داده فوری از کش نمایش داده می‌شود (stale)
   - در پس‌زمینه Network request ارسال می‌شود
   - بعد از تکمیل، داده جدید جایگزین می‌شود

4. **Key Changes**:
   - وقتی فیلتر یا پارامتر تغییر می‌کند، key باید تغییر کند
   - داده جدید fetch می‌شود

### ❌ نشانه‌های مشکل:

1. **هربار که صفحه را باز می‌کنید fetch می‌شود**:
   - ممکن است key اشتباه باشد یا متفاوت تولید شود
   - `getSWRCacheStats()` را چک کنید

2. **Pending همیشه true**:
   - ممکن است API call fail شده باشد
   - Error را در Console چک کنید

3. **Data همیشه null**:
   - ممکن است API response format درست نباشد
   - Response را در Network tab چک کنید

4. **Error همیشه وجود دارد**:
   - API endpoint را چک کنید
   - CORS یا Network issue را بررسی کنید

## بررسی در DevTools

### Network Tab:

- در DevTools > Network، می‌توانید ببینید که:
  - آیا request ها ارسال می‌شوند؟
  - آیا در بازدید دوم request جدید ارسال می‌شود؟ (نباید بشود اگر staleTime نگذشته)
  - Response status چیست؟
  - Response data چیست؟

### Vue DevTools:

- اگر Vue DevTools نصب دارید، می‌توانید reactive state را ببینید
- `data`, `pending`, `error`, `status` را در component state ببینید

## مثال عملی

برای تست در صفحه Product Detail:

1. Console را باز کنید
2. Network tab را باز کنید و فیلتر را روی Fetch/XHR بگذارید
3. به صفحه `/products/1` بروید
4. باید یک request به API ببینید
5. به صفحه اصلی برگردید
6. **دوباره** به `/products/1` بروید
7. **نباید request جدیدی ببینید** (اگر کمتر از 5 دقیقه گذشته)

### در Console:

```javascript
// وضعیت کش را ببینید
import { getSWRCacheStats } from "~/composables/useSWR.composable";
console.log(getSWRCacheStats());
```

## پاک کردن کش (برای تست)

```javascript
import { invalidateSWRCache } from "~/composables/useSWR.composable";

// پاک کردن کل کش
invalidateSWRCache();

// پاک کردن یک کلید خاص
invalidateSWRCache("product-1");
```

## غیرفعال کردن Debug

برای غیرفعال کردن:

```javascript
window.__SWR_DEBUG__ = false;
```

یا Environment Variable را حذف کنید و سرور را restart کنید.
