package dao;

import model.User;
import utils.DBUtil;
import java.sql.*;

public class UserDAO {
    
    // 用户登录验证
    public User login(String username, String password) throws SQLException {
        String sql = "SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?";
        
        System.out.println("执行登录查询: " + username);
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, username);
            pstmt.setString(2, username);
            pstmt.setString(3, password);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    User user = new User();
                    user.setId(rs.getInt("id"));
                    user.setUsername(rs.getString("username"));
                    user.setEmail(rs.getString("email"));
                    user.setPhone(rs.getString("phone"));
                    System.out.println("查询到用户: " + user.getUsername());
                    return user;
                }
            }
        } catch (SQLException e) {
            System.out.println("登录查询失败: " + e.getMessage());
            throw e;
        }
        
        System.out.println("未找到用户");
        return null;
    }
    
    // 用户注册
    public boolean register(User user) throws SQLException {
        String sql = "INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)";
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, user.getUsername());
            pstmt.setString(2, user.getPassword());
            pstmt.setString(3, user.getEmail());
            pstmt.setString(4, user.getPhone());
            
            System.out.println("执行注册：" + user.getUsername());
            
            int result = pstmt.executeUpdate();
            System.out.println("注册结果：" + (result > 0 ? "成功" : "失败"));
            return result > 0;
        } catch (SQLException e) {
            System.out.println("注册失败：" + e.getMessage());
            throw e;
        }
    }
} 