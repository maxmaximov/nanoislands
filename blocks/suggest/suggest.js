;(function() {

    /**
     * Саджест
     * @namespace jquery.ui.suggest
     * @extends {jquery.ui.autocomplete} http://api.jqueryui.com/autocomplete/
     * @description
     *      Саджест это блок сотоящий из инпута и выпадающего списка.
     *      При вводе какого-либо значения в инпут это значение матчится на список
     *      слов из источника данных, и подходящие элементы из исходного списка
     *      показываются в выпадающем списке, в котором пользователь может выбрать
     *      нужный ему элемент.
     *      После выбора элемента значение инпута меняется на значение выбранного элемента
     *
     *      Поддерживаемые события:
     *        nb-type – всплывает при вводе значения в инпут
     *        nb-select – всплывает при выборе значения из саджеста
     *        nb-keypress-enter – всплывает при нажатии на энетер и отсутвии саджеста
     */

    /**
     * Опции инициализации саджеста
     * @description
     *     Эти опции могут быть определены в yate шаблонах при описании наноблока.
     *     Опции можно менять в рантайме через метод option
     *
     * @example
     *     var sug = nb.find('#mysuggest');
     *     sug.option('source', 'http://mydomain.com/user/search');
     *
     * @type {Object}
     */
    var optionsSuggest = {
        /**
         * Истоник данных
         * @description См. http://api.jqueryui.com/autocomplete/#option-source
         *
         * @type {(String|Array|Function)}
         */
        source: null,

        /**
         * Количество элеметов, при котором в выпадающем списке появляется скролл
         *
         * @type {Number}
         */
        countMax: 10,

        /**
         * Тип саджеста
         * @description
         *     Указывает из какого шаблона брать верстку для элемента выпадающего списка.
         *     См. файл suggest.yate: match /[.type].item nb-suggest
         *
         * @type {String}
         */
        type: 'default',

        /**
         * Включение или отключение выделения жирным начертанием результатов
         * матчинга в выпадающем списке.
         *
         * @type {Boolean}
         */
        highlight: false,

        /**
         * Размер блока.
         * @description Применятся на размер элементов в выпадающем списке.
         *
         * @type {String}
         */
        size: 's',

        /**
         * Количесвто введенных символов, после которого начинать поиск слов
         */
        minLength: 2
    }

    /**
     * Внешние методы саджеста
     * @interface
     * @type {Object}
     */
    var apiSuggest = {
        /**
         * Возвращает выбранный в саджесте элемент данных из истоника.
         * @return {Object}
         */
        getItemSelected: function() {
            return this.$input.data().uiSuggest.selectedItem;
        },

        /**
         * Устанавливает опцию для виджета.
         * По сути является аналогом jq.ui.option
         * http://api.jqueryui.com/autocomplete/#method-option
         *
         * @param  {String} name  Имя опции
         * @param  [value] Значение опции
         */
        option: function(name, value) {
            var args = Array.prototype.slice.call(arguments);
            args.unshift('option');
            return this.$input.suggest.apply(this.$input, args);
        },

        /**
         * Скрывает список предложений
         * http://api.jqueryui.com/autocomplete/#method-close
         */
        close: function() {
            return this.$input.suggest('close');
        },

        value: function() {
            return this.$input.val();
        }
    }



    $.widget("ui.suggest", $.ui.autocomplete, {
        options: optionsSuggest,

        _renderMenu: function( ul, items ) {
            var that = this;
            var html = '';

            $.each( items, function(index, item) {
                html += that._renderItem(item);
            });

            $(html).appendTo(ul);

            ul.children('li').each(function(index) {
                $(this).data("ui-autocomplete-item", items[index]);
            });
        },

        _renderItem: function(item) {
            var clone = $.extend({}, item);

            if (this.options.highlight) {
                if (typeof highlightings[this.options.type] == 'function') {
                    highlightings[this.options.type](clone, this._value());
                } else if (typeof this.options.highlight == 'function') {
                    this.options.highlight(clone, this._value());
                }
            }

            return yr.run('main', {
                item: clone,
                type: this.options.type,
                size: this.options.size
            }, 'nb-suggest');
        },

        _suggest: function(items) {
            this._super(items);

            if (this.options.countMax && !this._heightMax) {
                this._heightMax = this.menu.element.children().eq(0).height() * this.options.countMax;
                this.menu.element.css({
                    'max-height': this._heightMax,
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden'
                });
            }
        },

        search: function(value, event) {
            this._trigger('_search');

            return this._super(value, event);
        }
    });

    var highlightings = {
        'default': function(item, term) {
            var matcher = new RegExp( '(' + $.ui.autocomplete.escapeRegex(term) + ')', "i" );
            item.label = item.label.replace(matcher, '<b>$1</b>');
        },

        'username': function(item, term) {
            var matcher = new RegExp( '(' + $.ui.autocomplete.escapeRegex(term) + ')', "ig" );
            var matches = item.label.match(matcher);

            item.usernameHighlighted = item.username.replace(matcher, '<b>$1</b>');

            if (typeof item.email == 'string') {
                item.emailHighlighted = item.email.replace(matcher, '<b>$1</b>');
            }
        }
    }

    nb.define('suggest', $.extend({
        events: {
            'init': 'oninit'
        },

        oninit: function() {
            this.$node = $(this.node);

            var source = this.$node.data('source');

            this.$node.find('input').on('keydown', function(e) {
                var keyCode = $.ui.keyCode;

                if ($.inArray(e.keyCode, [ keyCode.ENTER, keyCode.NUMPAD_ENTER ]) !== -1) {
                    if (!this.$input.data().uiSuggest.menu.active) {
                        this.trigger('nb-keypress-enter', this.value());
                    }
                }
            }.bind(this));

            this.$input = this.$node.find('input').suggest({
                source: source,
                countMax: this.$node.data('countMax'),
                type: this.$node.data('type'),
                size: this.$node.data('size'),
                highlight: this.$node.data('highlight'),
                minLength: this.$node.data('minLength')
            });

            this.$suggest = this.$input.data().uiSuggest.menu.element;

            this.$suggest.addClass(this.$node.data('class-suggest'));

            this.$input.on('suggest_search', function(e) {
                this.trigger('nb-type', this.value());
            }.bind(this));

            this.$input.on('suggestselect', function(e, item) {
                this.trigger('nb-select', item.item);
            }.bind(this));
        }
    }, apiSuggest));

})();


