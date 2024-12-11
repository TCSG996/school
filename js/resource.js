document.addEventListener('DOMContentLoaded', function() {
    // 上传按钮点击事件
    const uploadBtn = document.querySelector('.upload-btn');
    uploadBtn.addEventListener('click', showUploadModal);

    // 分类导航点击事件
    const navItems = document.querySelectorAll('.resource-nav li');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            filterResources(this.textContent);
        });
    });

    // 搜索功能
    const searchBtn = document.querySelector('.search-box button');
    const searchInput = document.querySelector('.search-box input');
    searchBtn.addEventListener('click', () => {
        searchResources(searchInput.value);
    });

    // 下载按钮点击事件
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const resourceName = row.querySelector('.resource-name span').textContent;
            downloadResource(resourceName);
        });
    });

    // 预览按钮点击事件
    const previewBtns = document.querySelectorAll('.preview-btn');
    previewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const resourceName = row.querySelector('.resource-name span').textContent;
            previewResource(resourceName);
        });
    });
});

function showUploadModal() {
    const modal = document.createElement('div');
    modal.className = 'upload-modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <h4>上传资源</h4>
            <div class="form-group">
                <label>资源名称</label>
                <input type="text" placeholder="请输入资源名称">
            </div>
            <div class="form-group">
                <label>资源类型</label>
                <select>
                    <option value="">请选择资源类型</option>
                    <option value="study">学习资料</option>
                    <option value="software">软件工具</option>
                    <option value="video">课程视频</option>
                    <option value="ebook">电子书籍</option>
                    <option value="other">其他资源</option>
                </select>
            </div>
            <div class="form-group">
                <label>选择文件</label>
                <input type="file">
            </div>
            <div class="modal-buttons">
                <button class="cancel-btn">取消</button>
                <button class="submit-btn">上传</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 添加事件处理
    modal.querySelector('.cancel-btn').onclick = () => modal.remove();
    modal.querySelector('.submit-btn').onclick = () => {
        uploadResource(modal);
        modal.remove();
    };
}

function filterResources(category) {
    // 实现资源过滤逻辑
    console.log('Filtering resources by category:', category);
}

function searchResources(keyword) {
    // 实现资源搜索逻辑
    console.log('Searching resources:', keyword);
}

function downloadResource(resourceName) {
    // 构建下载链接
    const downloadUrl = `/api/resources/download?name=${encodeURIComponent(resourceName)}`;
    
    // 创建一个临时的 a 标签来触发下载
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = resourceName;
    
    // 添加下载进度提示
    const progressModal = createProgressModal();
    document.body.appendChild(progressModal);
    
    // 模拟下载进度
    simulateDownloadProgress(progressModal, () => {
        document.body.removeChild(progressModal);
        // 实际下载
        link.click();
    });
}

function previewResource(resourceName) {
    const fileType = getFileType(resourceName);
    const previewUrl = `/api/resources/preview?name=${encodeURIComponent(resourceName)}`;
    
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h4>${resourceName}</h4>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                ${getPreviewContent(fileType, previewUrl)}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 关闭预览
    modal.querySelector('.close-btn').onclick = () => modal.remove();
}

function createProgressModal() {
    const modal = document.createElement('div');
    modal.className = 'progress-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h4>正在下载...</h4>
            <div class="progress-bar">
                <div class="progress"></div>
            </div>
            <div class="progress-text">0%</div>
        </div>
    `;
    return modal;
}

function simulateDownloadProgress(modal, callback) {
    const progress = modal.querySelector('.progress');
    const progressText = modal.querySelector('.progress-text');
    let width = 0;
    
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            callback();
        } else {
            width += 2;
            progress.style.width = width + '%';
            progressText.textContent = width + '%';
        }
    }, 50);
}

function getFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const typeMap = {
        'pdf': 'pdf',
        'doc': 'doc',
        'docx': 'doc',
        'jpg': 'image',
        'jpeg': 'image',
        'png': 'image',
        'gif': 'image',
        'mp4': 'video',
        'avi': 'video',
        'mp3': 'audio',
        'wav': 'audio'
    };
    return typeMap[ext] || 'other';
}

function getPreviewContent(fileType, url) {
    switch (fileType) {
        case 'pdf':
            return `<iframe src="${url}" width="100%" height="600px"></iframe>`;
        case 'image':
            return `<img src="${url}" style="max-width: 100%; max-height: 80vh;">`;
        case 'video':
            return `
                <video controls style="max-width: 100%;">
                    <source src="${url}" type="video/mp4">
                    您的浏览器不支持视频播放
                </video>`;
        case 'audio':
            return `
                <audio controls style="width: 100%;">
                    <source src="${url}" type="audio/mpeg">
                    您的浏览器不支持音频播放
                </audio>`;
        default:
            return '<p>该文件类型暂不支持预览，请下载后查看</p>';
    }
}

function uploadResource(modal) {
    // 实现资源上传逻辑
    const name = modal.querySelector('input[type="text"]').value;
    const type = modal.querySelector('select').value;
    const file = modal.querySelector('input[type="file"]').files[0];
    
    console.log('Uploading resource:', {
        name: name,
        type: type,
        file: file
    });
} 