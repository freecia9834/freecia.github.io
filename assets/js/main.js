/*
	Lens by HTML5 UP (Modified for Freecia)
	01~12번 프로젝트별 개별 슬라이드 구현 버전
*/

var main = (function($) { var _ = {
	settings: { preload: false, slideDuration: 500, layoutDuration: 750, thumbnailsPerRow: 2, mainSide: 'right' },
	$window: null, $body: null, $main: null, $thumbnails: null, $viewer: null, $toggle: null, $navNext: null, $navPrevious: null,
	slides: [], current: null, locked: false,
	keys: { 27: function() { _.toggle(); }, 32: function() { _.next(); }, 39: function() { _.next(); }, 37: function() { _.previous(); } },

	initProperties: function() {
		_.$window = $(window); _.$body = $('body'); _.$thumbnails = $('#thumbnails');
		_.$viewer = $('<div id="viewer"><div class="inner"><div class="nav-next"></div><div class="nav-previous"></div><div class="toggle"></div></div></div>').appendTo(_.$body);
		_.$navNext = _.$viewer.find('.nav-next'); _.$navPrevious = _.$viewer.find('.nav-previous');
		_.$main = $('#main'); $('<div class="toggle"></div>').appendTo(_.$main); _.$toggle = $('.toggle');
	},

	initEvents: function() {
		_.$window.on('load', function() { _.$body.removeClass('is-preload-0'); window.setTimeout(function() { _.$body.removeClass('is-preload-1'); }, 100); });
		_.$navNext.on('click', function() { _.next(); });
		_.$navPrevious.on('click', function() { _.previous(); });
		_.$window.on('keydown', function(event) { if (event.keyCode in _.keys) { event.stopPropagation(); event.preventDefault(); (_.keys[event.keyCode])(); } });
		_.$toggle.on('click', function() { _.toggle(); });
	},

	initViewer: function() {
		_.$thumbnails.on('click', '.thumbnail', function(event) {
			var $this = $(this), $article = $this.closest('article');
			event.preventDefault(); event.stopPropagation();
			if (_.locked) return;

			// 클릭한 사진이 속한 'article' 그룹의 사진들만 슬라이드로 새로 구성함
			_.slides = [];
			$article.find('.thumbnail').each(function() {
				var $t = $(this), s = { $parent: $article, $slide: $('<div class="slide"><div class="caption"></div><div class="image"></div></div>'), url: $t.attr('href'), loaded: false };
				s.$slideImage = s.$slide.find('.image');
				s.$slideCaption = s.$slide.find('.caption');
				// 프로젝트 제목과 설명을 캡션에 넣음
				s.$slideCaption.html('<h2>' + $article.find('h2').text() + '</h2><p>' + $article.find('p').text() + '</p>');
				_.slides.push(s);
			});
			
			_.current = null;
			_.switchTo( $this.index($article.find('.thumbnail')) );
		});
	},

	init: function() {
		breakpoints({ xlarge: ['1281px','1680px'], large: ['981px','1280px'], medium: ['737px','980px'], small: ['481px','736px'], xsmall: [null,'480px'] });
		_.initProperties(); _.initViewer(); _.initEvents();
	},

	switchTo: function(index) {
		if (_.locked || _.current === index) return;
		_.locked = true;
		var oldSlide = (_.current !== null ? _.slides[_.current] : null), newSlide = _.slides[index];
		_.current = index;
		if (oldSlide) oldSlide.$slide.removeClass('active');
		
		var f = function() {
			if (oldSlide) oldSlide.$slide.detach();
			newSlide.$slide.appendTo(_.$viewer);
			if (!newSlide.loaded) {
				newSlide.$slide.addClass('loading');
				$('<img src="' + newSlide.url + '" />').on('load', function() {
					newSlide.$slideImage.css('background-image', 'url(' + newSlide.url + ')');
					newSlide.loaded = true; newSlide.$slide.removeClass('loading').addClass('active');
					setTimeout(function() { _.locked = false; }, 100);
				});
			} else {
				newSlide.$slide.addClass('active');
				setTimeout(function() { _.locked = false; }, 100);
			}
		};
		if (!oldSlide) f(); else setTimeout(f, _.settings.slideDuration);
	},

	next: function() { _.switchTo((_.current >= _.slides.length - 1) ? 0 : _.current + 1); },
	previous: function() { _.switchTo((_.current <= 0) ? _.slides.length - 1 : _.current - 1); },
	toggle: function() { if (_.$body.hasClass('fullscreen')) _.$body.removeClass('fullscreen'); else _.$body.addClass('fullscreen'); }
}; return _; })(jQuery); main.init();
