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

            if (this.options.onSelectionChanged !== undefined) {
                this.options.onSelectionChanged(null, 0);
            }
        },

        select: function (elm) {
            var that = this,
                e = $.Event('select');
            elm.each(function () {
                if ($(this).hasClass(that.options.activeClass)) {
                    if (!that.keyShift && that.$element.children('tbody').children('tr').length != elm.length) {
                        $(this).removeClass(that.options.activeClass);
                        var index = that.rows.indexOf($(this).index());
                        if (index > -1) {
                            that.rows.splice(index, 1);
                        }
                    }
                }
                else
                {
                    $(this).addClass(that.options.activeClass);
                    that.rows.push($(this).index());
                }
            });

            if (that.options.onSelectionChanged !== undefined) {
                that.options.onSelectionChanged(elm, that.rows.length);
            }

            this.$element.trigger(e, [this.rows]);
        },

        listen: function () {
            var that = this;

            this.$element.children('tbody').children('tr:not(.' + that.options.unSelectableClass + ')')
                .on('click.tableselect', $.proxy(this.click, this));

            $(document).on('keydown.tableselect keyup.tableselect', function (e) {

                if (e.type === 'keydown') {
                    that.$element.attr('unselectable', 'on').on('selectstart.tableselect', false);
                }

                if (e.type === 'keyup') {
                    that.$element.attr('unselectable', 'off').off('selectstart.tableselect');
                }

                if (e.keyCode === 16) {
                    that.keyShift = (e.type === 'keydown');
                }

                if (e.keyCode === 17) {
                    that.keyCtrl = (e.type === 'keydown');
                }

                if (e.type === 'keydown' && e.ctrlKey && e.keyCode === 65) {
                    that.select(that.$element.children('tbody').children('tr'));
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            });
        },

        destroy: function () {
            var that = this;
            this.clear();
            this.$element.children('tbody').children('tr').off('.tableselect');
            $(document).off('.tableselect');
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

            if (data) { data['destroy'](); }

            $this.data('tableselect', (data = new TableSelect(this, options)));

            if (typeof option === 'string') {
                data[option]();
            }
        });
    };

    $.fn.tableselect.defaults = {
        multiple: true,
        activeClass: 'warning', // success, error, warning, info
        unSelectableClass: 'unSelectable' //Do not select row with this class
    };

    /* TABLESELECT NO CONFLICT
     * ======================= */

    $.fn.tableselect.Constructor = TableSelect;

    $.fn.tableselect.noConflict = function () {
        $.fn.tableselect = old;
        return this;
    };

}(window.jQuery));
