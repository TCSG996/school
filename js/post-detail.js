let currentPostId = null;

document.addEventListener('DOMContentLoaded', function() {
    // 从 URL 获取帖子 ID
    const urlParams = new URLSearchParams(window.location.search);
    currentPostId = urlParams.get('id');
    
    if (currentPostId) {
        loadPostDetail(currentPostId);
    }
});

function loadPostDetail(postId) {
    // 这里应该从后端获取帖子详情
    // 示例数据
    const post = {
        id: postId,
        title: "示例帖子标题",
        content: "这是帖子的详细内容...",
        author: "匿名用户",
        time: "2024-03-20 10:30",
        views: 100,
        likes: 50,
        replies: [
            {
                id: 1,
                content: "这是第一条回复",
                author: "用户A",
                time: "2024-03-20 11:00",
                likes: 5
            },
            {
                id: 2,
                content: "这是第二条回复",
                author: "用户B",
                time: "2024-03-20 11:30",
                likes: 3
            }
        ]
    };

    renderPostDetail(post);
}

function renderPostDetail(post) {
    document.getElementById('postTitle').textContent = post.title;
    document.getElementById('postAuthor').textContent = `作者：${post.author}`;
    document.getElementById('postTime').textContent = `发布时间：${post.time}`;
    document.getElementById('postViews').textContent = `浏览：${post.views}`;
    document.getElementById('postLikes').textContent = `点赞：${post.likes}`;
    document.getElementById('postContent').textContent = post.content;

    renderReplies(post.replies);
}

function renderReplies(replies) {
    const repliesList = document.getElementById('repliesList');
    repliesList.innerHTML = replies.map(reply => `
        <div class="reply-item" data-reply-id="${reply.id}">
            <div class="reply-header">
                <span>${reply.author}</span>
                <span>${reply.time}</span>
            </div>
            <div class="reply-content">${reply.content}</div>
            <div class="reply-actions">
                <button onclick="likeReply(${reply.id})">
                    点赞 ${reply.likes}
                </button>
            </div>
        </div>
    `).join('');
}

function showReplyForm() {
    document.querySelector('.reply-form').style.display = 'block';
}

function cancelReply() {
    document.querySelector('.reply-form').style.display = 'none';
    document.querySelector('.reply-form textarea').value = '';
}

function submitReply() {
    const content = document.querySelector('.reply-form textarea').value.trim();
    if (!content) {
        alert('请输入回复内容！');
        return;
    }

    // 这里应该发送到后端
    const newReply = {
        id: Date.now(),
        content: content,
        author: '当前用户',
        time: new Date().toLocaleString(),
        likes: 0
    };

    // 临时添加到页面
    const repliesList = document.getElementById('repliesList');
    const replyElement = document.createElement('div');
    replyElement.className = 'reply-item';
    replyElement.innerHTML = `
        <div class="reply-header">
            <span>${newReply.author}</span>
            <span>${newReply.time}</span>
        </div>
        <div class="reply-content">${newReply.content}</div>
        <div class="reply-actions">
            <button onclick="likeReply(${newReply.id})">
                点赞 ${newReply.likes}
            </button>
        </div>
    `;
    repliesList.insertBefore(replyElement, repliesList.firstChild);

    cancelReply();
}

function likePost() {
    // 这里应该发送到后端
    const likesElement = document.getElementById('postLikes');
    const currentLikes = parseInt(likesElement.textContent.split('：')[1]);
    likesElement.textContent = `点赞：${currentLikes + 1}`;
}

function likeReply(replyId) {
    // 这里应该发送到后端
    const replyElement = document.querySelector(`[data-reply-id="${replyId}"]`);
    const likesButton = replyElement.querySelector('.reply-actions button');
    const currentLikes = parseInt(likesButton.textContent.split(' ')[1]);
    likesButton.textContent = `点赞 ${currentLikes + 1}`;
} 