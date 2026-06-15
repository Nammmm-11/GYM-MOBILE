import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini if key is present
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("Gemini API client successfully initialized.");
    } catch (err) {
      console.error("Failed to initialize Gemini client:", err);
    }
  } else {
    console.warn("GEMINI_API_KEY not set. Using smart custom simulated responses as fallback.");
  }

  // API response for HLV AI AI Gym Coach
  app.post("/api/gym-coach", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      // Check if we have active Gemini
      if (ai) {
        // Construct chat payload
        // Prepare system instructions for GYMMASTER BOT AI in Vietnamese
        const systemInstruction = 
          "Bạn là 'GYMMASTER BOT AI', Huấn luyện viên thể hình ảo cao cấp của hệ thống phòng tập FIT GYM. " +
          "Bạn luôn xưng hô thân thiện, tràn đầy động lực, năng lượng và nhiệt huyết, xưng 'Tôi' (hoặc 'HLV AI') và gọi khách hàng là 'bạn' hoặc 'anh/chị'. " +
          "Hãy trả lời bằng tiếng Việt một cách rõ ràng, ngắn gọn, có cấu trúc tốt (sử dụng bullet points hoặc in đậm để người dùng dễ theo dõi). " +
          "Hãy cung cấp các chương trình tập luyện thực tế, lời khuyên dinh dưỡng, giải đáp thắc mắc về các gói dịch vụ FitGym một cách chu đáo nhất.";

        // Map client history to Gemini contents structure
        const contents = [];
        if (history && Array.isArray(history)) {
          // Gemini wants structured array of model/user turns
          history.forEach((turn: any) => {
            contents.push({
              role: turn.role === "assistant" ? "model" : "user",
              parts: [{ text: turn.content }],
            });
          });
        }
        
        // Append the current message
        contents.push({
          role: "user",
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          }
        });

        const textOutput = response.text;
        return res.json({ reply: textOutput });
      } else {
        // High quality simulated Vietnamese coaching responses when Gemini is not fully configured
        let simulatedReply = "Chào bạn! Tôi là HLV AI của FIT GYM. Rất tiếc hiện tại cổng kết nối thông minh đang bảo trì một chút, nhưng tôi vẫn có thể đưa ra một vài gợi ý nhanh cho bạn nhé:\n\n";
        
        const cleanMsg = message.toLowerCase();
        if (cleanMsg.includes("ngực") || cleanMsg.includes("chest")) {
          simulatedReply += "**Lịch Tập Ngực Tăng Cơ Siêu Nhanh (Hypertrophy Chest Day):**\n\n" +
            "1. **Incline Barbell Bench Press**: 4 sets x 8-10 reps (Tách biệt ngực trên, tạo độ dày)\n" +
            "2. **Flat Dumbbell Press**: 3 sets x 10 reps (Kích hoạt phần ngực giữa tối đa)\n" +
            "3. **Cable Crossover**: 3 sets x 12-15 reps (Ép căng cơ ngực ngoài và tạo rãnh sâu)\n" +
            "4. **Dips (Xà kép)**: 3 sets x max reps (Cắt ngực dưới săn chắc)\n\n" +
            "*Lưu ý*: Hãy uống đủ 2-3 lít nước và giữ khoảng cách nghỉ giữa các hiệp là 60-90 giây nhé!";
        } else if (cleanMsg.includes("bụng") || cleanMsg.includes("mỡ") || cleanMsg.includes("diet") || cleanMsg.includes("ăn")) {
          simulatedReply += "**Thực Đơn Giảm Mỡ Bụng Khoa Học Trong 7 Ngày:**\n\n" +
            "- **Bữa sáng**: 2 quả trứng luộc + 1 lát đầy bánh mì đen + 1 quả chuối tiêu.\n" +
            "- **Bữa trưa**: 150g ức gà áp chảo + 1 bát nhỏ gạo lứt + rau súp lơ xanh hấp.\n" +
            "- **Bữa phụ chiều**: 1 hũ sữa chua không đường + nắm nhỏ hạt hạnh nhân.\n" +
            "- **Bữa tối**: 120g cá hồi áp chảo (hoặc thịt bò áp chảo) + salad xà lách dưa chuột sốt dầu ô liu.\n\n" +
            "*Bí quyết*: Hạn chế tối đa đường tinh luyện, đồ chiên rán mỡ dầu và hãy ngủ trước 23h nha!";
        } else if (cleanMsg.includes("gói tập") || cleanMsg.includes("bảng giá") || cleanMsg.includes("giá")) {
          simulatedReply += "Hiện FIT GYM đang cung cấp 4 sự lựa chọn tuyệt vời phù hợp với mọi nhu cầu:\n\n" +
            "1. **GÓI CƠ BẢN (500.000đ/Tháng)**: Tập tự do, xông hơi & locker free.\n" +
            "2. **GÓI TIÊU CHUẨN 6T (2.500.000đ/6 Tháng)**: Tặng kèm 2 buổi huấn luyện PT.\n" +
            "3. **GÓI CAO CẤP 12T (4.500.000đ/12 Tháng)**: Tặng 5 buổi PT + tủ đồ cá nhân riêng.\n" +
            "4. **HỘI VIÊN VIP ELITE (12.000.000đ/12 Tháng)**: Có PT riêng 1:1 suốt hành trình!\n\n" +
            "Hãy chuyển sang tab **GÓI TẬP** ở thanh điều hướng để xem chi tiết nhé!";
        } else {
          simulatedReply += "Đó là một câu hỏi rất hay! Để có được vóc dáng săn chắc nhất, bạn cần kết hợp giữa:\n\n" +
            "- **Chế độ tập luyện**: Ít nhất 3-4 buổi/tuần, tăng dần độ nặng tạ (Progressive Overload).\n" +
            "- **Dinh dưỡng hợp lý**: Đảm bảo nạp đủ lượng Protein (1.5g - 2g trên mỗi kg thể trọng).\n" +
            "- **Phục hồi**: Ngủ đủ 7-8 tiếng mỗi đêm và giãn cơ sau mỗi buổi tập.\n\n" +
            "Bạn có muốn tôi lên lịch tập chi tiết phù hợp với cân nặng và chiều cao hiện tại của bạn không?";
        }
        
        // Add a slight latency to simulate AI thinking
        await new Promise((resolve) => setTimeout(resolve, 600));
        return res.json({ reply: simulatedReply });
      }
    } catch (err: any) {
      console.error("Error in /api/gym-coach:", err);
      return res.status(500).json({ error: err.message || "Internal server error." });
    }
  });

  // Handle client-side routing
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
