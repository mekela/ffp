// page init
jQuery(function() {
	initFixLayout();
	initLightbox();
});

function initFixLayout() {
	var win = jQuery(window);
	var getWindowHeight = function() {
		return typeof window.innerHeight === 'number' ? window.innerHeight : document.documentElement.clientHeight;
	};
	var getSkipHeight = function(skipBlocks) {
		var height = 0;
		skipBlocks.each(function() {
			height += jQuery(this).outerHeight(true);
		});
		return height;
	};
	var resizeHandler = function() {
		var boxes = jQuery('.slideshow, .visual, .slideshow .slide, .visual .slide, .bg-stretch');
		var skipBlocks = jQuery('.fixed-nav');
		if (win.width() <= 1024) {
			boxes.css({
				height: getWindowHeight() - getSkipHeight(skipBlocks)
			});
		} else {
			boxes.css({
				height: ''
			});
		}
	};
	win.on('resize orientationchange load refresh', resizeHandler);
}

// create namespace
var Scripts = window.Scripts || {};

// fancybox modal popup init
function initLightbox() {
	jQuery('a.lightbox, a[rel*="lightbox"]').fancybox({
		helpers: {
			overlay: {
				css: {
					background: 'rgba(0, 0, 0, 0.6)'
				}
			}
		},
		afterLoad: function(current) {
			// handle custom close button in inline modal
			if (current.href.indexOf('#') === 0) {
				jQuery(current.href).find('a.close').off('click.fb').on('click.fb', function(e) {
					e.preventDefault();
					jQuery.fancybox.close();
				});
			}
		},
		padding: 0
	});
}

// initialize custom form elements
Scripts.customForms = {
	init: function() {
		jcf.setOptions('Select', {
			wrapNative: false,
			wrapNativeOnMobile: false
		});
		jcf.replaceAll();
	},
	destroy: function(page) {
		page.find('select, input, textarea, .jcf-scrollable').each(function() {
			var jcfInstance = jQuery(this).data('jcfInstance');

			if (jcfInstance) {
				jcfInstance.destroy();
			}
		});
	}
};

Scripts.formValidation = {
	init: function(page) {
		getCurrElements(page, '.form-validation').formValidation({
			addClassToParent: '.validation-row',
			errorClass: 'input-error'
		});
	},
	destroy: function(page) {
		getCurrElements(page, '.form-validation').each(function() {
			var instance = jQuery(this).data('FormValidation');

			if (instance) {
				instance.destroy();
			}
		});
	}
};

Scripts.carousel = {
	init: function(page) {
		getCurrElements(page, '.carousel-alt').verticalGallery({
			visibleNum: 1,
			autorotation: true
		});
		getCurrElements(page, '.carousel').verticalGallery({
			visibleNum: this.mobileResolution ? 3 : 4,
			autorotation: true
		});
	},
	destroy: function(page) {
		getCurrElements(page, '.carousel, .carousel-alt').each(function() {
			var instance = jQuery(this).data('VerticalGallery');

			if (instance) {
				instance.destroy();
			}
		});
	},
	responsiveHandler: function() {
		var self = this;
		this.mobileResolution = false;

		ResponsiveHelper.addRange({
			'..767': {
				on: function() {
					self.mobileResolution = true;
					jQuery('.carousel').each(function() {
						var instance = jQuery(this).data('VerticalGallery');

						if (instance) {
							instance.options.visibleNum = 3;
							instance.resizeHandler();
						}
					});
				}
			},
			'768..': {
				on: function() {
					self.mobileResolution = false;
					jQuery('.carousel').each(function() {
						var instance = jQuery(this).data('VerticalGallery');

						if (instance) {
							instance.options.visibleNum = 4;
							instance.resizeHandler();
						}
					});
				}
			}
		});
		return this;
	}
}.responsiveHandler();

Scripts.slideShow = {
	init: function(page) {
		getCurrElements(page, '.slideshow').fadeGallery({
			slides: 'div.slide',
			btnPrev: 'a.btn-prev',
			btnNext: 'a.btn-next',
			generatePagination: '.pagination',
			pagerLinks: '.pagination li',
			event: 'click',
			useSwipe: true,
			autoRotation: true,
			autoHeight: true,
			switchTime: 3000,
			animSpeed: 500
		});
	},
	destroy: function(page) {
		getCurrElements(page, '.slideshow').each(function() {
			var instance = jQuery(this).data('FadeGallery');

			if (instance) {
				instance.destroy();
			}
		});
	}
};

Scripts.retinaCover = {
	init: function(page) {
		getCurrElements(page, '.bg-stretch').retinaCover();
	},
	destroy: function() {

	}
};

Scripts.countdown = {
	init: function(page) {
		getCurrElements(page, '.countdown').countdown();
	},
	destroy: function(page) {
		getCurrElements(page, '.countdown').each(function() {
			var instance = jQuery(this).data('Countdown');

			if (instance) {
				instance.destroy();
			}
		});
	}
};

Scripts.fakeClearInput = {
	init: function(page) {
		getCurrElements(page, 'input, textarea').fakeClearInput();
	},
	destroy: function(page) {
		getCurrElements(page, 'input, textarea').each(function() {
			var instance = jQuery(this).data('FakeClearInput');

			if (instance) {
				instance.destroy();
			}
		});
	}
};

Scripts.pageParallax = {
	init: function(page) {
		if (!page) {
			page = jQuery('.parallax-body');
			this.page = page;
		}
		if (page && page.hasClass('parallax-body') && !this.mobileResolution) {
			page.pageParallax();
		}
	},
	destroy: function(page, destroy) {
		if (!page) {
			page = jQuery('.parallax-body');
			this.page = page;
		}
		if (page && page.data('PageParallax')) {
			page.data('PageParallax')[destroy ? 'destroy' : 'destroyPartially']();
		}
	},
	responsiveHandler: function() {
		var self = this;
		this.mobileResolution = false;

		ResponsiveHelper.addRange({
			'..1023': {
				on: function() {
					self.mobileResolution = true;

					self.destroy(null, true);
				},
				off: function() {
					self.mobileResolution = false;
					self.init();
				}
			}
		});
		return this;
	}
}.responsiveHandler();

Scripts.scrollFixedNav = {
	init: function(page) {
		if (this.isMobile) {
			getCurrElements(page, '#footer').each(function() {
				if (!jQuery(this).data('FixVisibleFooter')) {
					jQuery(this).fixVisibleFooter();
				}
			});
		}
	},
	destroy: function(page) {
		getCurrElements(page, '#footer').each(function() {
			if (jQuery(this).data('FixVisibleFooter')) {
				jQuery(this).data('FixVisibleFooter').destroy();
			}
		});
	},
	responsiveHandler: function() {
		var self = this;
		this.isMobile = false;
		ResponsiveHelper.addRange({
			'..1024': {
				on: function() {
					self.isMobile = true;
					self.init();
				},
				off: function() {
					self.isMobile = false;
					self.destroy();
				}
			}
		});
		return this;
	}
}.responsiveHandler();

Scripts.navGallery = {
	init: function(page) {
		var navClass = '.nav-galery-mask';
		var currNav = getCurrElements(page, navClass);
		var nav = currNav.length ? currNav : jQuery(navClass);

		if (this.isMobile) {
			nav.each(function() {
				if (!jQuery(this).data('NavGallery')) {
					jQuery(this).navGallery();
				}
			});
		}
	},
	destroy: function(page) {
		var navClass = '.nav-galery-mask';
		var currNav = getCurrElements(page, navClass);

		if (currNav.length) {
			currNav.each(function() {
				if (jQuery(this).data('NavGallery')) {
					jQuery(this).data('NavGallery').destroy();
				}
			});
		} else {
			this.init(page);
		}
	},
	responsiveHandler: function() {
		var self = this;
		this.isMobile = false;
		ResponsiveHelper.addRange({
			'..767': {
				on: function() {
					self.isMobile = true;
					self.init();
				},
				off: function() {
					self.isMobile = false;
					self.destroy();
				}
			}
		});
		return this;
	}
}.responsiveHandler();

function getCurrElements(page, selectors) {
	return page ? page.find(selectors) : jQuery(selectors);
}


// ajax project
jQuery(function() {
	// page init
	var Pages = {
		Common: [
			Scripts.customForms,
			Scripts.slideShow,
			Scripts.pageParallax,
			Scripts.formValidation,
			Scripts.navGallery,
			Scripts.scrollFixedNav,
			Scripts.retinaCover
		],
		About: [
			Scripts.carousel
		],
		Join: [
			Scripts.slideShow,
			Scripts.fakeClearInput
		],
		Access: [
			Scripts.countdown,
			Scripts.fakeClearInput
		],
		Contact: [
			Scripts.slideShow
		]
	};
	var pageController = {
		getActiveScripts: function(page) {
			var currPage = page || jQuery('.page');
			return Pages.Common.concat(Pages[currPage.data('page')] || []);
		},
		init: function(page) {
			var currPage = page || jQuery('.page');

			jQuery.each(this.getActiveScripts(currPage), function(index, widget) {
				widget.init(currPage);
			});
		},
		destroy: function(page) {
			var currPage = page || jQuery('.page');

			jQuery.each(this.getActiveScripts(currPage), function(index, widget) {
				if (widget.destroy) {
					widget.destroy(currPage);
				}
			});
		}
	};
	var isIE = detectIE();
	var switchPageTimer;
	var animSpeed = 1000;
	var animClass = 'page-anim-active';
	var prevWinScrollTop;
	var win = jQuery(window);
	var $ajaxPage = $('#wrapper'),
		options = {
			loadingClass: 'is-loading',
			prefetch: true,
			cacheLength: 4,
			onStart: {
				render: function() {
					prevWinScrollTop = win.scrollTop();
				}
			},
			onReady: {
				render: loadNewPage
			}
		};
	var smoothState = $ajaxPage.smoothState(options).data('smoothState');

	pageController.init();

	function loadNewPage($container, $newContent) {
		var $oldHideContent = $container.find('.page:first');
		var $oldShowContent = $container.find('.page:nth-child(2)');
		var fewContents = !!$oldShowContent.length;
		var $currContent = $newContent;

		window.scrollTo(0, prevWinScrollTop);
		jQuery('body').addClass(animClass);

		smoothState.restartCSSAnimations();
		clearTimeout(switchPageTimer);
		switchPageTimer = setTimeout(function() {
			jQuery('body').removeClass(animClass);
			pageController.destroy($oldHideContent);
			$oldHideContent.remove();
			window.scrollTo(0, 0);
			backNavigation($currContent);
			refreshParallax($currContent);
		}, animSpeed);

		if (fewContents) {
			pageController.destroy($currContent);
			$currContent = $oldShowContent.html($newContent.html()).attr('data-page', $newContent.data('page'));
		} else {
			$currContent.appendTo($container);
		}
		moveNavigation($oldHideContent, $currContent);
		pageController.init($currContent);
		win.trigger('refresh');
	}

	function moveNavigation($oldHideContent, $currContent) {
		var currNavigation = $currContent.find('.fixed-nav');
		var oldNavigation = jQuery('.fixed-nav').not(currNavigation);

		oldNavigation.remove();
		currNavigation.appendTo(jQuery('body'));
	}

	function backNavigation($currContent) {
		jQuery('.fixed-nav').appendTo($currContent);
		jQuery('.nav-galery-mask').trigger('setActiveNavItemPosition');
	}

	function refreshParallax($currContent) {
		var API = $currContent.data('PageParallax');

		if (API) {
			API.refresh();
			setTimeout(function() {
				API.refresh();
			}, isIE ? 1000 : 500);
		}
	}

	function detectIE() {
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf('MSIE ');
		if (msie > 0) {
			// IE 10 or older => return version number
			return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		}

		var trident = ua.indexOf('Trident/');
		if (trident > 0) {
			// IE 11 => return version number
			var rv = ua.indexOf('rv:');
			return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		}

		var edge = ua.indexOf('Edge/');
		if (edge > 0) {
			// Edge (IE 12+) => return version number
			return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
		}

		// other browser
		return false;
	}
});

//tab
$(document).ready(function() {

	$('.ways-list li a').click(function(event){
		event.preventDefault();
		$('.ways-list li a').removeClass('active');
		$(this).addClass('active');
		$('.ways-list__tab').hide();
		$($(this).attr('href')).show();
	});

});

var s = skrollr.init(/*other stuff*/);

//The options (second parameter) are all optional. The values shown are the default values.
skrollr.menu.init(s, {
	//skrollr will smoothly animate to the new position using `animateTo`.
	animate: true,

	//The easing function to use.
	easing: 'sqrt'
});