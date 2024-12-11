package dao;

import utils.DBUtil;
import java.sql.*;

public class LikeDAO {
    
    // 检查今天是否已点赞
    public boolean hasLikedToday(int postId, String deviceId, String ipAddress) throws SQLException {
        String sql = "SELECT COUNT(*) FROM likes WHERE post_id = ? AND (device_id = ? OR ip_address = ?) " +
                    "AND DATE(created_at) = CURRENT_DATE";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, postId);
            pstmt.setString(2, deviceId);
            pstmt.setString(3, ipAddress);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        }
        return false;
    }
    
    // 添加点赞记录
    public boolean addLike(int postId, Integer userId, String deviceId, String ipAddress) throws SQLException {
        String sql = "INSERT INTO likes (post_id, user_id, device_id, ip_address) VALUES (?, ?, ?, ?)";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, postId);
            pstmt.setObject(2, userId); // 可以为null
            pstmt.setString(3, deviceId);
            pstmt.setString(4, ipAddress);
            
            return pstmt.executeUpdate() > 0;
        }
    }
} 