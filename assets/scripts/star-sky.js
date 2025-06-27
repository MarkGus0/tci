// 星空背景效果
function createStarSky() {
    const starCount = 200;
    const container = document.createElement('div');
    container.className = 'star-sky';
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDuration = Math.random() * 3 + 's';
        container.appendChild(star);
    }
    
    document.body.appendChild(container);
}

document.addEventListener('DOMContentLoaded', createStarSky);