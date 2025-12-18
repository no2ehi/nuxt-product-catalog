# راهنمای Virtual Scrolling در Product Catalog

## 📚 توضیحات کامل Virtual Scrolling

### تفاوت Virtual Scrolling و Lazy Loading

#### **Lazy Loading (روش قبلی)**

- همه المنت‌های لود شده در DOM هستند
- با scroll کردن، داده‌های جدید fetch می‌شوند
- برای لیست‌های متوسط (چند ده تا چند صد آیتم) مناسب است
- مشکل: با افزایش تعداد المنت‌ها، DOM سنگین می‌شود و performance کاهش می‌یابد

#### **Virtual Scrolling (روش جدید)**

- فقط المنت‌های **visible** در viewport را render می‌کند
- المنت‌های خارج از viewport از DOM حذف می‌شوند
- تعداد المنت‌های DOM ثابت می‌ماند (مثلاً 10-20 المنت)
- برای لیست‌های بزرگ (هزاران آیتم) مناسب است
- مزیت: Performance بهتر، استفاده کمتر از memory

---

## 🔧 پیاده‌سازی فعلی

### کتابخانه استفاده شده

- **@tanstack/vue-virtual**: کتابخانه مدرن و به‌روز برای Vue 3
- TypeScript support کامل
- Performance بهینه

### کامپوننت‌های ایجاد شده

#### 1. `VirtualProductGrid.vue`

کامپوننت اصلی که virtual scrolling را پیاده‌سازی می‌کند:

**ویژگی‌ها:**

- ✅ Grid layout responsive (1-4 ستون بر اساس screen size)
- ✅ فقط المنت‌های visible را render می‌کند
- ✅ Infinite scroll خودکار (وقتی به انتهای لیست می‌رسید)
- ✅ Dynamic height measurement برای هر row
- ✅ Overscan برای scroll نرم‌تر (3 row اضافی)

**پارامترها:**

```typescript
interface Props {
  products: Product[]; // لیست محصولات
  hasMore?: boolean; // آیا محصولات بیشتری وجود دارد؟
  isLoadingMore?: boolean; // آیا در حال لود کردن هستیم؟
  onLoadMore?: () => void; // Callback برای لود کردن بیشتر
}
```

#### 2. تغییرات در `index.vue`

- حذف IntersectionObserver قدیمی
- استفاده از VirtualProductGrid به جای ProductGrid
- Infinite scroll توسط virtual scrolling handle می‌شود

---

## 🎯 نحوه کار Virtual Scrolling

### 1. محاسبه Rows

```typescript
// تعداد ستون‌ها بر اساس screen size
const columnCount = ref(getColumnCount()); // 1-4

// تعداد rows = تعداد محصولات / تعداد ستون‌ها
const totalRows = computed(() => {
  return Math.ceil(props.products.length / itemsPerRow.value);
});
```

### 2. Virtualizer Setup

```typescript
const rowVirtualizer = useVirtualizer({
  count: totalRows.value, // تعداد کل rows
  getScrollElement: () => containerRef.value, // المنت scroll
  estimateSize: () => 450, // ارتفاع تقریبی هر row
  overscan: 3, // تعداد rows اضافی برای render
});
```

### 3. Render فقط المنت‌های Visible

```vue
<!-- فقط rows visible را render می‌کند -->
<ul v-for="virtualRow in rowVirtualizer.getVirtualItems()">
  <!-- محصولات این row -->
</ul>
```

### 4. Infinite Scroll

```typescript
// وقتی به 2 row آخر می‌رسیم، load more trigger می‌شود
if (lastVisibleRow >= totalRowsValue - 2) {
  props.onLoadMore?.();
}
```

---

## 📊 Performance Benefits

### قبل (Lazy Loading):

- 100 محصول = 100 المنت در DOM
- 1000 محصول = 1000 المنت در DOM
- Memory usage: بالا
- Render time: کندتر با افزایش تعداد

### بعد (Virtual Scrolling):

- 100 محصول = ~10-15 المنت در DOM (فقط visible)
- 1000 محصول = ~10-15 المنت در DOM (فقط visible)
- Memory usage: ثابت و پایین
- Render time: سریع و ثابت

---

## 🎨 Responsive Grid

Virtual scrolling با grid layout responsive کار می‌کند:

- **Mobile (< 640px)**: 1 ستون
- **Tablet (640px - 1024px)**: 2 ستون
- **Desktop (1024px - 1280px)**: 3 ستون
- **Large Desktop (≥ 1280px)**: 4 ستون

---

## 🔍 نکات مهم

### 1. Container Height

```vue
<!-- Container با fixed max-height -->
<div style="max-height: calc(100vh - 300px); min-height: 600px;">
```

### 2. Dynamic Measurement

- Virtualizer به صورت خودکار ارتفاع هر row را اندازه‌گیری می‌کند
- با تغییر اندازه window، column count به‌روزرسانی می‌شود

### 3. Overscan

- 3 row اضافی بالا و پایین render می‌شود
- برای scroll نرم‌تر و جلوگیری از flickering

### 4. Infinite Scroll Integration

- وقتی به 2 row آخر می‌رسیم، `onLoadMore` صدا زده می‌شود
- Debounced برای جلوگیری از multiple calls

---

## 🚀 استفاده

کامپوننت به صورت خودکار استفاده می‌شود:

```vue
<VirtualProductGrid
  :products="products"
  :has-more="hasMore"
  :is-loading-more="isLoadingMore"
  :on-load-more="() => fetchProducts(false)"
/>
```

---

## 📝 خلاصه تغییرات

1. ✅ نصب `@tanstack/vue-virtual`
2. ✅ ساخت `VirtualProductGrid.vue`
3. ✅ تغییر `index.vue` برای استفاده از virtual scrolling
4. ✅ حذف IntersectionObserver قدیمی
5. ✅ ترکیب infinite scroll با virtual scrolling

---

## 🐛 Troubleshooting

### مشکل: المنت‌ها render نمی‌شوند

- بررسی کنید که `containerRef` به درستی set شده باشد
- مطمئن شوید که container height مشخص است

### مشکل: Infinite scroll کار نمی‌کند

- بررسی کنید که `hasMore` و `onLoadMore` به درستی pass شده باشند
- Console را برای errors چک کنید

### مشکل: Grid layout به هم می‌ریزد

- بررسی کنید که `itemsPerRow` به درستی محاسبه می‌شود
- مطمئن شوید که CSS grid classes درست هستند

---

## 📚 منابع

- [@tanstack/vue-virtual Documentation](https://tanstack.com/virtual/latest)
- [Virtual Scrolling Explained](https://web.dev/virtualize-long-lists-react-window/)
