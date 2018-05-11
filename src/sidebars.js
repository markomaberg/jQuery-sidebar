/*!
 *  Sidebar
 */


; (function ($, window, document) {
    "use strict";

    var pluginName = 'sidebars',
        defaults = {
            propertyName: "value"
        };

    function Sidebars(el) {
        this.$toggler = $(el);
        this.$target = $(el).attr('data-sidebar-target');

        this.$sidebar = $(this.$target);
        this.$sidebar.addClass('sidebar-item');

        this.$closeButton = this.$sidebar.find('[data-sidebar-close]');

        this.$side = $(el).attr('data-sidebar-side') || "left";
        if (this.$side == "left") {
            this.$sidebar.addClass('sidebar-item--right');
        };

        this.$breakpoint = $(el).attr('data-sidebar-breakpoint');

        this.$body = $('body');
        this.$windowPos = 0;

        this.$wrapper = $(el).attr('data-sidebar-holder') || this.$body;
        this.$wrapper.addClass('sidebar-wrapper');
        
        this.init();
    };

    Sidebars.prototype = {
        init: function () {
            var $this = this;

            this.$sidebar.sidebar({ side: $this.$side });
            this.$sidebar.css('opacity', '1');

            //this.$sidebar.on('sidebar:opened', function () {});
            //this.$sidebar.on('sidebar:closed', function () {});

            this.$toggler.on('click', function () {
                $this.triggerSidebar();
            });

            this.$closeButton.on('click', function () {
                $this.triggerSidebar();
            });

            $(window).resize(function () {
                if ($(window).width() > $this.$breakpoint && $this.$sidebar.hasClass('show')) {
                    $this.triggerSidebar();
                    $this.$toggler.hide();
                }
                $this.checkBreakpoint();
            });

            $this.checkBreakpoint();
        },
        triggerSidebar: function () {
            if (!this.$sidebar.hasClass('show')) {
                this.$windowPos = $(window).scrollTop();
            };
            this.$sidebar.trigger('sidebar:toggle');
            this.$sidebar.toggleClass('show');
            this.$body.toggleClass('sidebar-open');

            if (this.$sidebar.hasClass('show')) {
                this.createOverlay();
            } else {
                this.deleteOverlay();
            };
        },
        createOverlay: function () {
            var $this = this;
            $('<div class="sidebar-backdrop fade show"></div>').appendTo(this.$wrapper);
            $('.sidebar-backdrop').on('click', function () {
                $this.triggerSidebar();
            });
        },
        deleteOverlay: function () {
            $(window).scrollTop(this.$windowPos);
            $('.sidebar-backdrop').remove();
        },
        checkBreakpoint: function () {
            var $this = this;

            if ($(window).width() > $this.$breakpoint) {
                $this.$toggler.hide();
            } else {
                $this.$toggler.show();
            }
        }
    }

    $.fn[pluginName] = function (options) {
        // slice arguments to leave only arguments after function name
        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function () {
            var item = $(this), instance = item.data('plugin_' + pluginName);
            if (!instance) {
                // create plugin instance and save it in data
                item.data('plugin_' + pluginName, new Sidebars(this, options));
            } else {
                // if instance already created call method
                if (typeof options === 'string') {
                    instance[options].apply(instance, args);
                }
            }
        });
    }

})(jQuery, window, document);



$(function () {
    $('*[data-sidebar-toggle]').sidebars({});
})
