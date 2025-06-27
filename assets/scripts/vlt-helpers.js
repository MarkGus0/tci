// 辅助函数
(function($) {
    'use strict';
    
    // 检测移动设备
    window.isMobileDevice = function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    
    // 优化移动端性能
    window.optimizeMobile = function() {
        if (isMobileDevice()) {
            // 禁用某些动画效果
            $('body').addClass('vlt-mobile');
            // 优化图片加载
            $('img').attr('loading', 'lazy');
        }
    };
    
    // 平滑滚动
    window.smoothScroll = function(target) {
        $('html, body').animate({
            scrollTop: $(target).offset().top
        }, 1000);
    };
    
    // 初始化辅助函数
    $(document).ready(function() {
        optimizeMobile();
    });
    
})(jQuery);