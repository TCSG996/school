document.addEventListener('DOMContentLoaded', function () {
    // 发布新表白
    const newPostBtn = document.querySelector('.new-post-btn');
    newPostBtn.addEventListener('click', function () {
        showPostModal();
    });

    // 回帖按钮点击事件
    const replyBtns = document.querySelectorAll('.reply-btn');
    replyBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            showReplyModal(this.closest('tr'));
        });
    });

    // 点赞按钮点击事件
    const likeBtns = document.querySelectorAll('.like-btn');
    likeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const postId = this.closest('tr').querySelector('td:first-child').textContent;
            handleLike(postId);
        });
    });

    // 详情按钮点击事件
    const detailBtns = document.querySelectorAll('.detail-btn');
    detailBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const postId = row.querySelector('td:first-child').textContent;
            window.location.href = `post-detail.html?id=${postId}`;
        });
    });
});

function showPostModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>发布新表白</h3>
            <textarea placeholder="请输入表白内容..."></textarea>
            <div class="modal-buttons">
                <button class="cancel-btn">取消</button>
                <button class="submit-btn">发布</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';

    // 添加事件处理
    modal.querySelector('.cancel-btn').onclick = () => modal.remove();
    modal.querySelector('.submit-btn').onclick = () => {
        const content = modal.querySelector('textarea').value;
        if (content.trim()) {
            addNewPost(content);
        }
        modal.remove();
    };
}

function showReplyModal(postRow) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>回复表白</h3>
            <textarea placeholder="请输入回复内容..."></textarea>
            <div class="modal-buttons">
                <button class="cancel-btn">取消</button>
                <button class="submit-btn">回复</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';

    // 添加事件处理
    modal.querySelector('.cancel-btn').onclick = () => modal.remove();
    modal.querySelector('.submit-btn').onclick = () => {
        const content = modal.querySelector('textarea').value;
        if (content.trim()) {
            const replyCount = postRow.querySelector('td:nth-last-child(3)');
            let count = parseInt(replyCount.textContent);
            replyCount.textContent = count + 1;
        }
        modal.remove();
    };
}

function addNewPost(content) {
    const tbody = document.querySelector('.love-wall table tbody');
    const newRow = document.createElement('tr');
    const date = new Date().toISOString().split('T')[0];

    newRow.innerHTML = `
        <td>${tbody.children.length + 1}</td>
        <td>${date}</td>
        <td class="message">${content}</td>
        <td>匿名用户</td>
        <td>0</td>
        <td>0</td>
        <td class="operation-buttons">
            <button class="like-btn">点赞</button>
            <button class="reply-btn">回帖</button>
            <button class="detail-btn">详情</button>
        </td>
    `;
    tbody.appendChild(newRow);
}

function handleLike(postId) {
    fetch('/api/like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `postId=${postId}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 更新点赞数显示
            const likeCount = document.querySelector(`[data-post-id="${postId}"] .like-count`);
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
            
            // 禁用点赞按钮
            const likeBtn = document.querySelector(`[data-post-id="${postId}"] .like-btn`);
            likeBtn.disabled = true;
            likeBtn.textContent = '已点赞';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Like error:', error);
        alert('点赞失败，请稍后重试');
    });
} 