/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Dumbbell,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  User,
  Lock,
  CheckCircle,
  Check,
  LogOut,
  X,
  Send,
  Search,
  Sparkles,
  Phone,
  MessageSquare,
  Clock,
  CreditCard,
  LockKeyhole,
  Info,
  Bell,
  Settings,
  Shield,
  Smartphone,
  ExternalLink,
  HelpCircle,
  FileText
} from "lucide-react";
import { UserSession, AppScreen, Message, GymPackage, SupportContact } from "./types";
import { GYM_PACKAGES, SUPPORT_CONTACTS } from "./data";

export default function App() {
  // Mobile device system-level mimics
  const [systetime, setSystetime] = useState("22:30");
  const [language, setLanguage] = useState<"VI" | "EN">("VI");
  
  // App navigation & status
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("LOGIN");
  const [lastScreen, setLastScreen] = useState<AppScreen>("LOGIN"); // for back buttons
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Dynamic user session persistence
  const [session, setSession] = useState<UserSession>({
    fullName: "NAM",
    phoneNumber: "0012312312",
    password: "",
    memberCode: "#0013",
    memberClass: "Hội viên CLASS_PLATINUM",
    isRegistered: false,
    isLoggedIn: false,
    workoutsCount: 0,
  });

  // Selected subscription package status
  const [activePackage, setActivePackage] = useState<GymPackage | null>(null);

  // Forms state
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regOTP, setRegOTP] = useState<string[]>(["", "", "", ""]);
  const [regPass, setRegPass] = useState("");
  const [regConfirmPass, setRegConfirmPass] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);
  
  // Simulated alert notification states (OTP SMS bubble)
  const [showOTPBubble, setShowOTPBubble] = useState(false);
  const [bubbleCountdown, setBubbleCountdown] = useState(10);
  
  // HLV AI Chat state
  const [aiChatMessages, setAiChatMessages] = useState<Message[]>([
    {
      id: "ai-init",
      role: "assistant",
      content: "Chào anh/chị nam! Tôi là Huấn luyện viên thể hình ảo của FIT GYM. Hãy hỏi tôi về lộ trình tập, chế độ ăn kiêng, tăng cơ, giảm cân hoặc thông tin gói tập.",
      timestamp: "Bây giờ",
    },
  ]);
  const [aiInputMessage, setAiInputMessage] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  // Support list & chat view state
  const [activeSupportContact, setActiveSupportContact] = useState<SupportContact>(SUPPORT_CONTACTS[0]);
  const [supportCategoryFilter, setSupportCategoryFilter] = useState<"all" | "pt" | "support">("all");
  const [supportSearchQuery, setSupportSearchQuery] = useState("");
  
  // Message history map for support agents
  const [supportAgentChats, setSupportAgentChats] = useState<Record<string, Message[]>>({
    tiep_tan: [
      {
        id: "msg-init-tt",
        role: "assistant",
        content: SUPPORT_CONTACTS[0].initialMessage,
        timestamp: "Vừa xong",
      }
    ],
    huan_luyen: [
      {
        id: "msg-init-hl",
        role: "assistant",
        content: SUPPORT_CONTACTS[1].initialMessage,
        timestamp: "Vừa xong",
      }
    ],
    support_technical: [
      {
        id: "msg-init-tech",
        role: "assistant",
        content: SUPPORT_CONTACTS[2].initialMessage,
        timestamp: "Hôm qua",
      }
    ]
  });
  const [supportInputMessage, setSupportInputMessage] = useState("");
  const [supportReplyPending, setSupportReplyPending] = useState(false);

  // UI state for showing custom active modal actions the simulator performs
  const [checkoutModalPackage, setCheckoutModalPackage] = useState<GymPackage | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  // Refs for auto scroll in chats
  const aiChatEndRef = useRef<HTMLDivElement>(null);
  const supportChatEndRef = useRef<HTMLDivElement>(null);

  // Auto clock update inside physical shell
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, "0");
      const mins = now.getMinutes().toString().padStart(2, "0");
      setSystetime(`${hrs}:${mins}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // Show Toast messaging helper
  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  // Scroll to bottom in chats
  useEffect(() => {
    aiChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChatMessages, loadingAI]);

  useEffect(() => {
    supportChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [supportAgentChats, supportReplyPending]);

  // Handle triggered OTP countdown trigger
  useEffect(() => {
    let interval: any;
    if (showOTPBubble && bubbleCountdown > 0) {
      interval = setInterval(() => {
        setBubbleCountdown((prev) => prev - 1);
      }, 1000);
    } else if (bubbleCountdown === 0) {
      setShowOTPBubble(false);
    }
    return () => clearInterval(interval);
  }, [showOTPBubble, bubbleCountdown]);

  // Dismiss OTP SMS message immediately if user leaves REGISTER_STEP_2 screen
  useEffect(() => {
    if (currentScreen !== "REGISTER_STEP_2") {
      setShowOTPBubble(false);
    }
  }, [currentScreen]);

  // Simulated auto responses from Support Staff
  const promptSupportStaffReply = (agentId: string, userText: string) => {
    setSupportReplyPending(true);
    setTimeout(() => {
      let replyText = "Cảm ơn anh/chị đã gửi tin nhắn. Em ghi nhận ý kiến và sẽ phản hồi chi tiết cho anh/chị ngay ạ!";
      const userLower = userText.toLowerCase();

      if (agentId === "tiep_tan") {
        if (userLower.includes("gói") || userLower.includes("dk") || userLower.includes("đăng ký")) {
          replyText = "Dạ, để đăng ký gói tập nhanh nhất, anh/chị có thể chọn gói tập ngay trên tab GÓI TẬP ở màn hình này, hoặc đến ngay quầy lễ tân để em hỗ trợ quẹt thẻ kích hoạt tức thì ạ. Đang có chương trình ưu đãi giảm giá tốt đó anh/chị nhé!";
        } else if (userLower.includes("hoàn tiền") || userLower.includes("hủy")) {
          replyText = "Dạ, đối với quy trình hoàn tiền hoặc xin bảo lưu thẻ tập, anh/chị vui lòng mang theo CMND/CCCD bản gốc đến quầy lễ tân chi nhánh chính để quản lý bên em xác nhận tờ khai và duyệt hồ sơ trong vòng 1-3 ngày làm việc ạ.";
        } else if (userLower.includes("giờ") || userLower.includes("mở cửa")) {
          replyText = "Chào anh/chị, FIT GYM mở cửa hoạt động liên tục các ngày trong tuần từ 05:00 sáng đến 22:00 đêm ạ. Chúc anh/chị có một buổi tập luyện hiệu quả!";
        }
      } else if (agentId === "huan_luyen") {
        if (userLower.includes("ngực") || userLower.includes("bài tập")) {
          replyText = "Tập ngực muốn dày và rộng thì ưu tiên đẩy tạ Incline Dumbbell trước nhé bạn ơi. Chú ý khóa bả vai lại để tránh chấn thương khớp vai nha. Chiều qua phòng tập gặp mình, mình chỉ trực tiếp posture cho!";
        } else if (userLower.includes("giảm cân") || userLower.includes("béo") || userLower.includes("mỡ")) {
          replyText = "Chào bạn! Quy tắc cốt lõi là thâm hụt calo (Caloric Deficit). Bạn nên kết hợp tập tạ (khối lượng lớn) cùng 20-30 phút Cardio ở nhịp tim Zone 2 cuối buổi để đốt mỡ hiệu quả nhất.";
        } else if (userLower.includes("protein") || userLower.includes("ăn gì")) {
          replyText = "Bạn nên bổ sung tối thiểu 1.5g Protein mỗi kg trọng lượng cơ thể. Nhóm thực phẩm khuyên dùng gồm: ức gà bỏ da, lòng trắng trứng, thịt bò nạc, cá thu/cá hồi hoặc bột Whey tăng cơ!";
        }
      } else if (agentId === "support_technical") {
        replyText = "Hệ thống Checkin phòng tập vừa được nâng cấp bảo mật. Nếu thẻ số của bạn bị khóa QR, vui lòng chọn mua gói tập bất kỳ trên tab để hệ thống tự động kích hoạt mã QR mở khóa nhé bạn!";
      }

      const agentReply: Message = {
        id: `reply-${Date.now()}`,
        role: "assistant",
        content: replyText,
        timestamp: "Vừa xong",
      };

      setSupportAgentChats((prev) => ({
        ...prev,
        [agentId]: [...(prev[agentId] || []), agentReply],
      }));
      setSupportReplyPending(false);
    }, 1500);
  };

  // Actions handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone) {
      showToast(language === "VI" ? "Vui lòng nhập Số điện thoại!" : "Please enter Phone number!");
      return;
    }
    if (!loginPass) {
      showToast(language === "VI" ? "Vui lòng nhập Mật khẩu!" : "Please enter Password!");
      return;
    }

    // Accept any valid credentials or local registers
    if (
      (loginPhone === "0012312312" && loginPass === "123456") ||
      (session.isRegistered && loginPhone === session.phoneNumber && loginPass === session.password) ||
      loginPhone === "demo" ||
      loginPhone.length >= 4
    ) {
      setSession((prev) => ({
        ...prev,
        phoneNumber: loginPhone === "demo" ? "0012312312" : loginPhone,
        fullName: loginPhone === "demo" ? "KHÁCH QUEN" : prev.fullName,
        isLoggedIn: true,
      }));
      setCurrentScreen("HOME");
      showToast(language === "VI" ? "Đăng nhập thành công!" : "Login successfully!");
    } else {
      showToast(
        language === "VI"
          ? "Số điện thoại hoặc Mật khẩu chưa chính xác! (Nhập 'demo' để vào nhanh)"
          : "Incorrect Phone or Password! (Enter 'demo' to skip)"
      );
    }
  };

  const handleRegisterStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      showToast(language === "VI" ? "Vui lòng nhập Họ và Tên!" : "Please enter Full Name!");
      return;
    }
    if (!regPhone || regPhone.length < 8) {
      showToast(language === "VI" ? "Số điện thoại đăng ký không hợp lệ!" : "Invalid Phone Number!");
      return;
    }

    // Save temporal info
    setSession((prev) => ({
      ...prev,
      fullName: regName.toUpperCase(),
      phoneNumber: regPhone,
    }));

    // Trigger fake SMS drop down banner
    setShowOTPBubble(true);
    setBubbleCountdown(12);

    // Go to next step
    setCurrentScreen("REGISTER_STEP_2");
    showToast(language === "VI" ? "Đã gửi mã đăng ký OTP!" : "OTP registration code sent!");
  };

  const handleOTPAutoFill = () => {
    setRegOTP(["1", "3", "2", "9"]);
    setShowOTPBubble(false);
    showToast(language === "VI" ? "Đã tự động điền mã OTP: 1329!" : "Autofilled OTP: 1329!");
  };

  const handleOTPSingleInput = (val: string, index: number) => {
    if (/^[0-9]$/.test(val) || val === "") {
      const newOTP = [...regOTP];
      newOTP[index] = val;
      setRegOTP(newOTP);
      
      // Auto focus next input
      if (val !== "" && index < 3) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOTPSubmit = () => {
    const fullOtpString = regOTP.join("");
    if (fullOtpString === "1329" || fullOtpString.length === 4) {
      setCurrentScreen("REGISTER_STEP_3");
      showToast(language === "VI" ? "Xác thực OTP thành công!" : "OTP Verified successfully!");
    } else {
      showToast(language === "VI" ? "Mã xác thực không đúng! Hãy nhập 1329 hoặc bấm vào thông báo." : "Incorrect OTP! Try 1329.");
    }
  };

  const handleRegisterStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPass.length < 6) {
      showToast(language === "VI" ? "Mật khẩu tối thiểu 6 ký tự!" : "Password must be at least 6 characters!");
      return;
    }
    if (regPass !== regConfirmPass) {
      showToast(language === "VI" ? "Mật khẩu xách nhận không khớp!" : "Confirm password doesn't match!");
      return;
    }

    // Complete registration
    setSession((prev) => ({
      ...prev,
      password: regPass,
      isRegistered: true,
      isLoggedIn: true,
    }));

    setCurrentScreen("HOME");
    showToast(language === "VI" ? "Thiết lập mật khẩu thành công! Chào mừng hội viên mới!" : "Password set successfully! Welcome!");
  };

  // Sign out helper
  const handleLogoutAction = () => {
    setSession((prev) => ({ ...prev, isLoggedIn: false }));
    setIsDropdownOpen(false);
    setCurrentScreen("LOGIN");
    setLoginPhone("");
    setLoginPass("");
    showToast(language === "VI" ? "Đã đăng xuất tài khoản!" : "Sign out successfully!");
  };

  // API Call to chatbot endpoint
  const sendAIMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiInputMessage.trim()) return;

    const userMessageText = aiInputMessage;
    setAiInputMessage("");

    // Append user message immediately
    const userMsgObj: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userMessageText,
      timestamp: "Bây giờ",
    };
    setAiChatMessages((prev) => [...prev, userMsgObj]);
    setLoadingAI(true);

    try {
      const response = await fetch("/api/gym-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessageText,
          // Exclude first message, just send others
          history: aiChatMessages.slice(1).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      
      const responseMsgObj: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.reply || "Tôi không nghe rõ lắm, bạn có thể giải thích thêm không?",
        timestamp: "Vừa xong",
      };
      setAiChatMessages((prev) => [...prev, responseMsgObj]);
    } catch (err) {
      console.error(err);
      // Fallback response inside client directly
      setTimeout(() => {
        const errorReplyObj: Message = {
          id: `ai-error-${Date.now()}`,
          role: "assistant",
          content: "Để cải thiện cơ bắp nhanh nhất, hãy kết hợp các bài Bench Press và Protein dinh dưỡng đầy đủ bạn nhé. Rất tiếc, AI Coach tạm thời bị gián đoạn mạng, hãy thử lại sau!",
          timestamp: "Hệ thống",
        };
        setAiChatMessages((prev) => [...prev, errorReplyObj]);
      }, 700);
    } finally {
      setLoadingAI(false);
    }
  };

  // Send support agent message
  const sendSupportMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportInputMessage.trim()) return;

    const typedMsg = supportInputMessage;
    setSupportInputMessage("");

    const newMsg: Message = {
      id: `user-support-${Date.now()}`,
      role: "user",
      content: typedMsg,
      timestamp: "Bây giờ",
    };

    const agentId = activeSupportContact.id;
    setSupportAgentChats((prev) => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), newMsg],
    }));

    promptSupportStaffReply(agentId, typedMsg);
  };

  // Confirm check out simulator package
  const handleConfirmPurchase = () => {
    if (checkoutModalPackage) {
      setActivePackage(checkoutModalPackage);
      setCheckoutModalPackage(null);
      showToast(
        language === "VI"
          ? `Mô phỏng: Đã kích hoạt ${checkoutModalPackage.name}!`
          : `Simulated: Activated ${checkoutModalPackage.name}!`
      );
      // Automatically navigate home
      setCurrentScreen("HOME");
    }
  };

  return (
    <div className="min-h-screen bg-[#3C4A50] text-slate-200 font-sans overflow-x-hidden relative selection:bg-[#D2FF00] selection:text-black">
      {/* Centered device layout */}
      <div className="min-h-screen w-full relative z-10 flex flex-col items-center justify-center py-6 px-4">
        {/* Centered phone wrapper */}
        <div className="flex justify-center items-center py-4 relative">
            
            {/* Phone Outer Shell Chassis */}
            <div id="phone-shell-chassis" className="relative shrink-0 w-[385px] h-[795px] bg-slate-950 rounded-[55px] border-[10px] border-slate-900 shadow-[0_0_80px_rgba(0,0,0,0.5)] p-2.5 flex flex-col ring-[12px] ring-slate-900/40">
              
              {/* Phone Physical Volume Keys & Locks */}
              <div className="absolute -left-[10px] top-[140px] w-[5px] h-[45px] bg-slate-800 rounded-l" />
              <div className="absolute -left-[10px] top-[195px] w-[5px] h-[45px] bg-slate-800 rounded-l" />
              <div className="absolute -right-[10px] top-[170px] w-[5px] h-[65px] bg-slate-800 rounded-r" />
  
              {/* Screenglass Overlay */}
              <div className="w-full h-full bg-[#050505] rounded-[45px] relative flex flex-col overflow-hidden text-zinc-300 select-none">
                
                {/* 1. Phone Top Status Bar (Wifi, Clock, Cellular metrics, Notch island) */}
                <div className="w-full h-[44px] shrink-0 bg-slate-950 flex items-center justify-between px-7 relative z-50 border-b border-slate-900/40">
                  {/* Local Updating Clock */}
                  <span className="font-mono text-[13px] font-bold text-slate-200 tracking-widest">{systetime}</span>
                  
                  {/* Capsule Shaped Notch Dynamic Island */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[100px] h-[25px] bg-slate-900 rounded-full flex items-center justify-between px-3 pr-2.5 border border-slate-800/40">
                    {/* Small camera dot and sensor light mimicking modern device */}
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.7)] animate-pulse" />
                  </div>
  
                  {/* Right hand network / battery icons */}
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <span className="text-[10px] font-extrabold tracking-tighter text-[#D2FF00]">5G</span>
                    {/* Simulated solid battery bar in green screen metric outline */}
                    <div className="w-6 h-[11px] border border-slate-700 rounded-sm p-[1px] flex">
                      <div className="h-full w-4/5 rounded-2xs bg-green-400" />
                    </div>
                  </div>
                </div>

                {/* Simulated Toast floating bubble inside phone screen */}
                {toastMessage && (
                  <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-[85%] bg-[#0f1115] border border-[#D2FF00]/30 rounded-xl p-2 px-3 shadow-lg z-[999] flex items-center gap-2 animate-fade-in">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D2FF00] shadow-[0_0_8px_rgba(210,255,0,0.8)]" />
                    <p className="text-[11px] font-semibold font-sans text-slate-100">{toastMessage}</p>
                  </div>
                )}

                {/* Simulating SMS Alert drop down bubble in Step 2 */}
                {showOTPBubble && (
                  <div 
                    onClick={handleOTPAutoFill}
                    className="absolute top-[50px] left-1/2 -translate-x-1/2 w-[90%] bg-black/95 hover:bg-zinc-950 border border-zinc-800 shadow-[0_10px_35px_rgba(0,0,0,0.95)] rounded-2xl p-3.5 z-[1000] cursor-pointer animate-fade-in border-l-4 border-l-[#D2FF00]"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#D2FF00]/10 flex items-center justify-center border border-[#D2FF00]/35">
                          <MessageSquare className="text-[#D2FF00] size-3" />
                        </div>
                        <span className="text-[10px] uppercase font-bold text-zinc-400 font-mono tracking-widest">{language === "VI" ? "TIN NHẮN (SMS)" : "MESSAGE (SMS)"}</span>
                      </div>
                      <span className="text-[9px] text-[#D2FF00] font-mono font-bold animate-pulse">{language === "VI" ? "BÂY GIỜ" : "NOW"}</span>
                    </div>
                    <p className="text-[11px] font-sans text-zinc-200 mt-1.5 leading-relaxed">
                      {language === "VI" ? (
                        <span>Mã OTP kích hoạt dịch vụ FITGYM của bạn là: <strong className="text-[#D2FF00] text-sm select-all font-black">1329</strong>. Không tiết lộ cho bất kỳ ai.</span>
                      ) : (
                        <span>Your FITGYM OTP code is: <strong className="text-[#D2FF00] text-sm select-all font-black">1329</strong>. Do not share it.</span>
                      )}
                    </p>
                    <div className="mt-2 text-center py-1.5 bg-[#D2FF00] hover:bg-[#c6ef00] transition rounded-xl text-black text-[10px] font-bold font-mono tracking-wider shadow-[0_2px_10px_rgba(210,255,0,0.2)]">
                      {language === "VI" ? `[ CHẠM ĐỂ TỰ ĐIỀN OTP ] (${bubbleCountdown}s)` : `[ TOUCH TO AUTO-FILL OTP ] (${bubbleCountdown}s)`}
                    </div>
                  </div>
                )}

                {/* 2. Main Phone Body Viewer Screens */}
                <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col relative bg-slate-950 pb-5">
                  
                  {/* APP BAR TOP NAVIGATION (For logged-in view only) */}
                  {session.isLoggedIn && (
                    <div id="phone-inner-header" className="sticky top-0 h-[55px] shrink-0 bg-black/90 backdrop-blur-md flex items-center justify-between px-5 z-[45] pt-1 border-b border-zinc-900/90 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                      
                      {/* Left logo bar */}
                      <div className="flex items-center gap-1.5">
                        <Dumbbell className="text-[#D2FF00] size-4 rotate-45" />
                        <span className="font-display italic text-lg tracking-wider text-white font-extrabold select-none">
                          FIT<span className="text-[#D2FF00]">.GYM APP</span>
                        </span>
                      </div>

                      {/* Right settings/bell & user avatar drop toggler */}
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Bell className="text-zinc-400 hover:text-white size-4 cursor-pointer transition" />
                          <span className="absolute -top-1 -right-1.5 bg-[#D2FF00] text-black text-[8.5px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-[0_0_6px_rgba(210,255,0,0.4)]">2</span>
                        </div>
                        
                        {/* Avatar Button */}
                        <div className="relative">
                          <button
                             id="avatar-button"
                             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                             className="w-7 h-7 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[#D2FF00] font-bold text-xs flex items-center justify-center duration-150 cursor-pointer shadow-[0_0_8px_rgba(210,255,0,0.1)]"
                          >
                            {session.fullName ? session.fullName[0] : "N"}
                          </button>

                          {/* Profile dropdown matches image 10 precisely */}
                          {isDropdownOpen && (
                            <div className="absolute right-0 top-9 w-[190px] bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl z-[900] p-1.5 backdrop-blur-lg animate-fade-in">
                              
                              {/* Header profile title */}
                              <div className="p-2 border-b border-slate-800/60 mb-1">
                                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">Hội viên PLATINUM</p>
                                <p className="text-xs text-white uppercase font-bold truncate mt-1">{session.fullName || "NAM"}</p>
                              </div>

                              <button
                                onClick={() => {
                                  setIsDropdownOpen(false);
                                  showToast(language === "VI" ? "Xem Hồ sơ cá nhân" : "Viewing Profile");
                                }}
                                className="w-full text-left p-2 hover:bg-slate-800/80 rounded-xl text-slate-350 hover:text-white text-[11px] flex items-center gap-2 duration-150 cursor-pointer"
                              >
                                <User className="size-3.5 text-slate-450" />
                                <span>{language === "VI" ? "Hồ sơ cá nhân" : "Personal profile"}</span>
                              </button>

                              <button
                                onClick={() => {
                                  setIsDropdownOpen(false);
                                  showToast(language === "VI" ? "Lịch sử thanh toán trống" : "Payment history empty");
                                }}
                                className="w-full text-left p-2 hover:bg-slate-800/80 rounded-xl text-slate-350 hover:text-white text-[11px] flex items-center gap-2 duration-150 cursor-pointer"
                              >
                                <CreditCard className="size-3.5 text-slate-450" />
                                <span>{language === "VI" ? "Lịch sử thanh toán" : "Payment history"}</span>
                              </button>

                              <button
                                onClick={() => {
                                  setIsDropdownOpen(false);
                                  showToast(language === "VI" ? "Cửa sổ Cài đặt bảo mật" : "Security Settings");
                                }}
                                className="w-full text-left p-2 hover:bg-slate-800/80 rounded-xl text-slate-350 hover:text-white text-[11px] flex items-center gap-2 duration-150 cursor-pointer"
                              >
                                <Shield className="size-3.5 text-slate-450" />
                                <span>{language === "VI" ? "Cài đặt bảo mật" : "Security settings"}</span>
                              </button>

                              <hr className="border-slate-800/50 my-1" />

                              <button
                                onClick={handleLogoutAction}
                                className="w-full text-left p-2 hover:bg-red-950/40 rounded-xl text-red-500 hover:text-red-400 text-[11px] flex items-center gap-2 duration-150 cursor-pointer"
                              >
                                <LogOut className="size-3.5" />
                                <span>{language === "VI" ? "Đăng xuất cổng" : "Sign out"}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ---------------- SCREEN 1: LOGIN ---------------- */}
                  {currentScreen === "LOGIN" && (
                    <div className="flex-1 flex flex-col justify-start px-6 pt-3 h-full animate-fade-in relative overflow-hidden bg-black">
                      
                      {/* Ambient gym background picture with solid dark overlay to match the mock */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-25 mix-blend-lighten"
                        style={{ 
                          backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop')` 
                        }}
                      />
                      {/* Dark radial gradient to maintain readability is applied */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/95 pointer-events-none" />

                      {/* Top labels */}
                      <div className="flex justify-between items-center mt-3 relative z-10">
                        <span className="border border-[#D2FF00]/40 text-[#D2FF00] text-[9.5px] font-mono px-2 py-0.5 rounded-sm leading-none uppercase font-bold bg-[#D2FF00]/5 shadow-[0_0_8px_rgba(210,255,0,0.15)]">
                          LOGIN USER
                        </span>

                        {/* Precise language toggle pill match */}
                        <div className="flex border border-zinc-800/80 rounded bg-black/80 p-0.5">
                          <button
                            type="button"
                            onClick={() => setLanguage("VI")}
                            className={`px-2 py-0.5 font-mono text-[8.5px] font-extrabold rounded-xs transition-all duration-150 ${language === "VI" ? "bg-[#D2FF00] text-black" : "text-zinc-500 hover:text-zinc-300"}`}
                          >
                            VI
                          </button>
                          <button
                            type="button"
                            onClick={() => setLanguage("EN")}
                            className={`px-2 py-0.5 font-mono text-[8.5px] font-extrabold rounded-xs transition-all duration-150 ${language === "EN" ? "bg-[#D2FF00] text-black" : "text-zinc-500 hover:text-zinc-300"}`}
                          >
                            EN
                          </button>
                        </div>
                      </div>

                      {/* Dumbbell Icon container + slanted brand title */}
                      <div className="flex flex-col items-center justify-center mt-12 mb-6 relative z-10">
                        {/* Box outline neon icon with yellow-green glow */}
                        <div className="p-3 border border-[#D2FF00]/40 rounded-xl bg-gradient-to-b from-black to-zinc-950 shadow-[0_0_15px_rgba(210,255,0,0.25)] mb-3">
                          <Dumbbell className="text-[#D2FF00] size-7 rotate-45" />
                        </div>
                        <h2 className="font-display italic text-4xl tracking-tight font-black text-white uppercase select-none">
                          FIT<span className="text-[#D2FF00]">GYM</span>
                        </h2>
                        <span className="text-[10px] text-zinc-400 tracking-[0.25em] font-mono mt-1 font-bold">
                          {language === "VI" ? "CỔNG HỘI VIÊN" : "MEMBER PORTAL"}
                        </span>
                      </div>

                      {/* Login fields */}
                      <form onSubmit={handleLogin} className="flex flex-col gap-4 relative z-10">
                        {/* Phone Number Field */}
                        <div className="flex flex-col gap-1">
                          <div className="relative">
                            <input
                              type="text"
                              value={loginPhone}
                              onChange={(e) => setLoginPhone(e.target.value)}
                              placeholder={language === "VI" ? "SỐ ĐIỆN THOẠI" : "PHONE NUMBER"}
                              className="w-full pl-4 pr-4 py-3 bg-black/50 hover:bg-black/70 border border-zinc-800 focus:border-[#D2FF00] rounded-2xl text-xs text-white placeholder-zinc-500 font-mono tracking-wider focus:outline-none transition-all duration-150 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
                            />
                          </div>
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-1">
                          <div className="relative">
                            <input
                              type={showLoginPass ? "text" : "password"}
                              value={loginPass}
                              onChange={(e) => setLoginPass(e.target.value)}
                              placeholder={language === "VI" ? "MẬT KHẨU" : "PASSWORD"}
                              className="w-full pl-4 pr-11 py-3 bg-black/50 hover:bg-black/70 border border-zinc-800 focus:border-[#D2FF00] rounded-2xl text-xs text-white placeholder-zinc-500 font-mono tracking-wider focus:outline-none transition-all duration-150 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowLoginPass(!showLoginPass)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                            >
                              {showLoginPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Confirm button - Solid lime-green highlight matching image precisely */}
                        <button
                          type="submit"
                          className="w-full mt-2 py-3.5 bg-[#D2FF00] hover:bg-[#c6ef00] text-black font-display font-black text-xl rounded-2xl flex items-center justify-center uppercase tracking-wide transition-all duration-150 ease-out active:scale-[0.98] cursor-pointer shadow-[0_4px_20px_rgba(210,255,0,0.25)]"
                        >
                          {language === "VI" ? "XÁC NHẬN" : "CONFIRM"}
                        </button>
                      </form>

                      {/* Back-links placed directly under the form buttons as requested */}
                      <div className="flex flex-col items-center gap-3.5 mt-5 pb-4 relative z-10 w-full text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setLastScreen("LOGIN");
                            setCurrentScreen("REGISTER_STEP_1");
                          }}
                          className="text-[10px] text-zinc-300 font-sans tracking-wide hover:text-white transition"
                        >
                          {language === "VI" ? "CHƯA CÓ TÀI KHOẢN?" : "DON'T HAVE ACCOUNT?"}{" "}
                          <span className="text-[#D2FF00] underline uppercase font-bold hover:text-white ml-1 font-mono">
                            {language === "VI" ? "ĐĂNG KÝ NGAY" : "REGISTER NOW"}
                          </span>
                        </button>

                        <div className="w-full border-t border-zinc-900" />

                        <div className="w-full flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              showToast(
                                language === "VI"
                                    ? "Gợi ý: Hãy nhập 'demo' vào ô Số điện thoại để vượt qua bảo mật!"
                                    : "Hint: Enter 'demo' in Phone Number field to bypass login!"
                              );
                            }}
                            className="text-[10px] text-[#D2FF00] font-sans font-extrabold tracking-tight uppercase hover:underline transition"
                          >
                            {language === "VI" ? "QUÊN MẬT KHẨU?" : "FORGOT PASSWORD?"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ---------------- SCREEN 2: SIGN UP STEP 1 ---------------- */}
                  {currentScreen === "REGISTER_STEP_1" && (
                    <div className="flex-1 flex flex-col justify-between px-6 pt-3 h-full animate-fade-in relative overflow-hidden bg-black">
                      
                      {/* Ambient gym background picture with solid dark overlay to match the mock */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-25 mix-blend-lighten"
                        style={{ 
                          backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop')` 
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/95 pointer-events-none" />

                      {/* Top tags */}
                      <div className="flex justify-between items-center mt-3 relative z-10">
                        <span className="border border-[#D2FF00]/40 text-[#D2FF00] text-[9.5px] font-mono px-2 py-0.5 rounded-sm leading-none uppercase font-bold bg-[#D2FF00]/5 shadow-[0_0_8px_rgba(210,255,0,0.15)]">
                          REGISTER USER // OTP
                        </span>

                        <div className="flex border border-zinc-800/80 rounded bg-black/80 p-0.5">
                          <button
                            type="button"
                            onClick={() => setLanguage("VI")}
                            className={`px-2 py-0.5 font-mono text-[8.5px] font-extrabold rounded-xs transition-all duration-150 ${language === "VI" ? "bg-[#D2FF00] text-black" : "text-zinc-500 hover:text-zinc-300"}`}
                          >
                            VI
                          </button>
                          <button
                            type="button"
                            onClick={() => setLanguage("EN")}
                            className={`px-2 py-0.5 font-mono text-[8.5px] font-extrabold rounded-xs transition-all duration-150 ${language === "EN" ? "bg-[#D2FF00] text-black" : "text-zinc-500 hover:text-zinc-300"}`}
                          >
                            EN
                          </button>
                        </div>
                      </div>

                      {/* Brand Dumbbell header */}
                      <div className="flex flex-col items-center justify-center pt-5 pb-3 relative z-10">
                        <div className="p-2.5 border border-[#D2FF00]/40 rounded-xl bg-gradient-to-b from-black to-zinc-950 shadow-[0_0_15px_rgba(210,255,0,0.25)] mb-2">
                          <Dumbbell className="text-[#D2FF00] size-5.5 rotate-45" />
                        </div>
                        <h2 className="font-display italic text-2xl tracking-normal font-black text-white uppercase select-none">
                          FIT<span className="text-[#D2FF00]">GYM</span>
                        </h2>
                        <span className="text-[8px] text-zinc-400 font-mono uppercase tracking-widest mt-0.5 font-bold">
                          {language === "VI" ? "ĐĂNG KÝ HỘI VIÊN // OTP" : "SIGN UP MEMBER // OTP"}
                        </span>
                      </div>

                      {/* Step Indicator */}
                      <div className="bg-black/60 p-3.5 rounded-2xl border border-zinc-850 flex flex-col gap-2 relative z-10 shadow-[inner_0_1px_3px_rgba(0,0,0,0.4)]">
                        <div className="flex justify-between items-center">
                          {/* Progress dots */}
                          <div className="flex gap-1.55">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D2FF00] shadow-[0_0_8px_rgba(210,255,0,0.5)]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                            <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                          </div>
                          <span className="text-[10px] text-[#D2FF00] font-mono tracking-widest uppercase font-extrabold">
                            {language === "VI" ? "BƯỚC 1 / 3" : "STEP 1 / 3"}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                          {language === "VI"
                            ? "Điền Số điện thoại & Họ tên hội viên để kích hoạt gửi mã OTP mô phỏng."
                            : "Enter Phone number & Member Name to simulate receipt of active OTP code."}
                        </p>
                      </div>

                      {/* Inputs Fields */}
                      <form onSubmit={handleRegisterStep1Submit} className="flex flex-col gap-3 mt-4 relative z-10">
                        
                        <div className="flex flex-col gap-1 text-left">
                          <span className="text-[9px] text-zinc-400 font-mono tracking-wide font-bold">
                            {language === "VI" ? "HỌ VÀ TÊN HỘI VIÊN" : "MEMBER FULL NAME"}
                          </span>
                          <input
                            type="text"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            placeholder="VD: NGUYỄN VĂN A"
                            className="w-full px-4 py-3 bg-black/50 hover:bg-black/70 border border-zinc-800 focus:border-[#D2FF00] rounded-2xl text-xs text-white placeholder-zinc-500 font-mono text-center uppercase focus:outline-none transition-all duration-150 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
                          />
                        </div>

                        <div className="flex flex-col gap-1 text-left">
                          <span className="text-[9px] text-zinc-400 font-mono tracking-wide font-bold">
                            {language === "VI" ? "SỐ ĐIỆN THOẠI ĐĂNG KÝ" : "REGISTERED PHONE NUMBER"}
                          </span>
                          <input
                            type="text"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            placeholder="Nhập 10 chữ số (VD: 0987654321)"
                            className="w-full px-4 py-3 bg-black/50 hover:bg-black/70 border border-zinc-800 focus:border-[#D2FF00] rounded-2xl text-xs text-white placeholder-zinc-500 font-mono text-center focus:outline-none transition-all duration-150 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
                          />
                        </div>

                        {/* Submit Next Button - Lime-green accent */}
                        <button
                          type="submit"
                          className="w-full mt-2 py-3.5 bg-[#D2FF00] hover:bg-[#c6ef00] text-black font-display font-black text-sm rounded-2xl flex items-center justify-center gap-2 uppercase tracking-wide transition-all duration-150 ease-out active:scale-[0.98] cursor-pointer shadow-[0_4px_15px_rgba(210,255,0,0.2)]"
                        >
                          <span>{language === "VI" ? "TIẾP TỤC & NHẬN OTP" : "CONTINUE & GET OTP"}</span>
                          <ChevronRight className="size-4 text-black stroke-[3px]" />
                        </button>
                      </form>

                      {/* Back bottom signin toggler */}
                      <div className="flex flex-col items-center mt-5 pb-3 relative z-10">
                        <button
                          onClick={() => setCurrentScreen("LOGIN")}
                          type="button"
                          className="text-[10px] text-zinc-300 font-sans tracking-wide uppercase hover:text-white transition"
                        >
                          {language === "VI" ? "ĐÃ CÓ TÀI KHOẢN?" : "HAD REGISTERED?"}{" "}
                          <span className="text-[#D2FF00] underline font-bold hover:text-white ml-1 font-mono">
                            {language === "VI" ? "ĐĂNG NHẬP" : "LOG IN"}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ---------------- SCREEN 3: SIGN UP STEP 2 ---------------- */}
                  {currentScreen === "REGISTER_STEP_2" && (
                    <div className="flex-1 flex flex-col justify-between px-6 pt-3 h-full animate-fade-in relative overflow-hidden bg-black">
                      
                      {/* Ambient gym background picture with solid dark overlay to match the mock */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-25 mix-blend-lighten"
                        style={{ 
                          backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop')` 
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/95 pointer-events-none" />

                      {/* Top indicator */}
                      <div className="flex justify-between items-center mt-3 relative z-10">
                        <span className="border border-[#D2FF00]/40 text-[#D2FF00] text-[9.5px] font-mono px-2 py-0.5 rounded-sm leading-none uppercase font-bold bg-[#D2FF00]/5 shadow-[0_0_8px_rgba(210,255,0,0.15)]">
                          REGISTER USER // OTP
                        </span>

                        <div className="flex border border-zinc-800/80 rounded bg-black/80 p-0.5">
                          <button
                            type="button"
                            onClick={() => setLanguage("VI")}
                            className={`px-2 py-0.5 font-mono text-[8.5px] font-extrabold rounded-xs transition-all duration-150 ${language === "VI" ? "bg-[#D2FF00] text-black" : "text-zinc-500 hover:text-zinc-300"}`}
                          >
                            VI
                          </button>
                          <button
                            type="button"
                            onClick={() => setLanguage("EN")}
                            className={`px-2 py-0.5 font-mono text-[8.5px] font-extrabold rounded-xs transition-all duration-150 ${language === "EN" ? "bg-[#D2FF00] text-black" : "text-zinc-500 hover:text-zinc-300"}`}
                          >
                            EN
                          </button>
                        </div>
                      </div>

                      {/* Brand dumbbells */}
                      <div className="flex flex-col items-center justify-center pt-3 pb-2 relative z-10">
                        <div className="p-2 border border-[#D2FF00]/40 rounded-xl bg-gradient-to-b from-black to-zinc-950 shadow-[0_0_15px_rgba(210,255,0,0.25)] mb-1">
                          <Dumbbell className="text-[#D2FF00] size-5 rotate-45" />
                        </div>
                        <h2 className="font-display italic text-xl font-black text-white uppercase select-none">
                          FIT<span className="text-[#D2FF00]">GYM</span>
                        </h2>
                        <span className="text-[8px] text-zinc-400 font-mono uppercase tracking-widest mt-0.5 font-bold">
                          {language === "VI" ? "ĐĂNG KÝ HỘI VIÊN // OTP" : "SIGN UP MEMBER // OTP"}
                        </span>
                      </div>

                      {/* Progress bar info */}
                      <div className="bg-black/60 p-3 rounded-2xl border border-zinc-850 flex flex-col gap-1.5 relative z-10 shadow-[inner_0_1px_3px_rgba(0,0,0,0.4)]">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D2FF00]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D2FF00]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                          </div>
                          <span className="text-[10px] text-[#D2FF00] font-mono uppercase font-bold">
                            {language === "VI" ? "BƯỚC 2 / 3" : "STEP 2 / 3"}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-350 leading-snug font-sans">
                          {language === "VI" ? (
                            <span>
                              Mã xác thực OTP đã được kích hoạt đến số{" "}
                              <strong className="text-[#D2FF00] tracking-wider select-all">
                                {session.phoneNumber || "0012312312"}
                              </strong>
                              . Vui lòng kiểm tra tin nhắn.
                            </span>
                          ) : (
                            <span>
                              OTP code simulated active and sent to{" "}
                              <strong className="text-[#D2FF00]">{session.phoneNumber || "0012312312"}</strong>.
                            </span>
                          )}
                        </p>
                      </div>

                      {/* OTP Inputs View */}
                      <div className="my-auto py-3 text-center relative z-10">
                        <span className="text-[10px] text-zinc-400 font-mono tracking-widest block mb-2 font-bold">
                          {language === "VI" ? "MÃ OTP (4 CHỮ SỐ)" : "OTP CODE (4 DIGITS)"}
                        </span>

                        {/* Four boxes */}
                        <div className="flex justify-center gap-3">
                          {regOTP.map((digit, index) => (
                            <input
                              key={index}
                              id={`otp-input-${index}`}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOTPSingleInput(e.target.value, index)}
                              placeholder="-"
                              className="w-12 h-12 bg-black/50 hover:bg-black/70 text-center text-white border border-zinc-800 focus:border-[#D2FF00] rounded-2xl focus:outline-none text-xl font-bold font-mono transition shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Back + Proceed buttons side-by-side matching style */}
                      <div className="flex gap-3 mt-2 relative z-10">
                        <button
                          onClick={() => setCurrentScreen("REGISTER_STEP_1")}
                          className="flex-1 py-3 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-display font-black text-sm uppercase rounded-2xl duration-150 cursor-pointer"
                        >
                          {language === "VI" ? "QUAY LẠI" : "BACK"}
                        </button>

                        <button
                          onClick={handleOTPSubmit}
                          className="flex-1 py-3 bg-[#D2FF00] hover:bg-[#c6ef00] text-black font-display font-black text-sm uppercase rounded-2xl transition-all duration-150 cursor-pointer shadow-[0_4px_15px_rgba(210,255,0,0.2)]"
                        >
                          {language === "VI" ? "XÁC THỰC" : "VERIFY"}
                        </button>
                      </div>

                      {/* Resend bottom trigger */}
                      <div className="flex flex-col items-center gap-4 mt-4 pb-3 relative z-10">
                        <button
                          onClick={() => {
                            setBubbleCountdown(10);
                            setShowOTPBubble(true);
                            showToast(language === "VI" ? "Đã gửi lại mã OTP!" : "Resent OTP code!");
                          }}
                          className="text-[10px] text-zinc-400 hover:text-[#D2FF00] underline font-mono tracking-wide uppercase font-bold"
                        >
                          {language === "VI" ? "GỬI LẠI MÃ MỚI" : "RESEND CODE"}
                        </button>

                        <button
                          onClick={() => setCurrentScreen("LOGIN")}
                          className="text-[10px] text-zinc-300 font-sans tracking-wide uppercase hover:text-white transition"
                        >
                          {language === "VI" ? "ĐÃ CÓ TÀI KHOẢN?" : "HAD ACCOUNT?"}{" "}
                          <span className="text-[#D2FF00] underline font-bold ml-1 font-mono">
                            {language === "VI" ? "ĐĂNG NHẬP" : "LOG IN"}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ---------------- SCREEN 4: SIGN UP STEP 3 ---------------- */}
                  {currentScreen === "REGISTER_STEP_3" && (
                    <div className="flex-1 flex flex-col justify-between px-6 pt-3 h-full animate-fade-in relative overflow-hidden bg-black">
                      
                      {/* Ambient gym background picture with solid dark overlay to match the mock */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-25 mix-blend-lighten"
                        style={{ 
                          backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop')` 
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/95 pointer-events-none" />

                      {/* Top title bar */}
                      <div className="flex justify-between items-center mt-3 relative z-10">
                        <span className="border border-[#D2FF00]/40 text-[#D2FF00] text-[9.5px] font-mono px-2 py-0.5 rounded-sm leading-none uppercase font-bold bg-[#D2FF00]/5 shadow-[0_0_8px_rgba(210,255,0,0.15)]">
                          REGISTER USER // OTP
                        </span>

                        <div className="flex border border-zinc-800/80 rounded bg-black/80 p-0.5">
                          <button onClick={() => setLanguage("VI")} className={`px-2 py-0.5 font-mono text-[8.5px] font-extrabold rounded-xs transition-all duration-150 ${language === "VI" ? "bg-[#D2FF00] text-black" : "text-zinc-500 hover:text-zinc-300"}`}>VI</button>
                          <button onClick={() => setLanguage("EN")} className={`px-2 py-0.5 font-mono text-[8.5px] font-extrabold rounded-xs transition-all duration-150 ${language === "EN" ? "bg-[#D2FF00] text-black" : "text-zinc-500 hover:text-zinc-300"}`}>EN</button>
                        </div>
                      </div>

                      {/* Dumbbell logo */}
                      <div className="flex flex-col items-center justify-center pt-3 pb-2 relative z-10">
                        <div className="p-2 border border-[#D2FF00]/40 rounded-xl bg-gradient-to-b from-black to-zinc-950 shadow-[0_0_15px_rgba(210,255,0,0.25)] mb-1">
                          <Dumbbell className="text-[#D2FF00] size-5 rotate-45" />
                        </div>
                        <h2 className="font-display italic text-xl font-black text-white uppercase select-none">
                          FIT<span className="text-[#D2FF00]">GYM</span>
                        </h2>
                        <span className="text-[8px] text-zinc-400 font-mono uppercase tracking-widest mt-0.5 font-bold">
                          {language === "VI" ? "ĐĂNG KÝ HỘI VIÊN // OTP" : "SIGN UP MEMBER // OTP"}
                        </span>
                      </div>

                      {/* Progress Bar 3/3 */}
                      <div className="bg-black/60 p-3 rounded-2xl border border-zinc-850 flex flex-col gap-1.5 relative z-10 shadow-[inner_0_1px_3px_rgba(0,0,0,0.4)]">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D2FF00]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D2FF00]" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D2FF00]" />
                          </div>
                          <span className="text-[10px] text-[#D2FF00] font-mono uppercase font-bold">
                            {language === "VI" ? "BƯỚC 3 / 3" : "STEP 3 / 3"}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-350 leading-snug font-sans">
                          {language === "VI"
                            ? "Kích hoạt thành công số điện thoại. Hãy tạo mật khẩu đăng nhập (tối thiểu 6 ký tự)."
                            : "Phone verified. Create your login security password (min 6 characters)."}
                        </p>
                      </div>

                      {/* Form set password */}
                      <form onSubmit={handleRegisterStep3Submit} className="flex flex-col gap-3 mt-4 text-left relative z-10">
                        {/* Title 1 */}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] text-zinc-400 font-mono uppercase font-bold">
                            {language === "VI" ? "TẠO MẬT KHẨU" : "CREATE PASSWORD"}
                          </span>
                          <div className="relative">
                            <input
                              type={showRegPass ? "text" : "password"}
                              value={regPass}
                              onChange={(e) => setRegPass(e.target.value)}
                              placeholder="••••••"
                              className="w-full pl-4 pr-11 py-3 bg-black/50 hover:bg-black/70 border border-zinc-800 focus:border-[#D2FF00] rounded-2xl text-xs text-center text-white focus:outline-none placeholder-zinc-650 font-mono transition shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegPass(!showRegPass)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                            >
                              {showRegPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Title 2 */}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] text-zinc-400 font-mono uppercase font-bold">
                            {language === "VI" ? "XÁC NHẬN MẬT KHẨU" : "CONFIRM PASSWORD"}
                          </span>
                          <input
                            type="password"
                            value={regConfirmPass}
                            onChange={(e) => setRegConfirmPass(e.target.value)}
                            placeholder="••••••"
                            className="w-full px-4 py-3 bg-black/50 hover:bg-black/70 border border-zinc-800 focus:border-[#D2FF00] rounded-2xl text-xs text-center text-white focus:outline-none placeholder-zinc-650 font-mono transition shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
                          />
                        </div>

                        {/* Actions buttons */}
                        <div className="flex gap-3 mt-2">
                          <button
                            type="button"
                            onClick={() => setCurrentScreen("REGISTER_STEP_2")}
                            className="flex-1 py-3 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-display font-black text-sm uppercase rounded-2xl duration-150 cursor-pointer text-center"
                          >
                            {language === "VI" ? "QUAY LẠI" : "BACK"}
                          </button>

                          <button
                            type="submit"
                            className="flex-1 py-3 bg-[#D2FF00] hover:bg-[#c6ef00] text-black font-display font-black text-sm uppercase rounded-2xl flex items-center justify-center gap-1.5 transition duration-150 cursor-pointer text-center shadow-[0_4px_15px_rgba(210,255,0,0.2)]"
                          >
                            <span>{language === "VI" ? "HOÀN TẤT" : "COMPLETE"}</span>
                            <CheckCircle className="size-4 text-black stroke-[3px]" />
                          </button>
                        </div>
                      </form>

                      {/* Login footer link */}
                      <div className="flex flex-col items-center mt-5 pb-3 relative z-10">
                        <button
                          onClick={() => setCurrentScreen("LOGIN")}
                          type="button"
                          className="text-[10px] text-zinc-300 font-sans tracking-wide uppercase hover:text-white transition"
                        >
                          {language === "VI" ? "ĐÃ CÓ TÀI KHOẢN?" : "HAD ACCOUNT?"}{" "}
                          <span className="text-[#D2FF00] underline font-bold ml-1 font-mono">
                            {language === "VI" ? "ĐĂNG NHẬP" : "LOG IN"}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ---------------- SCREEN 5: APP HOME (TRANG CHỦ) ---------------- */}
                  {currentScreen === "HOME" && (
                    <div className="flex-1 flex flex-col px-5 pt-3 h-full animate-fade-in text-left">
                      
                      {/* Top dynamic user info header */}
                      <div className="mb-4">
                        <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                          HỘI VIÊN CLASS_PLATINUM
                        </span>
                        <h3 className="font-display italic text-3xl font-extrabold uppercase leading-none mt-1 tracking-tight text-white">
                          XIN CHÀO, <span className="text-[#D2FF00]">{session.fullName || "NAM"}</span>!
                        </h3>
                      </div>

                      {/* FITGYM PASS - Locked or Unlocked Card Container */}
                      <div className="relative mb-5 p-5 rounded-3xl bg-gradient-to-br from-black to-zinc-950 border border-zinc-800 shadow-[0_4px_30px_rgba(0,0,0,0.8)] overflow-hidden min-h-[195px] flex flex-col justify-between">
                        
                        {/* Absolute carbon fiber decorative grids in canvas background */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(210,255,0,0.04),transparent)] pointer-events-none" />
                        
                        {/* Card Upper Info Line */}
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-slate-500 font-mono block uppercase">THẺ SỐ HỘI VIÊN</span>
                            <span className="font-display italic text-xl font-extrabold text-[#D2FF00] tracking-wide">
                              FITGYM_PASS
                            </span>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-slate-400">#0013</span>
                        </div>

                        {/* Interactive Lock/Unlock State */}
                        {!activePackage ? (
                          <div className="flex flex-col items-center justify-center my-4 py-2 border border-dashed border-zinc-800 rounded-2xl bg-black/45">
                            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-855 flex items-center justify-center mb-1">
                              <Lock className="text-zinc-550 size-4" />
                            </div>
                            <span className="text-xs text-white font-mono uppercase tracking-wide">
                              QR CHECK-IN BỊ KHÓA
                            </span>
                            <span className="text-[9px] text-zinc-400 mt-0.5">
                              VUI LÒNG ĐĂNG KÝ HỘI VIÊN GÓI TẬP
                            </span>
                          </div>
                        ) : (
                          // Fully Active, Neon Yellow Glow Live QR Code Simulator
                          <div className="flex items-center gap-4 my-2.5 p-2 px-3 border border-[#D2FF00]/30 rounded-2xl bg-[#D2FF00]/5 shadow-[inset_0_0_12px_rgba(210,255,0,0.05)]">
                            {/* Spinning neon matrix square simulation */}
                            <div className="shrink-0 w-[60px] h-[60px] bg-white rounded-lg p-1 animate-pulse relative">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FITGYM-MEMBER-0013-${activePackage.id}&color=d2ff00&bgcolor=ffffff`}
                                alt="QR Code"
                                className="w-full h-full object-contain filter invert"
                              />
                            </div>
                            <div className="text-left">
                              <span className="px-2 py-0.5 text-[8px] font-mono tracking-widest text-black bg-[#D2FF00] rounded uppercase font-black">
                                TRẠNG THÁI: HOẠT ĐỘNG
                              </span>
                              <p className="text-[11px] font-bold text-white mt-1 uppercase line-clamp-1">
                                {activePackage.name}
                              </p>
                              <p className="text-[9px] text-slate-400 font-mono">Quẹt QR tại cổng kiểm soát</p>
                            </div>
                          </div>
                        )}

                        {/* Card bottom details */}
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-500 font-mono uppercase">FITGYM CLUB</span>
                          {activePackage ? (
                            <span className="text-[#D2FF00] font-mono font-bold uppercase">{activePackage.durationLabel} ACCESS</span>
                          ) : (
                            <button
                              onClick={() => setCurrentScreen("PRICING")}
                              type="button"
                              className="text-[#D2FF00] underline hover:text-white font-mono uppercase font-bold"
                            >
                              Kích hoạt ngay »
                            </button>
                          )}
                        </div>
                      </div>

                      {/* GÓI DỊCH VỤ KÍCH HOẠT widget */}
                      {!activePackage ? (
                        <div className="mb-5 p-4 rounded-3xl bg-zinc-900 border border-zinc-800 text-left flex items-start gap-3.5 relative">
                          <div className="shrink-0 w-8 h-8 rounded-2xl bg-black flex items-center justify-center border border-zinc-800">
                            <Sparkles className="text-zinc-500 size-4" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] text-zinc-500 font-mono tracking-wide uppercase">GÓI DỊCH VỤ KÍCH HOẠT</span>
                              <span className="text-[9px] text-amber-500 font-mono font-bold bg-amber-500/10 px-1.5 py-0.5 rounded uppercase">CHƯA ĐĂNG KÝ</span>
                            </div>
                            <h4 className="font-display italic text-lg font-bold text-white uppercase mt-1 leading-tight tracking-wide">
                              BẠN CHƯA ĐĂNG KÝ HỘI VIÊN.
                            </h4>
                            <p className="text-[10px] text-zinc-400 leading-snug mt-1.5 font-sans">
                              Vui lòng đến quầy để đăng ký gói tập hoặc <strong onClick={() => setCurrentScreen("PRICING")} className="text-[#D2FF00] underline cursor-pointer">chọn gói tập online tại đây</strong> để kích hoạt thẻ.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-5 p-4 rounded-3xl bg-[#D2FF00]/5 border border-[#D2FF00]/20 text-left flex items-start gap-3.5 relative shadow-[0_4px_16px_rgba(210,255,0,0.03)]">
                          <div className="shrink-0 w-8 h-8 rounded-2xl bg-[#D2FF00]/10 flex items-center justify-center border border-[#D2FF00]/30 animate-pulse">
                            <Sparkles className="text-[#D2FF00] size-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] text-zinc-405 font-mono tracking-wide uppercase">GÓI DỊCH VỤ KÍCH HOẠT</span>
                              <span className="text-[9px] text-black font-mono font-bold bg-[#D2FF00] px-1.5 py-0.5 rounded uppercase">HẠN TỚI 2027</span>
                            </div>
                            <h4 className="font-display italic text-lg font-extrabold text-[#D2FF00] uppercase mt-1 tracking-wide">
                              {activePackage.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 leading-snug mt-1 font-sans">
                              Đầy đủ đặc quyền: {activePackage.description}. Khóa Locker & xông hơi miễn phí hằng ngày.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* LỊCH SỬ VÀO PHÒNG TẬP matching image 5 precisely */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2.5">
                          <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-bold">
                            LỊCH SỬ VÀO PHÒNG TẬP
                          </span>
                          <span className="text-[10px] text-[#D2FF00] font-mono">
                            Tổng 0 buổi tập
                          </span>
                        </div>

                        {/* Empty state dotted wireframe box */}
                        <div className="border border-dashed border-slate-800 rounded-3xl p-5 text-center flex flex-col items-center justify-center py-7 bg-slate-900/10">
                          <Clock className="text-slate-600 size-5 mb-1.5" />
                          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">
                            CHƯA CÓ LỊCH SỬ CHECK-IN HÔM NAY.
                          </p>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* ---------------- SCREEN 6: PRICING (GÓI TẬP) ---------------- */}
                  {currentScreen === "PRICING" && (
                    <div className="flex-1 flex flex-col px-5 pt-3 h-full animate-fade-in text-left">
                      
                      {/* Sub head upper intro */}
                      <div className="mb-4">
                        <span className="text-[10px] font-mono tracking-widest text-[#D2FF00] uppercase font-bold leading-none">
                          CHỌN LỰA GÓI PHÙ HỢP CỰC DỄ
                        </span>
                        <h3 className="font-display italic text-2xl font-extrabold text-white uppercase leading-none mt-1 tracking-wider">
                          BẢNG GIÁ DỊCH VỤ GYM
                        </h3>
                      </div>

                      {/* Display pricing packages scrolling feed */}
                      <div className="flex flex-col gap-4">
                        {GYM_PACKAGES.map((pkg) => (
                          <div
                            key={pkg.id}
                            className={`p-4 rounded-3xl bg-zinc-900/60 border ${activePackage?.id === pkg.id ? "border-[#D2FF00] shadow-[0_0_15px_rgba(210,255,0,0.15)]" : "border-zinc-800"} flex flex-col justify-between relative overflow-hidden`}
                          >
                            
                            {/* Active badge */}
                            {activePackage?.id === pkg.id && (
                              <span className="absolute top-0 right-0 bg-[#D2FF00] text-black font-mono font-black text-[9px] px-3 py-1 rounded-bl-xl uppercase">
                                ĐANG SỬ DỤNG
                              </span>
                            )}

                            <div>
                              {/* Title line */}
                              <div className="flex justify-between items-start">
                                <span className="bg-zinc-850 text-[#D2FF00] text-[8px] font-mono px-2 py-0.5 rounded uppercase font-bold border border-zinc-700/50">
                                  {pkg.durationLabel}
                                </span>
                                <div className="text-right">
                                  <span className="text-base font-mono font-bold text-[#D2FF00] block">{pkg.priceValue}</span>
                                  <span className="text-[7px] text-zinc-500 font-mono tracking-wider block uppercase">TRỌN GÓI</span>
                                </div>
                              </div>

                              {/* Big slant heading */}
                              <h4 className="font-display italic text-lg font-extrabold text-white uppercase mt-1 leading-none tracking-wide">
                                {pkg.name}
                              </h4>

                              <p className="text-[10px] text-zinc-400 mt-2 font-sans leading-snug">
                                {pkg.description}
                              </p>

                              {/* Bullet specifications */}
                              <div className="mt-3.5 pt-3.5 border-t border-zinc-850 flex flex-wrap gap-x-4 gap-y-1.5">
                                {pkg.features.map((feat, fIdx) => (
                                  <div key={fIdx} className="flex items-center gap-1.5 text-[9px] text-zinc-300 font-mono uppercase">
                                    <div className="w-3.5 h-3.5 rounded-full bg-[#D2FF00]/10 border border-[#D2FF00]/20 flex items-center justify-center shrink-0">
                                      <Check className="text-[#D2FF00] size-2.5" />
                                    </div>
                                    <span>{feat}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Sticky Neon styled button */}
                            <button
                              onClick={() => {
                                setCheckoutModalPackage(pkg);
                              }}
                              className={`w-full mt-4 py-2 bg-gradient-to-r ${activePackage?.id === pkg.id ? "from-zinc-900 to-zinc-950 border-zinc-800 text-zinc-500" : "from-[#D2FF00] to-[#c6ef00] bg-[#D2FF00] hover:bg-[#c6ef00] text-black border-transparent"} font-mono font-bold text-[9px] tracking-wide rounded-xl border transition duration-150 uppercase cursor-pointer text-center`}
                            >
                              {activePackage?.id === pkg.id 
                                ? (language === "VI" ? "BẠN ĐANG DÙNG GÓI NÀY - HẤP DẪN" : "CURRENT ACTIVE PACKAGE") 
                                : (language === "VI" ? "CHỌN GÓI NÀY ĐỂ KÍCH HOẠT MÔ PHỎNG" : "SELECT AND ACTIVATE")}
                            </button>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  {/* ---------------- SCREEN 7: CHAT BOT AI (HLV AI) ---------------- */}
                  {currentScreen === "CHAT_AI" && (
                    <div className="flex-1 flex flex-col justify-between h-full animate-fade-in relative px-4">
                      
                      {/* Top bar header info */}
                      <div className="flex items-center gap-2 mb-3 mt-1 pb-2 border-b border-zinc-900 text-left">
                        {/* Go back menu icon */}
                        <button
                          onClick={() => setCurrentScreen("HOME")}
                          className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg duration-150"
                        >
                          <ChevronLeft className="size-4" />
                        </button>
                        <div>
                          <span className="text-[8px] font-mono tracking-widest text-[#D2FF00] block leading-none font-bold">
                            TRỢ LÝ SỨC KHỎE VÀ TẬP LUYỆN
                          </span>
                          <h4 className="font-display italic text-lg font-extrabold text-white uppercase leading-none mt-0.5">
                            CHATBOT HLV AI
                          </h4>
                        </div>
                      </div>

                      {/* Chat messages feed container */}
                      <div className="flex-1 overflow-y-auto space-y-3 px-1.5 pb-2 text-left max-h-[460px] min-h-[300px]">
                        {aiChatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} w-full anim-fade-in`}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              {msg.role === "assistant" && (
                                <span className="bg-[#D2FF00]/10 border border-[#D2FF00]/30 text-[#D2FF00] font-mono text-[7px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                                  GYMMASTER BOT AI
                                </span>
                              )}
                              <span className="text-[7px] text-zinc-500 font-mono">{msg.timestamp}</span>
                            </div>

                            <div
                              className={`max-w-[85%] rounded-2xl p-3 text-[11px] leading-relaxed whitespace-pre-wrap ${
                                msg.role === "user"
                                  ? "bg-[#D2FF00] text-black font-semibold font-sans rounded-tr-none shadow-[0_4px_15px_rgba(210,255,0,0.18)]"
                                  : "bg-zinc-900 text-zinc-200 border border-zinc-800/80 rounded-tl-none font-sans"
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))}

                        {/* Loading pulse thinking state */}
                        {loadingAI && (
                          <div className="flex flex-col items-start w-full">
                            <span className="bg-[#D2FF00]/10 border border-[#D2FF00]/30 text-[#D2FF00] font-mono text-[7px] font-extrabold px-1.5 py-0.5 rounded uppercase mb-1">
                              GYMMASTER BOT AI
                            </span>
                            <div className="bg-zinc-900 text-zinc-300 border border-zinc-805 rounded-2xl rounded-tl-none p-3 px-4 text-xs font-mono animate-pulse flex items-center gap-2">
                              {/* spinning neon loader circle */}
                              <div className="w-2 h-2 rounded-full bg-[#D2FF00] animate-ping" />
                              <span>Được cung cấp bởi Gemini AI...</span>
                            </div>
                          </div>
                        )}

                        <div ref={aiChatEndRef} />
                      </div>

                      {/* AI Quick helper tags */}
                      <div className="my-2 py-2 border-t border-b border-zinc-900/40 flex items-center gap-2 overflow-x-auto select-none no-scrollbar shrink-0">
                        <span className="text-[7px] text-zinc-500 font-mono shrink-0 uppercase">GỢI Ý NHANH:</span>
                        {[
                          { text: "LỊCH TẬP NGỰC TĂNG CƠ", msg: "Lên dùm tôi lịch tập ngực tăng cơ độ dày tốt nhất" },
                          { text: "THỰC ĐƠN GIẢM MỠ BỤNG", msg: "Cho tôi thực đơn ăn uống giảm mỡ bụng trong vòng 1 tuần" },
                          { text: "TƯ VẤN GÓI TẬP", msg: "Gói tập FitGym nào tốt nhất cho sinh viên hoặc người bắt đầu?" },
                        ].map((tag, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setAiInputMessage(tag.msg);
                              showToast(language === "VI" ? "Bấm vào nút gửi để hỏi AI!" : "Click the send button to query AI!");
                            }}
                            className="shrink-0 p-1 px-2 border border-zinc-800 rounded bg-zinc-900 hover:border-[#D2FF00] hover:text-[#D2FF00] text-[8px] font-mono text-zinc-300 transition duration-150 uppercase font-black"
                          >
                            {tag.text}
                          </button>
                        ))}
                      </div>

                      {/* Chat text input box matches image 7 */}
                      <form onSubmit={sendAIMessage} className="flex gap-2 bg-transparent shrink-0">
                        <input
                          type="text"
                          value={aiInputMessage}
                          onChange={(e) => setAiInputMessage(e.target.value)}
                          placeholder="Hỏi AI về bài tập, chế độ dinh dưỡng..."
                          className="flex-1 bg-zinc-900 border border-zinc-800 focus:outline-none focus:border-[#D2FF00] text-xs text-white placeholder-zinc-500 py-3.5 pl-4 pr-3 rounded-xl font-mono"
                        />
                        <button
                          type="submit"
                          disabled={loadingAI}
                          className="w-11 h-11 shrink-0 bg-[#D2FF00] hover:bg-[#c6ef00] text-black rounded-xl flex items-center justify-center duration-150 active:scale-95 disabled:opacity-50 cursor-pointer shadow-[0_4px_10px_rgba(210,255,0,0.25)]"
                        >
                          <Send className="size-4 text-black" />
                        </button>
                      </form>

                    </div>
                  )}

                  {/* ---------------- SCREEN 8: CHAT SUPPORT TEAM LIST (HỖ TRỢ CHAT) ---------------- */}
                  {currentScreen === "SUPPORT_LIST" && (
                    <div className="flex-1 flex flex-col px-5 pt-3 h-full animate-fade-in text-left">
                      
                      {/* Search & filters head */}
                      <div className="mb-4">
                        <span className="text-[10px] font-mono tracking-widest text-[#D2FF00] uppercase font-bold leading-none">
                          TỔNG ĐÀI HỖ TRỢ TRỰC TUYẾN 24/7
                        </span>
                        <h3 className="font-display italic text-2xl font-extrabold text-white uppercase leading-none mt-1 tracking-wider">
                          MESSENGER HỖ TRỢ CHAT
                        </h3>
                      </div>

                      {/* Core support directory search input bar */}
                      <div className="relative mb-3.5">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 size-4" />
                        <input
                          type="text"
                          value={supportSearchQuery}
                          onChange={(e) => setSupportSearchQuery(e.target.value)}
                          placeholder="Tìm nhân viên hỗ trợ hoặc PT..."
                          className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-[#D2FF00] focus:outline-none text-xs text-white placeholder-zinc-550 font-mono"
                        />
                      </div>

                      {/* Filter Chips tags matches image 8 */}
                      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                        {[
                          { id: "all", label: "TẤT CẢ" },
                          { id: "pt", label: "HLV THỂ HÌNH (PT)" },
                          { id: "support", label: "LỄ TÂN / SUPPORT" },
                        ].map((chip) => (
                          <button
                            key={chip.id}
                            onClick={() => setSupportCategoryFilter(chip.id as any)}
                            type="button"
                            className={`shrink-0 py-1.5 px-3 font-mono font-black text-[9px] rounded-lg tracking-wider transition duration-150 uppercase cursor-pointer ${
                              supportCategoryFilter === chip.id
                                ? "bg-[#D2FF00] text-black font-extrabold shadow-[0_2px_8px_rgba(210,255,0,0.2)]"
                                : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"
                            }`}
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>

                      {/* DỘI THOẠI ĐANG CHAT (Recent active chats list) */}
                      <div className="mb-4">
                        <span className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider block mb-1.5">HỘI THOẠI ĐANG CHAT</span>
                        <div className="border border-dashed border-zinc-800 rounded-2xl p-4 text-center justify-center py-5 bg-zinc-900/10">
                          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-normal">
                            Chưa có cuộc trò chuyện nào trước đó. Chọn HLV hoặc kỹ thuật viên ở mục danh bạ phía dưới để khởi tạo chat ngay!
                          </p>
                        </div>
                      </div>

                      {/* ONLINE CONTACT DIRECTORY CARDS matches images 8 precisely */}
                      <div className="flex-1 flex flex-col gap-3.5">
                        <span className="text-[8px] text-slate-500 font-mono uppercase tracking-wider block leading-none">DANH BẠ TRỰC TUYẾN ({SUPPORT_CONTACTS.filter(c => c.isOnline).length})</span>
                        
                        {SUPPORT_CONTACTS.filter((contact) => {
                          const matchesCat =
                            supportCategoryFilter === "all" || contact.category === supportCategoryFilter;
                          const matchesQuery =
                            contact.name.toLowerCase().includes(supportSearchQuery.toLowerCase()) ||
                            contact.roleLabel.toLowerCase().includes(supportSearchQuery.toLowerCase());
                          return matchesCat && matchesQuery;
                        }).map((contact) => (
                          <div
                            key={contact.id}
                            className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-3xl flex flex-col gap-3.5 relative shadow"
                          >
                            
                            {/* Profile core row */}
                            <div className="flex items-start gap-3">
                              {/* Avatar circle with online green pulsing indicator */}
                              <div className="shrink-0 relative">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 text-white font-bold text-center flex items-center justify-center font-sans text-base bg-gradient-to-tr from-zinc-850 to-zinc-900">
                                  {contact.avatarChar}
                                </div>
                                {contact.isOnline && (
                                  <span className="absolute bottom-[-1px] right-[-1px] w-3 h-3 rounded-full bg-green-500 border-[2px] border-zinc-900 shadow-[0_0_8px_rgba(34,197,94,0.7)] animate-pulse" />
                                )}
                              </div>

                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <span className="bg-zinc-800 text-[#D2FF00] border border-zinc-700/50 text-[8px] font-mono px-1.5 py-0.2 rounded uppercase font-bold">
                                    {contact.roleLabel}
                                  </span>
                                </div>
                                <h4 className="font-display italic text-lg font-extrabold text-white uppercase leading-tight mt-1">
                                  {contact.name}
                                </h4>
                                <span className="text-[8px] text-zinc-550 font-mono block uppercase">
                                  {contact.id === "tiep_tan" ? "Lễ tân ca sáng" : contact.id === "huan_luyen" ? "PT Chuyên nghiệp" : "Kỹ thuật"}
                                </span>
                              </div>
                            </div>

                            {/* BIO descriptive window */}
                            <div className="p-3 bg-black/40 border border-zinc-850/60 rounded-2xl text-[10px] text-zinc-300 font-sans leading-relaxed">
                              {contact.bio}
                            </div>

                            {/* CALL DIRECT vs TEXT MESSAGE actions row matches image 8 */}
                            <div className="grid grid-cols-2 gap-3 pt-1">
                              <button
                                onClick={() => {
                                  showToast(
                                    language === "VI"
                                      ? `Đang thực hiện cuộc gọi viễn thông trực tiếp đến: ${contact.name}`
                                      : `Initiating direct telecom call to: ${contact.name}`
                                  );
                                }}
                                type="button"
                                className="py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-mono font-black text-[9px] tracking-wide border border-zinc-700/50 rounded-xl flex items-center justify-center gap-1.5 transition duration-150 uppercase cursor-pointer"
                              >
                                <Phone className="size-3" />
                                <span>GỌI TRỰC TIẾP</span>
                              </button>

                              <button
                                onClick={() => {
                                  setActiveSupportContact(contact);
                                  setCurrentScreen("SUPPORT_CHAT");
                                }}
                                type="button"
                                className="py-2.5 bg-[#D2FF00] hover:bg-[#c6ef00] text-black font-mono font-black text-[9px] tracking-wide rounded-xl flex items-center justify-center gap-1.5 transition duration-150 uppercase cursor-pointer shadow-[0_2px_10px_rgba(210,255,0,0.15)]"
                              >
                                <MessageSquare className="size-3 text-black" />
                                <span>NHẮN TIN</span>
                              </button>
                            </div>

                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  {currentScreen === "SUPPORT_CHAT_OLD_TO_BE_REPLACED" && (
                    <div className="hidden">
                      
                      {/* Top Header Contact details with phone call option */}
                      <div className="flex items-center justify-between mb-3 mt-1 pb-2 border-b border-zinc-800 pr-1 text-left shrink-0">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCurrentScreen("SUPPORT_LIST")}
                            className="p-1 text-slate-400 hover:text-white hover:bg-zinc-800 rounded-lg duration-150"
                          >
                            <ChevronLeft className="size-4" />
                          </button>

                          <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-zinc-850 text-white font-bold text-center flex items-center justify-center font-sans text-xs">
                              {activeSupportContact.avatarChar}
                            </div>
                            {activeSupportContact.isOnline && (
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border border-zinc-900 shadow" />
                            )}
                          </div>

                          <div>
                            <h4 className="font-display italic text-base font-extrabold text-white uppercase leading-none">
                              {activeSupportContact.name}
                            </h4>
                            <span className="text-[7.5px] text-zinc-500 font-mono block uppercase mt-0.5">
                              {activeSupportContact.roleLabel}
                            </span>
                          </div>
                        </div>

                        {/* Direct dial instant icon button */}
                        <button
                          onClick={() => {
                            showToast(
                              language === "VI"
                                ? `Kết nối hotline: ${activeSupportContact.name}`
                                : `Calling hotline: ${activeSupportContact.name}`
                            );
                          }}
                          type="button"
                          className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-[#D2FF00] flex items-center justify-center border border-zinc-800 duration-150 cursor-pointer"
                        >
                          <Phone className="size-3.5" />
                        </button>
                      </div>

                      {/* Chat Messages Feed of this Support assistant */}
                      <div className="flex-1 overflow-y-auto space-y-3 px-1.5 pb-2 text-left max-h-[460px] min-h-[300px]">
                        {(supportAgentChats[activeSupportContact.id] || []).map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} w-full anim-fade-in`}
                          >
                            <span className="text-[7px] text-zinc-500 font-mono mb-1">{msg.timestamp}</span>

                            <div
                              className={`max-w-[85%] rounded-2xl p-3 text-[11px] leading-relaxed whitespace-pre-wrap ${
                                msg.role === "user"
                                  ? "bg-[#D2FF00] text-black font-semibold font-sans rounded-tr-none shadow-[0_4px_15px_rgba(210,255,0,0.18)]"
                                  : "bg-zinc-900 text-zinc-200 border border-zinc-800/80 rounded-tl-none font-sans"
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))}

                        {/* Simulated typing agent feedback pending indicator */}
                        {supportReplyPending && (
                          <div className="flex flex-col items-start w-full">
                            <span className="text-[7px] text-zinc-500 font-mono mb-1">Đang soạn tin nhắn...</span>
                            <div className="bg-zinc-900 text-zinc-400 border border-zinc-800 rounded-2xl rounded-tl-none p-3 px-4 text-[10px] font-mono animate-pulse">
                              <span>{activeSupportContact.name} đang gõ phản hồi...</span>
                            </div>
                          </div>
                        )}

                        <div ref={supportChatEndRef} />
                      </div>

                      {/* Chat text input box matches image 9 */}
                      <form onSubmit={sendSupportMessage} className="flex gap-2 bg-transparent shrink-0">
                        <input
                          type="text"
                          value={supportInputMessage}
                          onChange={(e) => setSupportInputMessage(e.target.value)}
                          placeholder="Nhập nội dung cần trao đổi..."
                          className="flex-1 bg-zinc-900 border border-zinc-800 focus:outline-[#D2FF00] focus:border-[#D2FF00] text-xs text-white placeholder-zinc-550 py-3 pl-4 pr-3 rounded-xl font-sans"
                        />
                        <button
                          type="submit"
                          disabled={supportReplyPending}
                          className="w-10 h-10 shrink-0 bg-[#D2FF00] hover:bg-[#c6ef00] text-black rounded-xl flex items-center justify-center duration-150 active:scale-95 disabled:opacity-50 cursor-pointer shadow-[0_4px_10px_rgba(210,255,0,0.15)]"
                        >
                          <Send className="size-3.5 text-black" />
                        </button>
                      </form>

                    </div>
                  )}

                </div>

                {/* 3. Bottom persistent tab bars styling index overlays on app screens */}
                {session.isLoggedIn && (
                  <div className="h-[62px] shrink-0 bg-zinc-950 border-t border-zinc-900 grid grid-cols-4 px-2 py-1 gap-1 z-50">
                    {/* TRANG CHỦ TAB MATCHING IMAGE 5 */}
                    <button
                      onClick={() => {
                        setCurrentScreen("HOME");
                        setIsDropdownOpen(false);
                      }}
                      type="button"
                      className={`flex flex-col items-center justify-center gap-1 rounded-xl duration-150 cursor-pointer ${
                        currentScreen === "HOME" ? "text-[#D2FF00] bg-zinc-900/50 font-bold" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <div className="w-5 h-5 rounded overflow-hidden flex flex-wrap gap-[2px] p-[3px] border border-current/25">
                        <div className="w-[6px] h-[6px] bg-current rounded-3xs" />
                        <div className="w-[6px] h-[6px] bg-current rounded-3xs" />
                        <div className="w-[6px] h-[6px] bg-current rounded-3xs" />
                        <div className="w-[6px] h-[6px] bg-current rounded-3xs" />
                      </div>
                      <span className="text-[8px] font-mono tracking-widest uppercase font-black">TRANG CHỦ</span>
                    </button>

                    {/* GÓI TẬP TAB */}
                    <button
                      onClick={() => {
                        setCurrentScreen("PRICING");
                        setIsDropdownOpen(false);
                      }}
                      type="button"
                      className={`flex flex-col items-center justify-center gap-1 rounded-xl duration-150 cursor-pointer ${
                        currentScreen === "PRICING" ? "text-[#D2FF00] bg-zinc-900/50 font-bold" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <div className="p-0.5 border border-current/25 rounded-sm">
                        <CreditCard className="size-4 text-current" />
                      </div>
                      <span className="text-[8px] font-mono tracking-widest uppercase font-black">GÓI TẬP</span>
                    </button>

                    {/* HLV AI TAB */}
                    <button
                      onClick={() => {
                        setCurrentScreen("CHAT_AI");
                        setIsDropdownOpen(false);
                      }}
                      type="button"
                      className={`flex flex-col items-center justify-center gap-1 rounded-xl duration-150 cursor-pointer ${
                        currentScreen === "CHAT_AI" ? "text-[#D2FF00] bg-zinc-900/50 font-bold" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <div className="p-0.5 border border-current/25 rounded-md">
                        <Sparkles className="size-4 text-current" />
                      </div>
                      <span className="text-[8px] font-mono tracking-widest uppercase font-black">HLV AI</span>
                    </button>

                    {/* NHÂN VIÊN HỖ TRỢ TAB */}
                    <button
                      onClick={() => {
                        setCurrentScreen("SUPPORT_LIST");
                        setIsDropdownOpen(false);
                      }}
                      type="button"
                      className={`flex flex-col items-center justify-center gap-1 rounded-xl duration-150 cursor-pointer ${
                        currentScreen === "SUPPORT_LIST" || currentScreen === "SUPPORT_CHAT" ? "text-[#D2FF00] bg-zinc-900/50 font-bold" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <div className="p-0.5 border border-current/40 rounded-full">
                        <User className="size-4 text-current" />
                      </div>
                      <span className="text-[7.5px] font-mono tracking-widest uppercase font-black leading-none text-center">NHÂN VIÊN HỖ TRỢ</span>
                    </button>
                  </div>
                )}

                {/* Simulated physical Home Indicator line at bottom of phone */}
                <div className="w-full h-4 bg-zinc-950 shrink-0 flex items-center justify-center pb-1">
                  <div className="w-[120px] h-[4px] bg-zinc-800 rounded-full" />
                </div>

              </div>
            </div>
            
            {/* FLOATING ACTION BRAND BUTTON (Sparkles glow icon bottom-right) match image 5 */}
            {session.isLoggedIn && (
              <button
                onClick={() => {
                  setCurrentScreen("CHAT_AI");
                  showToast(language === "VI" ? "Huấn luyện viên ảo AI Coach đã sẵn sàng!" : "Virtual AI Coach is fully ready!");
                }}
                type="button"
                id="floating-glow-action-button"
                className="absolute bottom-24 right-14 w-12 h-12 rounded-full bg-[#D2FF00] hover:bg-[#c6ef00] text-black border border-black/10 shadow-[0_0_20px_rgba(210,255,0,0.4)] hover:shadow-[0_0_30px_rgba(210,255,0,0.6)] flex items-center justify-center duration-150 hover:scale-105 select-none font-bold z-[100] animate-bounce cursor-pointer"
              >
                <Sparkles className="size-[22px] text-black animate-pulse" />
              </button>
            )}

        </div>
      </div>


      {/* MODAL VIEW FOR PACKAGES INTERACTIVE CHECKOUT & TRIAL SELECTION */}
      {checkoutModalPackage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-zinc-905 border border-zinc-800 rounded-3xl max-w-md w-full p-6 text-left relative animate-fade-in">
            <button
               onClick={() => setCheckoutModalPackage(null)}
               type="button"
               className="absolute top-4 right-4 text-zinc-500 hover:text-white bg-zinc-950 p-2 rounded-xl duration-150 border border-zinc-800 cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <span className="bg-zinc-900 text-[#D2FF00] border border-zinc-800 text-[8px] font-mono px-2 py-0.5 rounded uppercase font-bold">
              BƯỚC THANH TOÁN (SIMULATOR)
            </span>

            <h3 className="font-display italic text-2xl font-extrabold text-white uppercase leading-none mt-2.5">
              KÍCH HOẠT HỘI VIÊN
            </h3>
            
            {/* Package details preview */}
            <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-2xl mt-4">
              <span className="text-[10px] text-zinc-500 font-mono">GÓI CHỌN MUA:</span>
              <p className="font-display italic text-lg font-black text-[#D2FF00] uppercase mt-0.5">{checkoutModalPackage.name}</p>
              <p className="text-xl font-mono font-bold text-white mt-1.5">{checkoutModalPackage.priceValue}</p>
              <p className="text-[10px] text-zinc-400 mt-2 font-sans italic">{checkoutModalPackage.description}</p>
            </div>

            <p className="text-xs text-zinc-400 mt-4 leading-relaxed font-sans">
              * Đây là tính năng mô phỏng để người dùng nghiệm thu phần mềm cổng FIT GYM. Khi bấm <strong>"XÁC NHẬN THANH TOÁN"</strong>, hệ thống sẽ mở khóa mã QR check-in ở Trang Chủ và gán gói tập này cho thẻ số hội viên của bạn ngay lập tức!
            </p>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => setCheckoutModalPackage(null)}
                type="button"
                className="py-3 bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white rounded-xl text-xs font-bold uppercase transition duration-150 font-mono cursor-pointer"
              >
                HỦY BỎ
              </button>
              
              <button
                onClick={handleConfirmPurchase}
                type="button"
                className="py-3 bg-[#D2FF00] hover:bg-[#c6ef00] text-black rounded-xl text-xs font-black uppercase transition duration-150 font-sans flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_15px_rgba(210,255,0,0.18)]"
              >
                <CheckCircle className="size-4 text-black" />
                <span>XÁC NHẬN THANH TOÁN</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
