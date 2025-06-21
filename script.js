// 初始化 markdown-it 实例喵
const md = window.markdownit({
    html: true,        // 允许原生 HTML 标签喵
    linkify: true,     // 自动识别链接喵
    typographer: true  // 智能标点转换喵
});

// 章节数据结构喵
let chapters = [];
let chIndex = 0, fileIndex = 0;

// 从目录数据加载章节喵
async function loadChapterStructure() {
    try {
        const res = await fetch('contents.json');
        chapters = await res.json();
        generateTOC();
        loadCurrent();
    } catch (err) {
        console.error('加载目录结构失败:', err);
        // 默认回退数据喵
        chapters = [
            { name: '班级活动', files: ['序言.md', '谈我们的辩论赛.md'] },
            { name: '初入校园', files: ['序言.md'] }
        ];
        generateTOC();
        loadCurrent();
    }
}

// 加载并渲染当前 md 喵
async function loadCurrent() {
    const { name, files } = chapters[chIndex];
    const mdPath = `src/${name}/${files[fileIndex]}`;
    const res = await fetch(mdPath);
    const text = await res.text();
    // 用 markdown-it 渲染喵
    document.getElementById('markdown').innerHTML = md.render(text);
}

// 翻页逻辑（同 marked 版本喵）
function prevPage() {
    if (fileIndex > 0) {
        fileIndex--;
    } else if (chIndex > 0) {
        chIndex--;
        fileIndex = chapters[chIndex].files.length - 1;
    }
    loadCurrent();
    updateActiveTOC();
}
function nextPage() {
    if (fileIndex < chapters[chIndex].files.length - 1) {
        fileIndex++;
    } else if (chIndex < chapters.length - 1) {
        chIndex++;
        fileIndex = 0;
    }
    loadCurrent();
    updateActiveTOC();
}

// 绑定按钮与键盘喵
document.getElementById('prev').onclick = prevPage;
document.getElementById('next').onclick = nextPage;
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') {
        prevPage();
        updateActiveTOC();
    }
    if (e.key === 'ArrowDown') {
        nextPage();
        updateActiveTOC();
    }
});

// 生成目录喵
function generateTOC() {
    const tocList = document.getElementById('tocList');
    tocList.innerHTML = '';
    
    chapters.forEach((chapter, index) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = chapter.name;
        link.onclick = (e) => {
            e.preventDefault();
            chIndex = index;
            fileIndex = 0;
            loadCurrent();
            updateActiveTOC();
        };
        li.appendChild(link);
        
        const subList = document.createElement('ul');
        chapter.files.forEach((file, fileIdx) => {
            const subLi = document.createElement('li');
            const subLink = document.createElement('a');
            subLink.href = '#';
            subLink.textContent = file.replace('.md', '');
            subLink.dataset.chapter = index;
            subLink.dataset.file = fileIdx;
            subLink.onclick = (e) => {
                e.preventDefault();
                chIndex = index;
                fileIndex = fileIdx;
                loadCurrent();
                updateActiveTOC();
            };
            subLi.appendChild(subLink);
            subList.appendChild(subLi);
        });
        
        li.appendChild(subList);
        tocList.appendChild(li);
    });
    updateActiveTOC();
}

function updateActiveTOC() {
    document.querySelectorAll('#sidebar a').forEach(link => {
        link.classList.remove('active');
    });
    
    // 高亮当前章节
    const chapterLinks = document.querySelectorAll(`#sidebar li > a`);
    chapterLinks[chIndex]?.classList.add('active');
    
    // 高亮当前文件
    const fileLink = document.querySelector(`#sidebar a[data-chapter="${chIndex}"][data-file="${fileIndex}"]`);
    if (fileLink) {
        fileLink.classList.add('active');
        // 平滑滚动到可见区域
        fileLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// 页面初始化喵
loadChapterStructure();

// （下面是你的动态背景代码，不变喵）
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
function initCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    particles = Array.from({ length: 100 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
        r: 1 + Math.random() * 2
    }));
}
function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(100,150,255,0.6)';
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
    });
    requestAnimationFrame(draw);
}
window.onresize = initCanvas;
initCanvas();
draw();
