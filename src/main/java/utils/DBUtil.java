package utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBUtil {
    private static final String URL = "jdbc:mysql://localhost:3306/login_db?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8";
    private static final String USERNAME = "root";     // 替换为你的MySQL用户名
    private static final String PASSWORD = "root";   // 替换为你的MySQL密码

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("MySQL驱动加载成功");
        } catch (ClassNotFoundException e) {
            System.out.println("MySQL驱动加载失败：" + e.getMessage());
            e.printStackTrace();
        }
    }

    public static Connection getConnection() throws SQLException {
        try {
            Connection conn = DriverManager.getConnection(URL, USERNAME, PASSWORD);
            System.out.println("数据库连接成功");
            return conn;
        } catch (SQLException e) {
            System.out.println("数据库连接失败：" + e.getMessage());
            throw e;
        }
    }
} 