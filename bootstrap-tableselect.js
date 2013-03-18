/**
 * Table row selection for Twitter Bootstrap
 * 
 * @author Birkir Gudjonsson (birkir.gudjonsson@gmail.com)
 * @copyright (c) 2013
 * @licence http://www.apache.org/licenses/LICENSE-2.0
 */
(function ($) {

    'use strict';

    var old,
        TableSelect = function (element, options) {
            this.$element = $(element);
            this.options = $.extend({}, $.fn.tableselect.defaults, options);
            this.rows = [];
            this.lastSelected = null;
            this.listen();
        };

    /* TABLESELECT CLASS DEFINITION
     * ============================ */
    TableSelect.prototype = {

        constructor: TableSelect,

        click: function (e) {

            var row = $(e.currentTarget),
                els = this.$element.children('tbody').children('tr');

            if (this.keyCtrl !== true && this.keyShift !== true) {
                this.clear();
            }

            if (this.keyShift === true && this.lastSelected !== null) {
                if (this.lastSelected > row.index()) {
                    this.select(els.filter(':lt(' + this.lastSelected + '):gt(' + row.index() + ')'));
                } else {
                    this.select(els.filter(':lt(' + row.index() + '):gt(' + this.lastSelected + ')'));
                }
            }

            this.select(row);

            // set last selected
            this.lastSelected = row.index();
        },

        clear: function () {
            this.$element.children('tbody').children('tr').removeClass(this.options.activeClass);
            this.rows = [];
        },

        select: function (elm) {
            var that = this,
                e = $.Event('select');
            elm.each(function () {
                $(this).addClass(that.options.activeClass);
                that.rows.push($(this).index());
            });
            this.$element.trigger(e, [this.rows]);
        },

        listen: function () {
            var that = this;

            this.$element.children('tbody').children('tr')
                .on('click', $.proxy(this.click, this))
                .on('dblclick', $.proxy(this.dblclick, this));

            $(document).on('keydown keyup', function (e) {

                if (e.type === 'keydown') {
                    that.$element.attr('unselectable', 'on').on('selectstart', false);
                }

                if (e.type === 'keyup') {
                    that.$element.attr('unselectable', 'off').off('selectstart');
                }

                if (e.keyCode === 16) {
                    that.keyShift = (e.type === 'keydown');
                }

                if (e.keyCode === 17) {
                    that.keyCtrl = (e.type === 'keydown');
                }

                if (e.type === 'keydown' && e.keyCode === 65) {
                    that.select(that.$element.children('tbody').children('tr'));
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            });
        }
    };

    /* TABLESELECT PLUGIN DEFINITION
     * ============================= */

    old = $.fn.tableselect;

    $.fn.tableselect = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('tableselect'),
                options = $.extend({}, $.fn.tableselect.defaults, $this.data(), typeof option === 'object' && option);

            if (!data) {
                $this.data('tableselect', (data = new TableSelect(this, options)));
            }

            if (typeof option === 'string') {
                data[option]();
            }
        });
    };

    $.fn.tableselect.defaults = {
        multiple: true,
        activeClass: 'warning' // success, error, warning, info
    };

    /* TABLESELECT NO CONFLICT
     * ======================= */

    $.fn.tableselect.Constructor = TableSelect;

    $.fn.tableselect.noConflict = function () {
        $.fn.tableselect = old;
        return this;
    };

}(window.jQuery));
