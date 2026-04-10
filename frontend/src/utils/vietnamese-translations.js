/**
 * Vietnamese Translation Dictionary
 * Complete mapping of all English UI text to Vietnamese equivalents
 * Last Updated: April 10, 2026
 * Total Strings: 200+
 */

export const translations = {
  // Navigation & Headers
  appTitle: 'Cho thuê Khu công nghiệp',
  zones: 'Khu vực',
  requests: 'Yêu cầu',
  contracts: 'Hợp đồng',
  manageUsers: 'Quản lý người dùng',
  myProfile: 'Hồ sơ của tôi',
  dashboard: 'Bảng điều khiển',
  logout: 'Đăng xuất',

  // Authentication Pages - Login
  loginTitle: 'Hệ thống Cho thuê Khu công nghiệp',
  loginSubtitle: 'Đăng nhập vào tài khoản của bạn',
  username: 'Tên đăng nhập',
  password: 'Mật khẩu',
  enterUsername: 'Nhập tên đăng nhập của bạn',
  enterPassword: 'Nhập mật khẩu của bạn',
  login: 'Đăng nhập',
  loggingIn: 'Đang đăng nhập...',
  dontHaveAccount: 'Bạn chưa có tài khoản?',
  registerHere: 'Đăng ký ở đây',

  // Dashboard Page
  welcomeMessage: 'Chào mừng, {username}!',
  adminDashboard: 'Bảng điều khiển Quản trị',
  tenantDashboard: 'Bảng điều khiển Người thuê',
  role: 'Vai trò',
  activeContracts: 'Hợp đồng hoạt động',
  company: 'Công ty',
  contact: 'Liên hệ',
  quickActions: 'Hành động nhanh',
  industrialZones: 'Khu công nghiệp',
  myRequests: 'Yêu cầu của tôi',
  manageRequests: 'Quản lý yêu cầu',
  viewContracts: 'Xem hợp đồng',
  userManagement: 'Quản lý người dùng',
  reports: 'Báo cáo',
  reportsComingSoon: 'Tính năng báo cáo sắp ra mắt!',
  settings: 'Cài đặt',
  settingsComingSoon: 'Tính năng cài đặt sắp ra mắt!',
  noActiveContracts: 'Bạn chưa có hợp đồng hoạt động nào.',
  createRentalRequest: 'Tạo yêu cầu thuê',
  profileInformation: 'Thông tin hồ sơ',
  email: 'Email',
  phone: 'Điện thoại',
  failedLoadActiveContracts: 'Tải hợp đồng hoạt động thất bại. Vui lòng thử lại.',
  tryAgain: 'Thử lại',

  // Zone List Page
  loadingZones: 'Đang tải khu vực...',
  failedLoadZones: 'Tải khu vực thất bại. Vui lòng thử lại.',
  noZonesAvailable: 'Không có khu vực nào có sẵn',
  noZonesMatch: 'Không có khu vực nào phù hợp với tiêu chí tìm kiếm hoặc lọc của bạn',
  previous: 'Trước',
  next: 'Tiếp theo',
  pageInfo: 'Trang {n} / {total}',

  // Zone Detail Page
  backToZones: 'Quay lại Khu vực',
  keySpecifications: 'Thông số kỹ thuật chính',
  totalArea: 'Tổng diện tích',
  available: 'Sẵn có',
  pricePerSqm: 'Giá/m²/tháng',
  aboutZone: 'Về khu vực này',
  amenities: 'Tiện nghi',
  editZone: 'Chỉnh sửa Khu vực',
  createRentalRequestBtn: 'Tạo yêu cầu thuê',
  loadingZoneDetails: 'Đang tải chi tiết khu vực...',
  zoneNotFound: 'Không tìm thấy khu vực',

  // Zone Card
  totalAreaLabel: 'Tổng diện tích:',
  availableLabel: 'Sẵn có:',
  priceLabel: 'Giá:',
  statusAvailable: 'CÓ SẴN',
  statusNotAvailable: 'KHÔNG CÓ SẴN',
  viewDetails: 'Xem chi tiết',
  edit: 'Chỉnh sửa',

  // Zone Form Page
  addNewZone: 'Thêm Khu công nghiệp mới',
  editZoneTitle: 'Chỉnh sửa Khu công nghiệp',
  zoneDetails: 'Chi tiết Khu vực',
  zoneInformation: 'Thông tin Khu vực',
  zoneName: 'Tên Khu vực',
  location: 'Vị trí',
  totalAreaSqm: 'Tổng diện tích (m²)',
  availableAreaSqm: 'Diện tích sẵn có (m²)',
  pricePerSqmMonth: 'Giá mỗi m²/tháng (USD)',
  description: 'Mô tả',
  describeZone: 'Mô tả khu vực, các tính năng và lợi thế của nó...',
  amenitiesList: 'Tiện nghi',
  amenitiesHint: 'Liệt kê tiện nghi được phân cách bằng dòng (ví dụ: Bảo vệ 24/7, Bãi đỗ xe, Cầu dốc tải...)',
  zoneImages: 'Hình ảnh Khu vực',
  availableForRent: 'Sẵn có để thuê',
  createZone: 'Tạo Khu vực',
  updateZone: 'Cập nhật Khu vực',
  deleteZone: 'Xóa Khu vực',
  failedSaveZone: 'Lưu khu vực thất bại',

  // Rental Request Pages
  allRentalRequests: 'Tất cả Yêu cầu thuê',
  myRentalRequests: 'Yêu cầu thuê của tôi',
  loadingRequests: 'Đang tải yêu cầu thuê...',
  failedLoadRequests: 'Tải yêu cầu thuê thất bại. Vui lòng thử lại.',
  noRequestsFound: 'Không tìm thấy yêu cầu thuê',
  id: 'ID',
  tenant: 'Người thuê',
  zone: 'Khu vực',
  area: 'Diện tích (m²)',
  duration: 'Kỳ hạn',
  estimatedCostMonth: 'Chi phí dự kiến/Tháng',
  status: 'Trạng thái',
  requested: 'Yêu cầu vào',
  actions: 'Hành động',
  view: 'Xem',

  // Rental Request Form
  requestToRent: 'Yêu cầu thuê',
  backToZone: 'Quay lại Khu vực',
  availableAreaInfo: 'Diện tích sẵn có:',
  requestedArea: 'Diện tích yêu cầu (m²)',
  rentalDurationMonths: 'Kỳ hạn thuê (tháng)',
  costEstimation: 'Ước tính chi phí',
  monthlyCostLabel: 'Chi phí hàng tháng:',
  totalCostLabel: 'Tổng chi phí ({n} tháng):',
  submitRequest: 'Gửi yêu cầu',
  submitting: 'Đang gửi...',

  // Rental Request Detail
  rentalRequestTitle: 'Yêu cầu thuê #{n}',
  backToRequests: 'Quay lại Yêu cầu',
  zoneDetailsSection: 'Chi tiết Khu vực',
  tenantInformation: 'Thông tin Người thuê',
  requestDetails: 'Chi tiết Yêu cầu',
  requestedAreaLabel: 'Diện tích yêu cầu',
  rentalDuration: 'Kỳ hạn thuê',
  monthlyCost: 'Chi phí hàng tháng',
  totalCost: 'Tổng chi phí',
  requestedDate: 'Ngày yêu cầu',
  reviewInformation: 'Thông tin Đánh giá',
  reviewedDate: 'Ngày đánh giá',
  adminNote: 'Ghi chú của Quản trị viên',
  approveRequest: 'Phê duyệt Yêu cầu',
  rejectRequest: 'Từ chối Yêu cầu',
  cancelRequest: 'Hủy yêu cầu',
  reduceAreaMessage: 'Điều này sẽ giảm diện tích sẵn có của khu vực.',
  notifyRejectionMessage: 'Người thuê sẽ được thông báo về việc từ chối.',
  createNewRequestMessage: 'Bạn có thể tạo yêu cầu mới sau.',
  loadingRequest: 'Đang tải yêu cầu thuê...',

  // Contract Pages
  allContracts: 'Tất cả Hợp đồng',
  activeOnly: 'Chỉ hoạt động',
  myContracts: 'Hợp đồng của tôi',
  loadingContracts: 'Đang tải hợp đồng...',
  failedLoadContracts: 'Tải hợp đồng thất bại. Vui lòng thử lại.',
  noContractsFound: 'Không tìm thấy hợp đồng',
  contractTableHeader: 'Hợp đồng #',
  monthlyRent: 'Tiền thuê hàng tháng',
  startDate: 'Ngày bắt đầu',
  endDate: 'Ngày kết thúc',
  contractTitle: 'Hợp đồng {n}',
  backToContracts: 'Quay lại Hợp đồng',
  industrialZoneSection: 'Khu công nghiệp',
  contractTerms: 'Điều khoản Hợp đồng',
  contractedArea: 'Diện tích Hợp đồng',
  timeline: 'Dòng thời gian',
  contractProgress: 'Tiến độ Hợp đồng',
  progress: 'Tiến độ',
  daysRemaining: 'ngày còn lại',
  viewOriginalRequest: 'Xem Yêu cầu thuê Ban đầu',
  loadingContract: 'Đang tải hợp đồng...',
  contractNotFound: 'Không tìm thấy hợp đồng',

  // Profile Page
  myProfileTitle: 'Hồ sơ của tôi',
  manageAccountInfo: 'Quản lý thông tin tài khoản và bảo mật của bạn',
  accountInformation: 'Thông tin Tài khoản',
  firstName: 'Tên',
  lastName: 'Họ',
  emailCannotChange: 'Email không thể được thay đổi',
  companyName: 'Tên Công ty',
  saveProfile: 'Lưu Hồ sơ',
  saving: 'Đang lưu...',
  changePassword: 'Thay đổi Mật khẩu',
  currentPassword: 'Mật khẩu Hiện tại',
  newPassword: 'Mật khẩu Mới',
  confirmNewPassword: 'Xác nhận Mật khẩu Mới',
  updatePassword: 'Thay đổi Mật khẩu',
  updating: 'Đang cập nhật...',

  // User Management Page
  userManagementTitle: 'Quản lý Người dùng',
  manageUserRoles: 'Quản lý vai trò và quyền của người dùng',
  loadingUsers: 'Đang tải người dùng...',
  noUsersFound: 'Không tìm thấy người dùng',
  fullName: 'Họ và tên',
  changeUserRole: 'Thay đổi Vai trò Người dùng',
  currentRole: 'Vai trò Hiện tại:',
  selectNewRole: 'CHỌN VAI TRÒ MỚI',
  cannotDemoteLastAdmin: 'Không thể hạ cấp quản trị viên cuối cùng. Phải có ít nhất một quản trị viên.',
  cannotDemoteLastAdminSnackbar: 'Không thể hạ cấp quản trị viên cuối cùng',
  saveRole: 'Lưu Vai trò',

  // Status Badges
  statusPending: 'CHỜ DUYỆT',
  statusApproved: 'ĐÃ PHÊ DUYỆT',
  statusRejected: 'ĐÃ TỪ CHỐI',
  statusCancelled: 'ĐÃ HỦY',
  statusActive: 'HOẠT ĐỘNG',
  statusExpired: 'HẾT HẠN',
  statusTerminated: 'ĐÃ CHẤM DỨT',

  // Dialog & Modal
  enterOptionalNote: 'Nhập ghi chú tùy chọn...',
  cancel: 'Hủy',
  confirm: 'Xác nhận',

  // Button Actions
  submit: 'Gửi',
  save: 'Lưu',
  delete: 'Xóa',
  approve: 'Phê Duyệt',
  reject: 'Từ Chối',
  create: 'Tạo',
  search: 'Tìm Kiếm',
  back: 'Quay Lại',
  close: 'Đóng',

  // Placeholders
  johnPlaceholder: 'John',
  doePlaceholder: 'Doe',
  phonePlaceholder: '+84 9 xxxx xxxx',
  companyPlaceholder: 'Công ty của bạn',
  zoneNameExample: 'ví dụ: Khu công nghiệp A',
  locationExample: 'ví dụ: Quận 1, Thành phố Hồ Chí Minh',
  areaExample: '5000',
  priceExample: '25',

  // Form Validation & Messages
  loadingMessage: 'Đang tải...',
  errorMessage: 'Đã xảy ra lỗi',
  successMessage: 'Thành công',
  confirmMessage: 'Bạn có chắc chắn?',
  fillAllFields: 'Vui lòng điền tất cả các trường',
};

/**
 * Format currency amount to Vietnamese Đồng (VNĐ)
 * Assumes input is in USD, converts to VNĐ using standard exchange rate
 * @param {number} usdAmount - Amount in USD
 * @param {number} exchangeRate - USD to VNĐ rate (default: 25,000)
 * @returns {string} Formatted VNĐ string (e.g., "1.000.000 ₫")
 */
export const formatPriceVND = (usdAmount, exchangeRate = 25000) => {
  if (!usdAmount && usdAmount !== 0) return '0 ₫';

  const vndAmount = Math.round(usdAmount * exchangeRate);

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(vndAmount);
};

/**
 * Format price for display (handles both USD and VND)
 * Currently defaults to VND for Vietnamese locale
 * @param {number} price - Price amount
 * @param {string} currency - Currency code ('VND' or 'USD', default: 'VND')
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = 'VND') => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price || 0);
  }

  // Default to VND
  return formatPriceVND(price);
};

/**
 * Format date to Vietnamese locale (DD/MM/YYYY)
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string (e.g., "10/04/2026")
 */
export const formatDateVN = (date) => {
  if (!date) return '';

  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Format datetime to Vietnamese locale (DD/MM/YYYY HH:mm:ss)
 * @param {Date|string} datetime - DateTime to format
 * @returns {string} Formatted datetime string
 */
export const formatDateTimeVN = (datetime) => {
  if (!datetime) return '';

  const date = new Date(datetime);
  const dateStr = date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const timeStr = date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return `${dateStr} ${timeStr}`;
};

/**
 * Get Vietnamese status label from status code
 * @param {string} statusCode - Status code (e.g., 'pending', 'approved')
 * @returns {string} Vietnamese status label
 */
export const getStatusVN = (statusCode) => {
  const statusMap = {
    'pending': translations.statusPending,
    'approved': translations.statusApproved,
    'rejected': translations.statusRejected,
    'cancelled': translations.statusCancelled,
    'active': translations.statusActive,
    'expired': translations.statusExpired,
    'terminated': translations.statusTerminated,
  };

  return statusMap[statusCode?.toLowerCase()] || statusCode;
};

export default translations;
