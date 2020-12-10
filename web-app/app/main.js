'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");
    });

    $( document ).on( 'click', function ( e ) {
        if ( $( e.target ).closest('#searchContainer').length === 0 ) {
            $( '#searchContainer' ).hide();
        }
    });
    
    $( document ).on( 'keydown', function ( e ) {
        if ( e.keyCode === 27 ) { // ESC
            $( '#searchContainer' ).hide();
        }
    });

    initCarousel();

    $(window).on('hashchange', function(e) {
        initCarousel();
    });

    function initCarousel() {
        $( '#home-carousel' ).carousel({
            interval: 3800,
            ride: 'carousel',
            keyboard: true,
            pause: 'hover'
        });
    }

    window.onscroll = function() {scrollFunction()};

    // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
    function scrollFunction() {
        var stickyHeader = document.getElementById("stickyHeader");
        var sticky = header.offsetHeight;
        var mybutton = document.getElementById("scrollToTopBtn");
        if (window.pageYOffset > sticky) {
            stickyHeader.classList.add("sticky");
        } else {
            stickyHeader.classList.remove("sticky");
        }
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            mybutton.style.display = "block";
          } else {
            mybutton.style.display = "none";
          }
    }

    $('#scrollToTopBtn').on('click', function() {
        window.scrollTo(0, 0); 
    });

    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });
    
    /*-------------------
		Nice Select
    --------------------- */
    $('.sorting, .p-show').niceSelect();
	

	/*-------------------
		Radio Btn
	--------------------- */
    $(".fw-size-choose .sc-item label, .pd-size-choose .sc-item label").on('click', function () {
        $(".fw-size-choose .sc-item label, .pd-size-choose .sc-item label").removeClass('active');
        $(this).addClass('active');
	});

    /*-------------------
		Product zoom
	--------------------- */
    $('.product-thumbs-track .pt').on('click', function(){
		$('.product-thumbs-track .pt').removeClass('active');
		$(this).addClass('active');
		var imgurl = $(this).data('imgbigurl');
		var bigImg = $('.product-big-img').attr('src');
		if(imgurl != bigImg) {
			$('.product-big-img').attr({src: imgurl});
			$('.zoomImg').attr({src: imgurl});
		}
	});

})(jQuery);