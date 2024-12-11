package servlet;

import dao.LikeDAO;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/like/*")
public class LikeServlet extends HttpServlet {
    private LikeDAO likeDAO = new LikeDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        
        try {
            int postId = Integer.parseInt(req.getParameter("postId"));
            String deviceId = req.getHeader("User-Agent"); // 使用User-Agent作为设备标识
            String ipAddress = getClientIpAddress(req);
            
            // 检查是否已点赞
            if (likeDAO.hasLikedToday(postId, deviceId, ipAddress)) {
                sendError(resp, "今天已经点过赞了");
                return;
            }
            
            // 获取当前登录用户ID（如果有）
            HttpSession session = req.getSession(false);
            Integer userId = session != null ? (Integer) session.getAttribute("userId") : null;
            
            // 添加点赞记录
            if (likeDAO.addLike(postId, userId, deviceId, ipAddress)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "点赞成功");
                resp.getWriter().write(new Gson().toJson(response));
            } else {
                sendError(resp, "点赞失败");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            sendError(resp, "操作失败");
        }
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
    
    private void sendError(HttpServletResponse resp, String message) throws IOException {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", message);
        resp.getWriter().write(new Gson().toJson(error));
    }
} 