# Phase 1: English Text Inventory with Vietnamese Translations

## Overview
Complete audit of all English UI text in React components (27 components + 11 pages). Each entry is mapped to its Vietnamese equivalent for Phase 2 implementation.

**Last Updated**: April 10, 2026  
**Coverage**: 100% of components and pages  
**Total Unique Strings**: ~150+ distinct UI text elements  

---

## Text Inventory Reference Table

### Navigation & Headers

| # | English Text | Vietnamese | Component(s) | Notes | Status |
|---|---|---|---|---|---|
| 1 | Industrial Zone Rental | Cho thuê Khu công nghiệp | Navbar | App title/branding | ⬜ Pending |
| 2 | Zones | Khu vực | Navbar | Navigation link | ⬜ Pending |
| 3 | Requests | Yêu cầu | Navbar | Navigation link | ⬜ Pending |
| 4 | Contracts | Hợp đồng | Navbar | Navigation link | ⬜ Pending |
| 5 | Manage Users | Quản lý người dùng | Navbar | Admin-only link | ⬜ Pending |
| 6 | My Profile | Hồ sơ của tôi | Navbar (dropdown) | User menu item | ⬜ Pending |
| 7 | Dashboard | Bảng điều khiển | Navbar (dropdown) | User menu item | ⬜ Pending |
| 8 | Logout | Đăng xuất | Navbar (dropdown) | User menu item | ⬜ Pending |

### Authentication Pages

| # | English Text | Vietnamese | Component(s) | Notes | Status |
|---|---|---|---|---|---|
| 9 | Industrial Zone Rental System | Hệ thống Cho thuê Khu công nghiệp | LoginPage | Page title | ⬜ Pending |
| 10 | Login to your account | Đăng nhập vào tài khoản của bạn | LoginPage | Page subtitle | ⬜ Pending |
| 11 | Username | Tên đăng nhập | LoginPage, ProfilePage | Form label | ⬜ Pending |
| 12 | Password | Mật khẩu | LoginPage, ProfilePage | Form label | ⬜ Pending |
| 13 | Enter your username | Nhập tên đăng nhập của bạn | LoginPage | Placeholder | ⬜ Pending |
| 14 | Enter your password | Nhập mật khẩu của bạn | LoginPage | Placeholder | ⬜ Pending |
| 15 | Login | Đăng nhập | LoginPage | Button text | ⬜ Pending |
| 16 | Logging in... | Đang đăng nhập... | LoginPage | Loading state | ⬜ Pending |
| 17 | Don't have an account? | Bạn chưa có tài khoản? | LoginPage | Register link prefix | ⬜ Pending |
| 18 | Register here | Đăng ký ở đây | LoginPage | Register link | ⬜ Pending |

### Dashboard Page

| # | English Text | Vietnamese | Component(s) | Notes | Status |
|---|---|---|---|---|---|
| 19 | Welcome, {username}! | Chào mừng, {username}! | DashboardPage | Page greeting | ⬜ Pending |
| 20 | Admin Dashboard | Bảng điều khiển Quản trị | DashboardPage | Subtitle (admin) | ⬜ Pending |
| 21 | Tenant Dashboard | Bảng điều khiển Người thuê | DashboardPage | Subtitle (tenant) | ⬜ Pending |
| 22 | Role | Vai trò | DashboardPage, StatBox | Stat label | ⬜ Pending |
| 23 | Active Contracts | Hợp đồng hoạt động | DashboardPage | Stat/Section label | ⬜ Pending |
| 24 | Company | Công ty | DashboardPage | Stat label | ⬜ Pending |
| 25 | Contact | Liên hệ | DashboardPage | Stat label | ⬜ Pending |
| 26 | Quick Actions | Hành động nhanh | DashboardPage | Section title | ⬜ Pending |
| 27 | Industrial Zones | Khu công nghiệp | DashboardPage | Quick action | ⬜ Pending |
| 28 | My Requests | Yêu cầu của tôi | DashboardPage | Quick action (tenant) | ⬜ Pending |
| 29 | Manage Requests | Quản lý yêu cầu | DashboardPage | Quick action (admin) | ⬜ Pending |
| 30 | View Contracts | Xem hợp đồng | DashboardPage | Quick action | ⬜ Pending |
| 31 | User Management | Quản lý người dùng | DashboardPage | Quick action (admin) | ⬜ Pending |
| 32 | Reports | Báo cáo | DashboardPage | Quick action (admin) | ⬜ Pending |
| 33 | Reports feature coming soon! | Tính năng báo cáo sắp ra mắt! | DashboardPage | Alert text | ⬜ Pending |
| 34 | Settings | Cài đặt | DashboardPage | Quick action (admin) | ⬜ Pending |
| 35 | Settings feature coming soon! | Tính năng cài đặt sắp ra mắt! | DashboardPage | Alert text | ⬜ Pending |
| 36 | You don't have any active contracts yet. | Bạn chưa có hợp đồng hoạt động nào. | DashboardPage | Empty state | ⬜ Pending |
| 37 | Create a Rental Request | Tạo yêu cầu thuê | DashboardPage | Link text | ⬜ Pending |
| 38 | Profile Information | Thông tin hồ sơ | DashboardPage | Section title | ⬜ Pending |
| 39 | Email | Email | DashboardPage, ProfilePage | Field label | ⬜ Pending |
| 40 | Phone | Điện thoại | DashboardPage, ProfilePage | Field label | ⬜ Pending |
| 41 | Logout | Đăng xuất | DashboardPage | Button text | ⬜ Pending |
| 42 | Failed to load active contracts. Please try again. | Tải hợp đồng hoạt động thất bại. Vui lòng thử lại. | DashboardPage | Error message | ⬜ Pending |
| 43 | Try again | Thử lại | DashboardPage | Button text | ⬜ Pending |

### Zone List Page

| # | English Text | Vietnamese | Component(s) | Notes | Status |
|---|---|---|---|---|---|
| 44 | Industrial Zones | Khu công nghiệp | ZoneListPage | Page title | ⬜ Pending |
| 45 | Loading zones... | Đang tải khu vực... | ZoneListPage | Loading state | ⬜ Pending |
| 46 | Failed to load zones. Please try again. | Tải khu vực thất bại. Vui lòng thử lại. | ZoneListPage | Error message | ⬜ Pending |
| 47 | No zones available | ZoneListPage | Empty state (no zones) | ⬜ Pending |
| 48 | No zones match your search or filter criteria | Không có khu vực nào phù hợp với tiêu chí tìm kiếm hoặc lọc của bạn | ZoneListPage | Empty state (filtered) | ⬜ Pending |
| 49 | Previous | Trước | ZoneListPage | Pagination button | ⬜ Pending |
| 50 | Next | Tiếp theo | ZoneListPage | Pagination button | ⬜ Pending |
| 51 | Page {n} of {total} | Trang {n} / {total} | ZoneListPage | Pagination info | ⬜ Pending |

### Zone Detail Page

| # | English Text | Vietnamese | Component(s) | Notes | Status |
|---|---|---|---|---|---|
| 52 | Back to Zones | Quay lại Khu vực | ZoneDetailPage | Button text | ⬜ Pending |
| 53 | Key Specifications | Thông số kỹ thuật chính | ZoneDetailPage | Section title | ⬜ Pending |
| 54 | Total Area | Tổng diện tích | ZoneDetailPage | Field label | ⬜ Pending |
| 55 | Available | Sẵn có | ZoneDetailPage | Field label | ⬜ Pending |
| 56 | Price/m²/mo | Giá/m²/tháng | ZoneDetailPage | Field label | ⬜ Pending |
| 57 | About this Zone | Về khu vực này | ZoneDetailPage | Section title | ⬜ Pending |
| 58 | Amenities | Tiện nghi | ZoneDetailPage | Field label | ⬜ Pending |
| 59 | Edit Zone | Chỉnh sửa Khu vực | ZoneDetailPage | Button text (admin) | ⬜ Pending |
| 60 | Create Rental Request | Tạo yêu cầu thuê | ZoneDetailPage | Button text (tenant) | ⬜ Pending |
| 61 | Loading zone details... | Đang tải chi tiết khu vực... | ZoneDetailPage | Loading state | ⬜ Pending |
| 62 | Zone not found | Không tìm thấy khu vực | ZoneDetailPage | Not found state | ⬜ Pending |

### Zone Card Component

| # | English Text | Vietnamese | Component(s) | Notes | Status |
|---|---|---|---|---|---|
| 63 | Total Area: | Tổng diện tích: | ZoneCard | Spec label | ⬜ Pending |
| 64 | Available: | Sẵn có: | ZoneCard | Spec label | ⬜ Pending |
| 65 | Price: | Giá: | ZoneCard | Spec label | ⬜ Pending |
| 66 | AVAILABLE | CÓ SẴN | ZoneCard | Status badge | ⬜ Pending |
| 67 | NOT AVAILABLE | KHÔNG CÓ SẴN | ZoneCard | Status badge | ⬜ Pending |
| 68 | View Details | Xem chi tiết | ZoneCard | Button text | ⬜ Pending |
| 69 | Edit | Chỉnh sửa | ZoneCard | Button text (admin) | ⬜ Pending |

### Zone Form Page (Create/Edit)

| # | English Text | Vietnamese | Component(s) | Notes | Status |
|---|---|---|---|---|---|
| 70 | Add New Industrial Zone | Thêm Khu công nghiệp mới | ZoneFormPage | Page title (create) | ⬜ Pending |
| 71 | Edit Industrial Zone | Chỉnh sửa Khu công nghiệp | ZoneFormPage | Page title (edit) | ⬜ Pending |
| 72 | Zone Details | Chi tiết Khu vực | ZoneFormPage | Section title | ⬜ Pending |
| 73 | Zone Information | Thông tin Khu vực | ZoneFormPage | Section title (create) | ⬜ Pending |
| 74 | Zone Name | Tên Khu vực | ZoneFormPage | Field label | ⬜ Pending |
| 75 | Location | Vị trí | ZoneFormPage | Field label | ⬜ Pending |
| 76 | Total Area (m²) | Tổng diện tích (m²) | ZoneFormPage | Field label | ⬜ Pending |
| 77 | Available Area (m²) | Diện tích sẵn có (m²) | ZoneFormPage | Field label | ⬜ Pending |
| 78 | Price per m²/month (USD) | Giá mỗi m²/tháng (USD) | ZoneFormPage | Field label | ⬜ Pending |
| 79 | Description | Mô tả | ZoneFormPage | Field label | ⬜ Pending |
| 80 | Describe the zone, its features, and advantages... | Mô tả khu vực, các tính năng và lợi thế của nó... | ZoneFormPage | Placeholder | ⬜ Pending |
| 81 | Amenities | Tiện nghi | ZoneFormPage | Field label | ⬜ Pending |
| 82 | List amenities separated by lines (e.g., Security 24/7, Parking, Loading dock...) | Liệt kê tiện nghi được phân cách bằng dòng (ví dụ: Bảo vệ 24/7, Bãi đỗ xe, Cầu dốc tải...) | ZoneFormPage | Placeholder | ⬜ Pending |
| 83 | Zone Images | Hình ảnh Khu vực | ZoneFormPage | Field label | ⬜ Pending |
| 84 | Available for Rent | Sẵn có để thuê | ZoneFormPage | Checkbox label | ⬜ Pending |
| 85 | Create Zone | Tạo Khu vực | ZoneFormPage | Button text (create) | ⬜ Pending |
| 86 | Update Zone | Cập nhật Khu vực | ZoneFormPage | Button text (edit) | ⬜ Pending |
| 87 | Delete Zone | Xóa Khu vực | ZoneFormPage | Button text (admin) | ⬜ Pending |
| 88 | Failed to save zone | Lưu khu vực thất bại | ZoneFormPage | Error message | ⬜ Pending |

### Rental Request Pages

| # | English Text | Vietnamese | Component(s) | Notes | Status |
|---|---|---|---|---|---|
| 89 | All Rental Requests | Tất cả Yêu cầu thuê | RentalRequestListPage | Page title (admin) | ⬜ Pending |
| 90 | My Rental Requests | Yêu cầu thuê của tôi | RentalRequestListPage | Page title (tenant) | ⬜ Pending |
| 91 | Loading rental requests... | Đang tải yêu cầu thuê... | RentalRequestListPage | Loading state | ⬜ Pending |
| 92 | Failed to load rental requests. Please try again. | Tải yêu cầu thuê thất bại. Vui lòng thử lại. | RentalRequestListPage | Error message | ⬜ Pending |
| 93 | No rental requests found | Không tìm thấy yêu cầu thuê | RentalRequestListPage | Empty state | ⬜ Pending |
| 94 | ID | ID | RentalRequestListPage | Table header | ⬜ Pending |
| 95 | Tenant | Người thuê | RentalRequestListPage | Table header (admin) | ⬜ Pending |
| 96 | Zone | Khu vực | RentalRequestListPage | Table header | ⬜ Pending |
| 97 | Area (m²) | Diện tích (m²) | RentalRequestListPage | Table header | ⬜ Pending |
| 98 | Duration | Kỳ hạn | RentalRequestListPage | Table header | ⬜ Pending |
| 99 | Est. Cost/Month | Chi phí dự kiến/Tháng | RentalRequestListPage | Table header | ⬜ Pending |
| 100 | Status | Trạng thái | RentalRequestListPage | Table header | ⬜ Pending |
| 101 | Requested | Yêu cầu vào | RentalRequestListPage | Table header | ⬜ Pending |
| 102 | Actions | Hành động | RentalRequestListPage | Table header | ⬜ Pending |
| 103 | View | Xem | RentalRequestListPage | Button text | ⬜ Pending |
| 104 | Request to Rent | Yêu cầu thuê | RentalRequestFormPage | Page title | ⬜ Pending |
| 105 | Back to Zone | Quay lại Khu vực | RentalRequestFormPage | Button text | ⬜ Pending |
| 106 | Available Area: | Diện tích sẵn có: | RentalRequestFormPage | Info label | ⬜ Pending |
| 107 | Requested Area (m²) | Diện tích yêu cầu (m²) | RentalRequestFormPage | Field label | ⬜ Pending |
| 108 | Rental Duration (months) | Kỳ hạn thuê (tháng) | RentalRequestFormPage | Field label | ⬜ Pending |
| 109 | Cost Estimation | Ước tính chi phí | RentalRequestFormPage | Section title | ⬜ Pending |
| 110 | Monthly Cost: | Chi phí hàng tháng: | RentalRequestFormPage | Label | ⬜ Pending |
| 111 | Total Cost ({n} months): | Tổng chi phí ({n} tháng): | RentalRequestFormPage | Label | ⬜ Pending |
| 112 | Submit Request | Gửi yêu cầu | RentalRequestFormPage | Button text | ⬜ Pending |
| 113 | Submitting... | Đang gửi... | RentalRequestFormPage | Loading state | ⬜ Pending |

### Rental Request Detail Page

| # | English Text | Vietnamese | Component(s) | Notes | Status |
|---|---|---|---|---|---|
| 114 | Rental Request #{n} | Yêu cầu thuê #{n} | RentalRequestDetailPage | Page title | ⬜ Pending |
| 115 | Back to Requests | Quay lại Yêu cầu | RentalRequestDetailPage | Button text | ⬜ Pending |
| 116 | Zone Details | Chi tiết Khu vực | RentalRequestDetailPage | Section title | ⬜ Pending |
| 117 | Tenant Information | Thông tin Người thuê | RentalRequestDetailPage | Section title (admin) | ⬜ Pending |
| 118 | Request Details | Chi tiết Yêu cầu | RentalRequestDetailPage | Section title | ⬜ Pending |
| 119 | Requested Area | Diện tích yêu cầu | RentalRequestDetailPage | Field label | ⬜ Pending |
| 120 | Rental Duration | Kỳ hạn thuê | RentalRequestDetailPage | Field label | ⬜ Pending |
| 121 | Monthly Cost | Chi phí hàng tháng | RentalRequestDetailPage | Field label | ⬜ Pending |
| 122 | Total Cost | Tổng chi phí | RentalRequestDetailPage | Field label | ⬜ Pending |
| 123 | Requested Date | Ngày yêu cầu | RentalRequestDetailPage | Field label | ⬜ Pending |
| 124 | Review Information | Thông tin Đánh giá | RentalRequestDetailPage | Section title | ⬜ Pending |
| 125 | Reviewed Date | Ngày đánh giá | RentalRequestDetailPage | Field label | ⬜ Pending |
| 126 | Admin Note | Ghi chú của Quản trị viên | RentalRequestDetailPage | Field label | ⬜ Pending |
| 127 | Approve Request | Phê duyệt Yêu cầu | RentalRequestDetailPage | Button text (admin) | ⬜ Pending |
| 128 | Reject Request | Từ chối Yêu cầu | RentalRequestDetailPage | Button text (admin) | ⬜ Pending |
| 129 | Cancel Request | Hủy yêu cầu | RentalRequestDetailPage | Button text (tenant) | ⬜ Pending |
| 130 | This will reduce the zone's available area. | Điều này sẽ giảm diện tích sẵn có của khu vực. | RentalRequestDetailPage | Dialog message | ⬜ Pending |
| 131 | The tenant will be notified of rejection. | Người thuê sẽ được thông báo về việc từ chối. | RentalRequestDetailPage | Dialog message | ⬜ Pending |
| 132 | You can create a new request later. | Bạn có thể tạo yêu cầu mới sau. | RentalRequestDetailPage | Dialog message | ⬜ Pending |
| 133 | Loading rental request... | Đang tải yêu cầu thuê... | RentalRequestDetailPage | Loading state | ⬜ Pending |

### Contract Pages

| # | English Text | Vietnamese | Component(s) | Notes | Status |
|---|---|---|---|---|---|
| 134 | All Contracts | Tất cả Hợp đồng | ContractListPage | Tab title | ⬜ Pending |
| 135 | Active Only | Chỉ hoạt động | ContractListPage | Tab title | ⬜ Pending |
| 136 | My Contracts | Hợp đồng của tôi | ContractListPage | Page title (tenant) | ⬜ Pending |
| 137 | All Contracts | Tất cả Hợp đồng | ContractListPage | Page title (admin) | ⬜ Pending |
| 138 | Loading contracts... | Đang tải hợp đồng... | ContractListPage | Loading state | ⬜ Pending |
| 139 | Failed to load contracts. Please try again. | Tải hợp đồng thất bại. Vui lòng thử lại. | ContractListPage | Error message | ⬜ Pending |
| 140 | No contracts found | Không tìm thấy hợp đồng | ContractListPage | Empty state | ⬜ Pending |
| 141 | Contract # | Hợp đồng # | ContractListPage | Table header | ⬜ Pending |
| 142 | Monthly Rent | Tiền thuê hàng tháng | ContractListPage | Table header | ⬜ Pending |
| 143 | Start Date | Ngày bắt đầu | ContractListPage | Table header | ⬜ Pending |
| 144 | End Date | Ngày kết thúc | ContractListPage | Table header | ⬜ Pending |
| 145 | Contract {n} | Hợp đồng {n} | ContractDetailPage | Page title | ⬜ Pending |
| 146 | Back to Contracts | Quay lại Hợp đồng | ContractDetailPage | Button text | ⬜ Pending |
| 147 | Tenant Information | Thông tin Người thuê | ContractDetailPage | Section title (admin) | ⬜ Pending |
| 148 | Industrial Zone | Khu công nghiệp | ContractDetailPage | Section title | ⬜ Pending |
| 149 | Contract Terms | Điều khoản Hợp đồng | ContractDetailPage | Section title | ⬜ Pending |
| 150 | Contracted Area | Diện tích Hợp đồng | ContractDetailPage | Field label | ⬜ Pending |
| 151 | Duration | Kỳ hạn | ContractDetailPage | Field label | ⬜ Pending |
| 152 | Timeline | Dòng thời gian | ContractDetailPage | Section title | ⬜ Pending |
| 153 | Contract Progress | Tiến độ Hợp đồng | ContractDetailPage | Section title | ⬜ Pending |
| 154 | Progress | Tiến độ | ContractDetailPage | Label | ⬜ Pending |
| 155 | days remaining | ngày còn lại | ContractDetailPage | Label | ⬜ Pending |
| 156 | View Original Rental Request | Xem Yêu cầu thuê Ban đầu | ContractDetailPage | Button text | ⬜ Pending |
| 157 | Loading contract... | Đang tải hợp đồng... | ContractDetailPage | Loading state | ⬜ Pending |
| 158 | Contract not found | Không tìm thấy hợp đồng | ContractDetailPage | Not found state | ⬜ Pending |

### Profile Page

| # | English Text | Vietnamese | Component(s) | Notes | Status |
|---|---|---|---|---|---|
| 159 | My Profile | Hồ sơ của tôi | ProfilePage | Page title | ⬜ Pending |
| 160 | Manage your account information and security | Quản lý thông tin tài khoản và bảo mật của bạn | ProfilePage | Page subtitle | ⬜ Pending |
| 161 | Username | Tên đăng nhập | ProfilePage | Field label | ⬜ Pending |
| 162 | Account Information | Thông tin Tài khoản | ProfilePage | Section title | ⬜ Pending |
| 163 | First Name | Tên | ProfilePage | Field label | ⬜ Pending |
| 164 | Last Name | Họ | ProfilePage | Field label | ⬜ Pending |
| 165 | Email cannot be changed | Email không thể được thay đổi | ProfilePage | Help text | ⬜ Pending |
| 166 | Phone | Điện thoại | ProfilePage | Field label | ⬜ Pending |
| 167 | Company Name | Tên Công ty | ProfilePage | Field label | ⬜ Pending |
| 168 | Save Profile | Lưu Hồ sơ | ProfilePage | Button text | ⬜ Pending |
| 169 | Saving... | Đang lưu... | ProfilePage | Loading state | ⬜ Pending |
| 170 | Change Password | Thay đổi Mật khẩu | ProfilePage | Section title | ⬜ Pending |
| 171 | Current Password | Mật khẩu Hiện tại | ProfilePage | Field label | ⬜ Pending |
| 172 | New Password | Mật khẩu Mới | ProfilePage | Field label | ⬜ Pending |
| 173 | Confirm New Password | Xác nhận Mật khẩu Mới | ProfilePage | Field label | ⬜ Pending |
| 174 | Change Password | Thay đổi Mật khẩu | ProfilePage | Button text | ⬜ Pending |
| 175 | Updating... | Đang cập nhật... | ProfilePage | Loading state | ⬜ Pending |

### User Management Page

| # | English Text | Vietnamese | Component(s) | Notes | Status |
|---|---|---|---|---|---|
| 176 | User Management | Quản lý Người dùng | UserManagementPage | Page title | ⬜ Pending |
| 177 | Manage user roles and permissions | Quản lý vai trò và quyền của người dùng | UserManagementPage | Page subtitle | ⬜ Pending |
| 178 | Loading users... | Đang tải người dùng... | UserManagementPage | Loading state | ⬜ Pending |
| 179 | No users found | Không tìm thấy người dùng | UserManagementPage | Empty state | ⬜ Pending |
| 180 | Full Name | Họ và tên | UserManagementPage | Table header | ⬜ Pending |
| 181 | Edit | Chỉnh sửa | UserManagementPage | Button text | ⬜ Pending |
| 182 | Change User Role | Thay đổi Vai trò Người dùng | UserManagementPage | Dialog title | ⬜ Pending |
| 183 | Current Role: | Vai trò Hiện tại: | UserManagementPage | Label | ⬜ Pending |
| 184 | SELECT NEW ROLE | CHỌN VAI TRÒ MỚI | UserManagementPage | Label | ⬜ Pending |
| 185 | Cannot demote the last administrator. At least one admin must exist. | Không thể hạ cấp quản trị viên cuối cùng. Phải có ít nhất một quản trị viên. | UserManagementPage | Warning message | ⬜ Pending |
| 186 | Cannot demote last admin | Không thể hạ cấp quản trị viên cuối cùng | UserManagementPage | Snackbar message | ⬜ Pending |
| 187 | Save Role | Lưu Vai trò | UserManagementPage | Button text | ⬜ Pending |

### Status Badges

| # | English Text | Vietnamese | Component(s) | Notes | Status |
|---|---|---|---|---|---|
| 188 | PENDING | CHỜ DUYỆT | StatusBadge | Status value | ⬜ Pending |
| 189 | APPROVED | ĐÃ PHÊ DUYỆT | StatusBadge | Status value | ⬜ Pending |
| 190 | REJECTED | ĐÃ TỪ CHỐI | StatusBadge | Status value | ⬜ Pending |
| 191 | CANCELLED | ĐÃ HỦY | StatusBadge | Status value | ⬜ Pending |
| 192 | ACTIVE | HOẠT ĐỘNG | StatusBadge | Status value | ⬜ Pending |
| 193 | EXPIRED | HẾT HẠN | StatusBadge | Status value | ⬜ Pending |
| 194 | TERMINATED | ĐÃ CHẤM DỨT | StatusBadge | Status value | ⬜ Pending |

### Dialog & Modal Text

| # | English Text | Vietnamese | Component(s) | Notes | Status |
|---|---|---|---|---|---|
| 195 | Enter optional note... | Nhập ghi chú tùy chọn... | RentalRequestDetailPage | Placeholder | ⬜ Pending |
| 196 | Cancel | Hủy | RentalRequestDetailPage, UserManagementPage | Button text | ⬜ Pending |
| 197 | Confirm | Xác nhận | RentalRequestDetailPage | Button text | ⬜ Pending |

### Generic Form Labels

| # | English Text | Vietnamese | Component(s) | Notes | Status |
|---|---|---|---|---|---|
| 198 | John | John | ProfilePage | Placeholder | ⬜ Pending |
| 199 | Doe | Doe | ProfilePage | Placeholder | ⬜ Pending |
| 200 | +1 (555) 123-4567 | +84 9 xxxx xxxx | ProfilePage | Placeholder | ⬜ Pending |
| 201 | Your Company Inc. | Công ty của bạn | ProfilePage | Placeholder | ⬜ Pending |
| 202 | e.g., Industrial Zone A | ví dụ: Khu công nghiệp A | ZoneFormPage | Placeholder | ⬜ Pending |
| 203 | e.g., District 1, Ho Chi Minh City | ví dụ: Quận 1, Thành phố Hồ Chí Minh | ZoneFormPage | Placeholder | ⬜ Pending |
| 204 | 5000 | 5000 | ZoneFormPage | Placeholder | ⬜ Pending |
| 205 | 3000 | 3000 | ZoneFormPage | Placeholder | ⬜ Pending |
| 206 | 25 | 25 | ZoneFormPage | Placeholder | ⬜ Pending |

---

## Implementation Notes

### Priority Tiers

**Tier 1 (Critical - User-facing navigation)**
- All navigation menu items (#1-8)
- Authentication text (#9-18)
- Status badges (#188-194)
- Button labels for common actions

**Tier 2 (High - Main content areas)**
- Dashboard section titles & labels
- Page titles and subtitles
- Table headers and common field labels
- Error and loading states

**Tier 3 (Medium - Specific features)**
- Rental request specific text
- Contract-specific labels
- Dialog/modal messages
- Help text and placeholders

### Context-Specific Replacements

1. **Role-based text**: Some UI elements show different text based on admin vs tenant role
   - "My Requests" (tenant) vs "Manage Requests" (admin)
   - Different dashboard cards for admin users

2. **Empty states**: Multiple variations needed
   - When no zones exist
   - When no contracts exist
   - When filters exclude all results

3. **Dynamic values**: These need Vietnamese formatting
   - Dates: Use Vietnamese date format (dd/MM/yyyy)
   - Numbers: Use Vietnamese number format (1.000 instead of 1,000)
   - Currency: VNĐ symbol and formatting

---

## Unresolved Questions

1. **Formal vs Informal Vietnamese**: Should all text use formal/professional tone (Quý vị/Anh/Chị) or informal (bạn)? 
   - Recommendation: Keep informal for user-friendly interface
   
2. **Abbreviations**: For "m²", "USD", should these be localized?
   - Recommendation: Keep technical units as-is (m², VNĐ, USD)

3. **Brand Name**: "Industrial Zone Rental" - should this be translated or kept as brand?
   - Recommendation: Translate for accessibility (Cho thuê Khu công nghiệp)
