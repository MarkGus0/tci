window.requestAnimFrame = window.requestAnimationFrame;

function initStarryBackground() {
    let lastTime = 0;
    const rotationSpeed = 0.000001; // 降低旋转速度
    let rotation = 0;
    const canvas = document.getElementById('bg-home');
    const c = canvas.getContext('2d');
    
    const numStars = 1200; // 减少星星数量以提升性能
    const radius = '0.' + Math.floor(Math.random() * 9) + 1;
    let warp = 0;
    let centerX, centerY;
    let focalLength;
    const baseSpeed = 2; // 基础移动速度
    const warpSpeed = 10; // 超光速模式速度
    const fastSpeed = 7; // 快速模式速度
    
    let mode = 0; // 0: 正常模式, 1: 超光速模式(有拖尾), 2: 快速模式(无拖尾)
    let isAnimating = true; // 添加动画控制标志
    const stars = [];
    
    function initializeStars() {
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
        focalLength = canvas.width * 2;
        
        stars.length = 0;
        for(let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                z: Math.random() * canvas.width,
                o: '0.' + Math.floor(Math.random() * 99) + 1
            });
        }
    }
    
    function moveStars() {
        let currentSpeed;
        switch(mode) {
            case 1: // 超光速模式
                currentSpeed = warpSpeed;
                break;
            case 2: // 快速模式
                currentSpeed = fastSpeed;
                break;
            default: // 正常模式
                currentSpeed = baseSpeed;
        }
        
        for(let i = 0; i < numStars; i++) {
            const star = stars[i];
            star.z -= currentSpeed;
            
            // 只在正常模式下添加旋转效果，且降低旋转速度
            if (mode === 0) {
                const distance = Math.sqrt(Math.pow(star.x - centerX, 2) + Math.pow(star.y - centerY, 2));
                if (distance > canvas.width / 4) {
                    const angle = Math.atan2(star.y - centerY, star.x - centerX);
                    const newAngle = angle + rotation;
                    star.x = centerX + distance * Math.cos(newAngle);
                    star.y = centerY + distance * Math.sin(newAngle);
                }
            }
            
            if(star.z <= 0) {
                star.z = canvas.width;
                star.x = Math.random() * canvas.width;
                star.y = Math.random() * canvas.height;
            }
        }
        
        if (warp === 0) {
            rotation += rotationSpeed;
        }
    }
    
    function drawStars() {
        // 调整画布大小
        if(canvas.width != window.innerWidth || canvas.height != window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initializeStars();
        }
        
        switch(mode) {
            case 1: // 超光速模式 - 使用拖尾效果
                c.fillStyle = 'rgba(0,10,20,0.1)';
                break;
            default: // 正常模式和快速模式 - 无拖尾
                c.fillStyle = 'rgba(0,10,20,0.8)';
        }
        c.fillRect(0, 0, canvas.width, canvas.height);
        
        for(let i = 0; i < numStars; i++) {
            const star = stars[i];
            
            const pixelX = (star.x - centerX) * (focalLength / star.z);
            const pixelY = (star.y - centerY) * (focalLength / star.z);
            const pixelRadius = 1 * (focalLength / star.z);
            
            c.fillStyle = `rgba(209, 255, 255, ${star.o})`;
            
            if (mode === 1) { // 只在超光速模式下绘制拖尾线条
                const prevPixelX = (star.x - centerX) * (focalLength / (star.z + warpSpeed));
                const prevPixelY = (star.y - centerY) * (focalLength / (star.z + warpSpeed));
                
                c.beginPath();
                c.strokeStyle = `rgba(209, 255, 255, ${star.o})`;
                c.lineWidth = pixelRadius;
                c.moveTo(prevPixelX + centerX, prevPixelY + centerY);
                c.lineTo(pixelX + centerX, pixelY + centerY);
                c.stroke();
            } else { // 正常模式和快速模式都使用点状星星
                c.fillRect(
                    pixelX + centerX,
                    pixelY + centerY,
                    pixelRadius,
                    pixelRadius
                );
            }
        }
    }
    
    function executeFrame(currentTime) {
        if (!lastTime) lastTime = currentTime;
        const deltaTime = currentTime - lastTime;
        
        if (deltaTime > 33 && isAnimating) { // 限制帧率约为30fps，减少CPU占用
            lastTime = currentTime;
            moveStars();
            drawStars();
        }
        
        if (document.visibilityState === 'visible' && isAnimating) {
            requestAnimFrame(executeFrame);
        }
    }
    
    // 初始化并开始动画
    initializeStars();
    executeFrame(0);
    
    // 添加页面可见性变化监听
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            lastTime = 0;
            executeFrame(0);
        }
    });
    
    // 添加logo点击事件监听
    const logoImg = document.querySelector('img[src="assets/img/root/logo1.png"]');
    if (logoImg) {
        logoImg.style.cursor = 'pointer';
        logoImg.addEventListener('click', function() {
            mode = (mode + 1) % 3; // 在三种模式之间循环切换
            c.clearRect(0, 0, canvas.width, canvas.height);
        });
    }
    
    // 添加窗口大小调整事件监听
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initializeStars();
    });
    
    // 添加页面切换事件监听，优化性能
    document.addEventListener('fullpage:beforeLeave', function() {
        isAnimating = false; // 页面切换时暂停动画
    });
    
    document.addEventListener('fullpage:afterLoad', function(e) {
        if (e.detail && e.detail.anchor === 'Home') {
            isAnimating = true; // 回到首页时恢复动画
            executeFrame(0);
        } else {
            isAnimating = false; // 其他页面暂停动画
        }
    });
    
    // 监听页面滚动事件，进一步优化
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        isAnimating = false;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            const homeSection = document.querySelector('[data-anchor="Home"]');
            if (homeSection && homeSection.classList.contains('active')) {
                isAnimating = true;
                executeFrame(0);
            }
        }, 150);
    });
}

// 页面加载完成后初始化星空背景
document.addEventListener('DOMContentLoaded', initStarryBackground);