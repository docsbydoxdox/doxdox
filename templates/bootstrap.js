(function (w, d, f) {

    'use strict';

    var protocol = w.location.protocol === 'file:' ? 'http:' : w.location.protocol,
        resource = [
            '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css',
            '//cdn.jsdelivr.net/highlight.js/8.0/styles/github.css',
            '//cdn.jsdelivr.net/highlight.js/8.0/highlight.min.js',
            '//cdn.jsdelivr.net/jquery/2.1.1/jquery.min.js'
        ];

    resource.forEach(function (url) {

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

            if (this.hasAttribute('src')) {

                resource.splice(resource.indexOf(this.getAttribute('src')), 1);

            } else if (this.hasAttribute('href')) {

                resource.splice(resource.indexOf(this.getAttribute('href')), 1);

            }

            if (!resource.length) {

                if ($.isReady) {

                    f();

                } else {

                    $(document).ready(f);

                }

            }

        });

        d.head.appendChild(tag);

    });

}(window, document, function () {

    var hash = window.location.hash,
        $hash_elem = $('[id="' + hash.replace(/#/, '') + '"]'),
        $code_block = $('.code'),
        $scope_private = $('.scope-private'),
        $toggle_code_blocks = $('.toggle-code-blocks')
        $toggle_private = $('.toggle-private');

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

}));
