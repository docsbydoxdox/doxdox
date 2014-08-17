(function (w, d, f) {

    'use strict';

    var protocol = w.location.protocol === 'file:' ? 'http:' : w.location.protocol,
        resource = [
            '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css',
            '//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.1/styles/github.min.css',
            '//code.jquery.com/jquery-2.1.1.js',
            '//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.1/highlight.min.js'
        ];

    function loadResource(url) {

        var tag;

        if (url.match(/\.js$/)) {

            tag = d.createElement('script');
            tag.setAttribute('src', protocol + url);

        } else if (url.match(/\.css$/)) {

            tag = d.createElement('link');
            tag.setAttribute('rel', 'stylesheet');
            tag.setAttribute('href', protocol + url);

        }

        tag.addEventListener('load', function () {

            if (resource.length) {

                loadResource(resource.shift());

            } else {

                if ($.isReady) {

                    f();

                } else {

                    $(document).ready(f);

                }

            }

        });

        d.head.appendChild(tag);

    }

    loadResource(resource.shift());

}(window, document, function () {

    var hash = window.location.hash,
        $hash_elem = $('[id="' + hash.replace(/#/, '') + '"]'),
        $code_block = $('.code'),
        $scope_private = $('.scope-private'),
        $toggle_code_blocks = $('.toggle-code-blocks')
        $toggle_private = $('.toggle-private'),
        $backToTop = $('.back-to-top');

    function handleScrollEvent() {

        if (window.scrollY > 100 && $backToTop.not(':visible')) {

            $backToTop.fadeIn();

        } else if (window.scrollY < 100 && $backToTop.is(':visible')) {

            $backToTop.fadeOut();

        }

    }

    $toggle_code_blocks.on('click', function () {

        if ($toggle_code_blocks.is(':checked')) {
            $code_block.show();
        } else {
            $code_block.hide();
        }

    });

    $toggle_private.on('click', function () {

        if ($toggle_private.is(':checked')) {
            $scope_private.show();
        } else {
            $scope_private.hide();
        }

    });

    $code_block.hide();
    $scope_private.hide();

    if ($hash_elem.length && !$hash_elem.is(':visible')) {

        $toggle_private.trigger('click');

    }

    $('.examples pre code, .code pre code').each(function() {
        hljs.highlightBlock(this);
    });

    $(window).on('scroll', handleScrollEvent);

    handleScrollEvent();

}));
