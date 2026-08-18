// Slideshow functionality
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('slideshowDots');
const prevBtn = document.getElementById('slidePrev');
const nextBtn = document.getElementById('slideNext');

if (slides.length > 0) {
  let currentIndex = 0;
  let slideTimer = null;
  const slideInterval = 5000;
  const dots = [];

  // ドット（天）の生成：画像の数だけ動的に生成
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `slideshow-dot${idx === 0 ? ' active' : ''}`;
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `スライド ${idx + 1} を表示`);
      dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
      
      dot.addEventListener('click', () => {
        goToSlide(idx);
      });
      
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });
  }

  function goToSlide(index) {
    if (slides.length <= 1) return;

    // 現在のスライドとドットを非アクティブ化
    slides[currentIndex].classList.remove('active');
    if (dots[currentIndex]) {
      dots[currentIndex].classList.remove('active');
      dots[currentIndex].setAttribute('aria-selected', 'false');
    }

    // インデックスを計算（ループ）
    currentIndex = (index + slides.length) % slides.length;

    // 新しいスライドとドットをアクティブ化
    slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) {
      dots[currentIndex].classList.add('active');
      dots[currentIndex].setAttribute('aria-selected', 'true');
    }

    // 自動スライドのタイマーをリセット
    startTimer();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startTimer() {
    if (slideTimer) {
      clearInterval(slideTimer);
    }
    if (slides.length > 1) {
      slideTimer = setInterval(nextSlide, slideInterval);
    }
  }

  // 前後矢印ボタンのイベントリスナー
  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
  }

  // スワイプ対応（スマートフォン・タッチデバイス向け）
  const heroSection = document.getElementById('home');
  if (heroSection) {
    let touchStartX = 0;
    let touchEndX = 0;

    heroSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      const minSwipeDistance = 40;
      if (swipeDistance > minSwipeDistance) {
        prevSlide();
      } else if (swipeDistance < -minSwipeDistance) {
        nextSlide();
      }
    }
  }

  // 初期タイマースタート
  startTimer();
}

// Navigation Drawer Functionality
const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');
const navDrawer = document.getElementById('navDrawer');
const navOverlay = document.getElementById('navOverlay');
const navLinks = document.querySelectorAll('.nav-link');

function openMenu() {
  navOverlay.hidden = false;
  // Trigger reflow for transition
  void navOverlay.offsetWidth;
  navOverlay.classList.add('open');
  navDrawer.classList.add('open');
  menuToggle.setAttribute('aria-expanded', 'true');
  navDrawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('menu-open');
}

function closeMenu() {
  navDrawer.classList.remove('open');
  navOverlay.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  navDrawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
  
  setTimeout(() => {
    if (!navDrawer.classList.contains('open')) {
      navOverlay.hidden = true;
    }
  }, 350);
}

if (menuToggle && navDrawer) {
  menuToggle.addEventListener('click', () => {
    if (navDrawer.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

// Scroll Position Persistence across Page Reloads
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const SCROLL_KEY = 'ohira_scroll_position';

window.addEventListener('scroll', () => {
  sessionStorage.setItem(SCROLL_KEY, window.scrollY.toString());
}, { passive: true });

function restoreScrollPosition() {
  const savedPosition = sessionStorage.getItem(SCROLL_KEY);
  if (savedPosition !== null) {
    const targetY = parseInt(savedPosition, 10);
    if (!isNaN(targetY)) {
      window.scrollTo(0, targetY);
    }
  }
}

// Restore scroll position after DOM is ready and after load
window.addEventListener('DOMContentLoaded', restoreScrollPosition);
window.addEventListener('load', restoreScrollPosition);
