import { GymPackage, SupportContact } from "./types";

export const GYM_PACKAGES: GymPackage[] = [
  {
    id: "basic",
    name: "GÓI CƠ BẢN",
    durationLabel: "GÓI 1 THÁNG",
    priceValue: "500.000đ",
    description: "Tập luyện tự do, không bao gồm huấn luyện viên",
    features: ["Khóa Locker free", "Phòng xông hơi", "Detox free hằng ngày"],
    gradient: "from-zinc-900 via-zinc-800 to-zinc-900",
  },
  {
    id: "standard_6m",
    name: "GÓI TIÊU CHUẨN 6T",
    durationLabel: "GÓI 6 THÁNG",
    priceValue: "2.500.000đ",
    description: "Tập luyện tự do, tặng 2 buổi tập với PT",
    features: ["Khóa Locker free", "Phòng xông hơi", "Detox free hằng ngày"],
    gradient: "from-zinc-900 via-zinc-850 to-zinc-900",
  },
  {
    id: "premium_12m",
    name: "GÓI CAO CẤP 12T",
    durationLabel: "GÓI 12 THÁNG",
    priceValue: "4.500.000đ",
    description: "Tập luyện tự do, tặng 5 buổi PT, có tủ đồ riêng",
    features: ["Khóa Locker free", "Phòng xông hơi", "Detox free hằng ngày"],
    gradient: "from-zinc-900 via-zinc-800 to-zinc-950",
  },
  {
    id: "vip_elite",
    name: "HỘI VIÊN VIP ELITE",
    durationLabel: "GÓI 12 THÁNG",
    priceValue: "12.000.000đ",
    description: "Huấn luyện viên cá nhân 1:1, đầy đủ dịch vụ xông hơi",
    features: ["Khóa Locker free", "Phòng xông hơi", "Detox free hằng ngày"],
    gradient: "from-neutral-900 via-zinc-900 to-neutral-950",
  },
];

export const SUPPORT_CONTACTS: SupportContact[] = [
  {
    id: "tiep_tan",
    name: "TRẦN THỊ TIẾP TÂN",
    roleLabel: "LỄ TÂN & CHĂM SÓC",
    avatarChar: "T",
    bio: "Xin chào! Tôi là Trần Thị Tiếp Tân. Hãy gửi tin nhắn hỗ trợ để tôi tư vấn kĩ lưỡng nhất cho anh/chị nhé.",
    initialMessage: "Xin chào! Tôi là Trần Thị Tiếp Tân (Lễ tân ca sáng). Tôi trực tổng đài hỗ trợ 24/7, rất vui được tư vấn các dịch vụ dời ca, hoàn tiền, kỹ thuật hoặc dinh dưỡng của bạn. Bạn hãy để lại tin nhắn nhé!",
    category: "support",
    isOnline: true,
  },
  {
    id: "huan_luyen",
    name: "NGUYỄN HUÂN LUYỆN",
    roleLabel: "HUẤN LUYỆN VIÊN (PT)",
    avatarChar: "H",
    bio: "Chào bạn! Tôi là Nguyễn Huấn Luyện - PT trưởng FitGym. Nhắn tin cho tôi để được tư vấn lộ trình độ dáng hoàn toàn miễn phí nhé!",
    initialMessage: "Chào bạn mới! Tôi là Nguyễn Huấn Luyện, có 6 năm kinh nghiệm cân đối thể trạng và giảm mỡ chuyên sâu. Tôi có thể tư vấn chế độ Bulking, Cutting hoặc thiết kế các bài tập ngực/bụng riêng cho bạn. Cần tôi trợ giúp gì nào?",
    category: "pt",
    isOnline: true,
  },
  {
    id: "support_technical",
    name: "LÊ HOÀNG KỸ THUẬT",
    roleLabel: "KỸ THUẬT VIÊN THIẾT BỊ",
    avatarChar: "K",
    bio: "Hỗ trợ sửa lỗi thiết bị checkin, thẻ từ NFC, tủ locker thông minh.",
    initialMessage: "Dạ em chào anh/chị! Em phụ trách bảo dưỡng và nâng cấp hệ thống phần mềm của phòng tập FIT GYM. Anh/chị đang gặp vấn đề gì với thẻ số hay cửa Check-in hả anh/chị?",
    category: "support",
    isOnline: false,
  },
];
