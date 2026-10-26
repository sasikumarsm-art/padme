/**
 * Padme Oasis - Core Interactive JavaScript & Mobile Navigation Framework
 */

$(document).ready(function () {
  'use strict';

  // 1. Sticky Header Navigation Effect
  const $header = $('.header-nav');
  function checkHeaderScroll() {
    if ($(window).scrollTop() > 20) {
      $header.addClass('scrolled');
    } else {
      $header.removeClass('scrolled');
    }
  }
  checkHeaderScroll();
  $(window).on('scroll', checkHeaderScroll);

  // 1b. Smooth jQuery Hero Section Cross-Fading Slider
  const $heroSlides = $('.hero-slide-item');
  const $heroDots = $('.hero-slider-dot');
  let currentHeroSlide = 0;
  let heroSliderTimer = null;
  let isTransitioning = false;

  function goToHeroSlide(index) {
    if (index === currentHeroSlide || $heroSlides.length === 0 || isTransitioning) return;
    isTransitioning = true;

    const $current = $heroSlides.eq(currentHeroSlide);
    const $next = $heroSlides.eq(index);

    $heroDots.removeClass('active').eq(index).addClass('active');

    $current.fadeOut(500, function () {
      $current.removeClass('active');
      $next.fadeIn(500, function () {
        $next.addClass('active');
        isTransitioning = false;
      });
    });

    currentHeroSlide = index;
  }

  function startHeroSliderTimer() {
    stopHeroSliderTimer();
    heroSliderTimer = setInterval(function () {
      if ($heroSlides.length > 0) {
        let nextIndex = (currentHeroSlide + 1) % $heroSlides.length;
        goToHeroSlide(nextIndex);
      }
    }, 6000);
  }

  function stopHeroSliderTimer() {
    if (heroSliderTimer) clearInterval(heroSliderTimer);
  }

  $(document).on('click', '.next-slide', function (e) {
    e.preventDefault();
    let nextIndex = (currentHeroSlide + 1) % $heroSlides.length;
    goToHeroSlide(nextIndex);
    startHeroSliderTimer();
  });

  $(document).on('click', '.prev-slide', function (e) {
    e.preventDefault();
    let prevIndex = (currentHeroSlide - 1 + $heroSlides.length) % $heroSlides.length;
    goToHeroSlide(prevIndex);
    startHeroSliderTimer();
  });

  $(document).on('click', '.hero-slider-dot', function (e) {
    e.preventDefault();
    const targetIndex = parseInt($(this).attr('data-slide'), 10);
    goToHeroSlide(targetIndex);
    startHeroSliderTimer();
  });

  if ($heroSlides.length > 0) {
    $heroSlides.hide().eq(0).show().addClass('active');
    startHeroSliderTimer();
  }

  // 2. Mobile Drawer Navigation Toggle
  const $mobileDrawer = $('#mobileNavDrawer');
  const $mobileOverlay = $('#mobileNavOverlay');
  const $mobileBottomAppbar = $('#mobileBottomAppbar');

  $(document).on('click', '.btn-mobile-toggle', function (e) {
    e.preventDefault();
    $mobileDrawer.addClass('open');
    $mobileOverlay.addClass('open');
    $mobileBottomAppbar.addClass('hidden-modal');
    $('body').css('overflow', 'hidden');
  });

  $(document).on('click', '.btn-close-drawer, #mobileNavOverlay, .mobile-drawer-link', function () {
    $mobileDrawer.removeClass('open');
    $mobileOverlay.removeClass('open');
    if (!$('#bookingModal').hasClass('show')) {
      $mobileBottomAppbar.removeClass('hidden-modal');
      $('body').css('overflow', '');
    }
  });

  $(window).on('resize', function () {
    if ($(window).width() >= 992) {
      $mobileDrawer.removeClass('open');
      $mobileOverlay.removeClass('open');
      $('body').css('overflow', '');
    }
  });

  // 3. Mobile Bottom App Bar Active State Detection
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  $('.mobile-appbar-item').removeClass('active');

  if (currentPath === '/' || currentPath === '/index.html') {
    $('.mobile-appbar-item[href="/"]').addClass('active');
  } else if (currentPath.includes('individual-coaching') || currentPath.includes('private') || currentPath.includes('group') || currentPath.includes('retreats')) {
    $('.mobile-appbar-item[href="/individual-coaching"]').addClass('active');
  } else if (currentPath.includes('our-approach')) {
    $('.mobile-appbar-item[href="/our-approach"]').addClass('active');
  } else if (currentPath.includes('insights')) {
    $('.mobile-appbar-item[href="/insights"]').addClass('active');
  } else if (currentPath.includes('contact')) {
    $('.mobile-appbar-item[href="/contact"]').addClass('active');
  }

  // 4. Modal Open/Close Event Handling to Hide Bottom App Bar
  $('#bookingModal').on('show.bs.modal', function () {
    $mobileBottomAppbar.addClass('hidden-modal');
  });

  $('#bookingModal').on('hidden.bs.modal', function () {
    if (!$mobileDrawer.hasClass('open')) {
      $mobileBottomAppbar.removeClass('hidden-modal');
      $('body').css('overflow', '');
    }
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      $mobileDrawer.removeClass('open');
      $mobileOverlay.removeClass('open');
      $('#bookingModal').modal('hide');
      $mobileBottomAppbar.removeClass('hidden-modal');
      $('body').css('overflow', '');
    }
  });

  // 5. Scroll Reveal Animations via IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  // 6. Animated Counter for Verified Stats
  let counterTriggered = false;
  const $statNumber = $('.stat-counter');

  if ($statNumber.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counterTriggered) {
          counterTriggered = true;
          $statNumber.each(function () {
            const $this = $(this);
            const target = parseInt($this.attr('data-target') || '1000', 10);
            $({ countNum: 0 }).animate({ countNum: target }, {
              duration: 1800,
              easing: 'swing',
              step: function () {
                $this.text(Math.floor(this.countNum).toLocaleString() + '+');
              },
              complete: function () {
                $this.text(target.toLocaleString() + '+');
              }
            });
          });
        }
      });
    }, { threshold: 0.4 });

    $statNumber.each(function () {
      counterObserver.observe(this);
    });
  }

  // 7. Contact Form Client-Side Validation & Submission
  const $contactForm = $('#padmeContactForm');
  if ($contactForm.length) {
    $contactForm.on('submit', function (e) {
      e.preventDefault();

      const name = $('#fullName').val().trim();
      const email = $('#emailAddress').val().trim();
      const enquiryType = $('#enquiryType').val();
      const message = $('#messageText').val().trim();
      const privacy = $('#privacyCheck').is(':checked');

      let isValid = true;
      $('.invalid-feedback').hide();

      if (!name) {
        $('#fullName').next('.invalid-feedback').text('Please enter your full name.').show();
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        $('#emailAddress').next('.invalid-feedback').text('Please enter a valid email address.').show();
        isValid = false;
      }

      if (!enquiryType) {
        $('#enquiryType').next('.invalid-feedback').text('Please select an enquiry type.').show();
        isValid = false;
      }

      if (!message || message.length < 10) {
        $('#messageText').next('.invalid-feedback').text('Please share a few details (at least 10 characters).').show();
        isValid = false;
      }

      if (!privacy) {
        $('#privacyCheck').siblings('.invalid-feedback').text('Please confirm privacy acknowledgement.').show();
        isValid = false;
      }

      if (!isValid) return;

      const $submitBtn = $contactForm.find('button[type="submit"]');
      const originalText = $submitBtn.html();
      $submitBtn.html('<span class="spinner-border spinner-border-sm me-2" role="status"></span>Sending Message...').prop('disabled', true);

      $.ajax({
        url: '/api/contact',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name, email, enquiryType, message }),
        success: function () {
          $submitBtn.html(originalText).prop('disabled', false);
          $contactForm.slideUp(400, function () {
            $('#formSuccessMessage').removeClass('d-none').hide().fadeIn(400);
          });
        },
        error: function () {
          setTimeout(() => {
            $submitBtn.html(originalText).prop('disabled', false);
            $contactForm.slideUp(400, function () {
              $('#formSuccessMessage').removeClass('d-none').hide().fadeIn(400);
            });
          }, 600);
        }
      });
    });
  }

  // 8. Filter Buttons for Insights
  $('.filter-btn').on('click', function () {
    const category = $(this).attr('data-filter');
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');

    if (category === 'all') {
      $('.insight-card-item').fadeIn(300);
    } else {
      $('.insight-card-item').each(function () {
        if ($(this).attr('data-category') === category) {
          $(this).fadeIn(300);
        } else {
          $(this).fadeOut(200);
        }
      });
    }
  });

  // 9. Booking Conversation Modal Handling
  $('.btn-book-intro').on('click', function (e) {
    e.preventDefault();
    const targetProgram = $(this).attr('data-program') || 'Introductory Conversation';
    $('#bookingProgramTitle').text(targetProgram);
    $('#bookingModal').modal('show');
  });

  $('#bookingForm').on('submit', function (e) {
    e.preventDefault();
    const $btn = $(this).find('button[type="submit"]');
    $btn.html('<span class="spinner-border spinner-border-sm me-2"></span>Confirming...').prop('disabled', true);
    setTimeout(() => {
      $('#bookingForm').slideUp(300, function () {
        $('#bookingSuccessMessage').removeClass('d-none').hide().fadeIn(300);
      });
    }, 600);
  });
});
