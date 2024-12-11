package servlet;

import dao.UserDAO;
import model.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.SQLException;

@WebServlet("/api/auth/login")
public class LoginServlet extends HttpServlet {
    private UserDAO userDAO = new UserDAO();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        String username = req.getParameter("username");
        String password = req.getParameter("password");

        System.out.println("收到登录请求: username=" + username);

        try {
            User user = userDAO.login(username, password);
            if (user != null) {
                System.out.println("登录成功: " + username);
                HttpSession session = req.getSession();
                session.setAttribute("user", user);
                resp.sendRedirect("/index.html");
            } else {
                System.out.println("登录失败: 用户名或密码错误");
                resp.setContentType("text/plain");
                resp.setCharacterEncoding("UTF-8");
                resp.getWriter().write("error:用户名或密码错误");
            }
        } catch (SQLException e) {
            System.out.println("登录异常: " + e.getMessage());
            e.printStackTrace();
            resp.setContentType("text/plain");
            resp.setCharacterEncoding("UTF-8");
            resp.getWriter().write("error:登录失败，请稍后重试");
        }
    }
} 