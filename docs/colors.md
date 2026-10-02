# Hệ Thống Màu JUJISTU (Color System)

Tài liệu chi tiết về toàn bộ hệ thống màu sắc, mã màu HEX/RGBA, token nguyên bản (primitives), màu ngữ nghĩa (semantic tokens), và dải chuyển màu (gradients) đang được sử dụng trong codebase JUJISTU Mobile.

Vị trí mã nguồn định nghĩa trong dự án:
- **Primitives**: [`src/shared/theme/tokens/colors.ts`](file:///c:/Users/Microsoft/Documents/ReactNative/jujistu-app/src/shared/theme/tokens/colors.ts)
- **Semantic Colors**: [`src/shared/theme/semantic/colors.ts`](file:///c:/Users/Microsoft/Documents/ReactNative/jujistu-app/src/shared/theme/semantic/colors.ts)
- **Semantic Gradients**: [`src/shared/theme/semantic/gradients.ts`](file:///c:/Users/Microsoft/Documents/ReactNative/jujistu-app/src/shared/theme/semantic/gradients.ts)
- **Theme Entrypoint**: [`src/shared/theme/index.ts`](file:///c:/Users/Microsoft/Documents/ReactNative/jujistu-app/src/shared/theme/index.ts)

---

## 1. Bảng Màu Nguyên Bản (Primitive Tokens)

`primitiveColors` là tập hợp các giá trị màu thô độc lập với ngữ cảnh hiển thị, được phân chia theo thang sắc độ.

### 1.1. Thang Màu Trung Tính (Neutral Scale)

| Token Key | Giá Trị HEX | Minh Họa | Mô Tả Sắc Độ |
| :--- | :--- | :---: | :--- |
| `primitiveColors.neutral[0]` | `#FFFFFF` | ![](https://via.placeholder.com/16/FFFFFF/FFFFFF.png) | Trắng tuyệt đối (Pure White) |
| `primitiveColors.neutral[50]` | `#E3E3E3` | ![](https://via.placeholder.com/16/E3E3E3/E3E3E3.png) | Trắng ngà / Xám rất nhạt |
| `primitiveColors.neutral[100]` | `#C2C2C2` | ![](https://via.placeholder.com/16/C2C2C2/C2C2C2.png) | Xám sáng (Light Grey) |
| `primitiveColors.neutral[200]` | `#9E9E9E` | ![](https://via.placeholder.com/16/9E9E9E/9E9E9E.png) | Xám trung tính nhạt |
| `primitiveColors.neutral[300]` | `#7D7F84` | ![](https://via.placeholder.com/16/7D7F84/7D7F84.png) | Xám tro (Slate / Muted Grey) |
| `primitiveColors.neutral[550]` | `#434343` | ![](https://via.placeholder.com/16/434343/434343.png) | Xám đậm (Surface sự kiện) |
| `primitiveColors.neutral[600]` | `#3D3D3D` | ![](https://via.placeholder.com/16/3D3D3D/3D3D3D.png) | Xám viền đậm (Strong border) |
| `primitiveColors.neutral[650]` | `#323232` | ![](https://via.placeholder.com/16/323232/323232.png) | Xám bề mặt nổi (End gradient) |
| `primitiveColors.neutral[700]` | `#2C2C2C` | ![](https://via.placeholder.com/16/2C2C2C/2C2C2C.png) | Xám tối (Dark surface) |
| `primitiveColors.neutral[750]` | `#292929` | ![](https://via.placeholder.com/16/292929/292929.png) | Bề mặt nổi (Surface Elevated / Nút phụ) |
| `primitiveColors.neutral[800]` | `#222222` | ![](https://via.placeholder.com/16/222222/222222.png) | Bề mặt phụ & Viền mặc định |
| `primitiveColors.neutral[825]` | `#1C1C1C` | ![](https://via.placeholder.com/16/1C1C1C/1C1C1C.png) | Bề mặt tối sâu (Start gradient) |
| `primitiveColors.neutral[850]` | `#191919` | ![](https://via.placeholder.com/16/191919/191919.png) | Bề mặt thẻ tiêu chuẩn (Surface) |
| `primitiveColors.neutral[900]` | `#0C0C0C` | ![](https://via.placeholder.com/16/0C0C0C/0C0C0C.png) | Nền chính ứng dụng (Canvas) |
| `primitiveColors.neutral[1000]` | `#000000` | ![](https://via.placeholder.com/16/000000/000000.png) | Đen tuyền (Deep Black) |

### 1.2. Thang Màu Đỏ (Red Scale)

| Token Key | Giá Trị HEX | Minh Họa | Mô Tả |
| :--- | :--- | :---: | :--- |
| `primitiveColors.red[400]` | `#FF3A5E` | ![](https://via.placeholder.com/16/FF3A5E/FF3A5E.png) | Đỏ tươi cảnh báo / Lỗi (Error state) |
| `primitiveColors.red[500]` | `#BA2025` | ![](https://via.placeholder.com/16/BA2025/BA2025.png) | Đỏ thương hiệu / Hành động chính (Primary Action) |
| `primitiveColors.red[700]` | `#A70100` | ![](https://via.placeholder.com/16/A70100/A70100.png) | Đỏ đậm (Điểm bắt đầu của Gradient nút chính) |

### 1.3. Thang Màu Cam (Orange Scale - Accent)

| Token Key | Giá Trị HEX | Minh Họa | Mô Tả |
| :--- | :--- | :---: | :--- |
| `primitiveColors.orange[500]` | `#FE8B33` | ![](https://via.placeholder.com/16/FE8B33/FE8B33.png) | Cam rực rỡ - Điểm nhấn thương hiệu (Brand Accent) |

### 1.4. Màu Trong Suốt (Alpha / Opacity Channels)

| Token Key | Giá Trị RGBA | Minh Họa | Mô Tả |
| :--- | :--- | :---: | :--- |
| `primitiveColors.alpha.white10` | `rgba(255, 255, 255, 0.10)` | - | Trắng 10% độ mờ (Dùng cho viền mảnh `border.subtle`) |
| `primitiveColors.alpha.black80` | `rgba(0, 0, 0, 0.80)` | - | Đen 80% độ mờ (Lớp phủ backdrop `background.overlay`) |

---

## 2. Hệ Màu Ngữ Nghĩa (Semantic Colors)

Màu ngữ nghĩa (`semanticColors`) gắn liền với mục đích sử dụng cụ thể trên giao diện. Toàn bộ UI component phải sử dụng các token này thay vì gọi mã HEX trực tiếp.

### 2.1. Nền & Bề Mặt (`semanticColors.background`)

| Thuộc Tính | Token Ánh Xạ | Giá Trị | Mục Đích Sử Dụng |
| :--- | :--- | :--- | :--- |
| `canvas` | `neutral[900]` | `#0C0C0C` | Nền mặc định cho toàn bộ màn hình ứng dụng |
| `canvasDeep` | `neutral[1000]` | `#000000` | Nền đen tuyền cho player video hoặc màn hình đặc thù |
| `surface` | `neutral[850]` | `#191919` | Bề mặt thẻ (cards), danh sách (lists), hộp thoại |
| `surfaceSubtle` | `neutral[800]` | `#222222` | Bề mặt phụ hoặc phần tử thứ cấp |
| `surfaceElevated` | `neutral[750]` | `#292929` | Bề mặt nổi bật, thẻ được nâng cấp hoặc tương tác |
| `eventSurface` | `neutral[550]` | `#434343` | Bề mặt hiển thị thẻ sự kiện / banner ngắn hạn |
| `overlay` | `alpha.black80` | `rgba(0, 0, 0, 0.80)` | Lớp phủ làm tối nền khi mở Modal, Popup, Sheet |

### 2.2. Chữ & Văn Bản (`semanticColors.text`)

| Thuộc Tính | Token Ánh Xạ | Giá Trị | Mục Đích Sử Dụng |
| :--- | :--- | :--- | :--- |
| `primary` | `neutral[0]` | `#FFFFFF` | Tiêu đề chính, văn bản có độ ưu tiên cao nhất |
| `secondary` | `neutral[100]` | `#C2C2C2` | Nội dung văn bản phụ, mô tả ngắn |
| `tertiary` | `neutral[300]` | `#7D7F84` | Placeholder input, ghi chú mờ, ngày tháng |
| `accent` | `orange[500]` | `#FE8B33` | Nhãn làm nổi bật, số dư, link hoặc CTA text |
| `error` | `red[400]` | `#FF3A5E` | Thông báo lỗi form, validation message |
| `inverse` | `neutral[900]` | `#0C0C0C` | Chữ đảo màu (dùng khi hiển thị trên nền sáng) |

### 2.3. Biểu Tượng (`semanticColors.icon`)

| Thuộc Tính | Token Ánh Xạ | Giá Trị | Mục Đích Sử Dụng |
| :--- | :--- | :--- | :--- |
| `primary` | `neutral[0]` | `#FFFFFF` | Icon điều hướng chính, action icon |
| `secondary` | `neutral[100]` | `#C2C2C2` | Icon phụ, tab bar khi không chọn |
| `tertiary` | `neutral[300]` | `#7D7F84` | Icon vô hiệu hóa hoặc độ ưu tiên thấp |
| `error` | `red[400]` | `#FF3A5E` | Icon cảnh báo lỗi |
| `inverse` | `neutral[900]` | `#0C0C0C` | Icon trên nền sáng |

### 2.4. Đường Viền (`semanticColors.border`)

| Thuộc Tính | Token Ánh Xạ | Giá Trị | Mục Đích Sử Dụng |
| :--- | :--- | :--- | :--- |
| `default` | `neutral[800]` | `#222222` | Viền mặc định ngăn cách container, divider |
| `subtle` | `alpha.white10` | `rgba(255, 255, 255, 0.10)` | Viền kính mờ tinh tế cho các card bo góc |
| `strong` | `neutral[600]` | `#3D3D3D` | Viền ngăn rõ ràng giữa các phân vùng lớn |
| `accent` | `orange[500]` | `#FE8B33` | Viền khi input được focus hoặc option được chọn |
| `error` | `red[400]` | `#FF3A5E` | Viền khi trường nhập dữ liệu xảy ra lỗi |

### 2.5. Hành Động & Tương Tác (`semanticColors.action`)

| Thuộc Tính | Token Ánh Xạ | Giá Trị | Mục Đích Sử Dụng |
| :--- | :--- | :--- | :--- |
| `primary` | `red[500]` | `#BA2025` | Màu đơn sắc của nút hành động chính (Primary Button fallback) |
| `secondary` | `neutral[750]` | `#292929` | Màu nền của nút hành động phụ (Secondary Button) |

### 2.6. Trạng Thái Hệ Thống (`semanticColors.status`)

| Thuộc Tính | Token Ánh Xạ | Giá Trị | Mục Đích Sử Dụng |
| :--- | :--- | :--- | :--- |
| `error` | `red[400]` | `#FF3A5E` | Trạng thái thất bại, lỗi nhập liệu, cảnh báo nguy hiểm |

> [!NOTE]
> **Trạng thái chưa có token chính thức**: Các trạng thái `success`, `warning`, `info` hiện **chưa có token riêng** trong thiết kế. Theo quy ước của dự án, các component (`AppToast`, `AppAnswerOption`, v.v.) sẽ fallback về kiểu dáng **neutral** thay vì tự ý thêm mã màu xanh/vàng chưa duyệt.

---

## 3. Dải Chuyển Màu Ngữ Nghĩa (Semantic Gradients)

Được cấu hình sẵn cho các thư viện render gradient (như `react-native-linear-gradient` hoặc SVG Gradient).

### 3.1. Dải Màu Hành Động Chính (`semanticGradients.action.primary`)

Dùng cho nút bấm chính (Primary CTA Button), thanh tiến trình (Progress bar), viền sáng active.

- **Start**: `#A70100` (`primitiveColors.red[700]`)
- **End**: `#FE8B33` (`primitiveColors.orange[500]`)
- **Hướng thông thường**: Từ trái sang phải hoặc chéo 45 độ (`start: { x: 0, y: 0 }`, `end: { x: 1, y: 0 }`).

### 3.2. Dải Màu Bề Mặt Nổi (`semanticGradients.surface.quickAction`)

Dùng cho thẻ thao tác nhanh (Quick Action tiles) tại màn hình Trang chủ (Home).

- **Start**: `#1C1C1C` (`primitiveColors.neutral[825]`)
- **End**: `#323232` (`primitiveColors.neutral[650]`)

---

## 4. Hướng Dẫn Sử Dụng Trong Mã Nguồn

### Cách 1: Sử dụng Hook `useAppTheme` trong Functional Component

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@jujistu/shared/theme';

export const MyComponent: React.FC = () => {
  const { colors, gradients } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.surface }]}>
      <Text style={[styles.title, { color: colors.text.primary }]}>
        Tiêu đề màn hình
      </Text>
      <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
        Mô tả nội dung ngắn
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
  },
});
```

### Cách 2: Sử dụng trực tiếp `semanticColors` trong `StyleSheet.create` tĩnh

```tsx
import { StyleSheet } from 'react-native';
import { semanticColors } from '@jujistu/shared/theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: semanticColors.background.surface,
    borderColor: semanticColors.border.default,
    borderWidth: 1,
    padding: 16,
  },
  errorText: {
    color: semanticColors.text.error,
  },
});
```

---

## 5. Quy Tắc Bắt Buộc (Architecture & Design Discipline)

1. **Không sử dụng mã màu trực tiếp (hardcoded HEX)**: Tuyệt đối không viết `#FFFFFF`, `#000000`, hay mã màu lạ trực tiếp trong JSX/StyleSheet của UI component. Luôn tham chiếu qua `semanticColors` hoặc `colors`.
2. **Ưu tiên Semantic trước Primitives**: Chỉ sử dụng `semanticColors` cho giao diện người dùng. Không import trực tiếp `primitiveColors` vào tầng screen hoặc feature component.
3. **Giữ tính nhất quán Dark Mode**: JUJISTU được thiết kế theo chủ đề Dark Theme cao cấp, với màu nền chuẩn `canvas` (`#0C0C0C`) và các lớp `surface` theo độ tương phản đã được kiểm định độ tương thích tiếp cận (accessibility contrast).
