(function($, undefined) {

    $.widget("ui.shuttle", {
        options: {
            shuttleContainerClassName: '',
            leftList: {
                className: '',
                containerClassName: ''
            },
            rightList: {
                className: '',
                containerClassName: ''
            },
            buttonClass: '',
            buttonText: {
                copyAll: 'Copy All',
                copy: 'Copy',
                remove: 'Remove',
                removeAll: 'Remove All',
                first: 'First',
                up: 'Up',
                down: 'Down',
                last: 'Last'
            },
            leftButtonContainerClass: '',
            rightButtonContainerClass: ''
        },
        _create: function(options) {

            this.options = $.extend(this.options, options);

            var selects = $(this.element).find('select');

            if (!this._pluginPreconditionsOK(selects))
                return this;

            this.leftSelect = selects[0];
            this.rightSelect = selects[1];

            var shuttle = this._createShuttle();
            $(this.element).append(shuttle);

            return this;
        },
        _createShuttle: function() {
            var shuttle = $('<div>').attr('class', 'shuttle').addClass(this.options.shuttleContainerClassName);

            this.leftList = this._createListBox(this.leftSelect)
                .attr('class', 'shuttle-list shuttle-left-list')
                .addClass(this.options.leftList.className);

            shuttle.append($('<div>')
                .attr('class', 'shuttle-list-container shuttle-left-list-container')
                .addClass(this.options.leftList.containerClassName)
                .append(this.leftList));

            shuttle.append(this._createLeftButtonContainer());

            this.rightList = this._createListBox(this.rightSelect)
                .attr('class', 'shuttle-list shuttle-right-list')
                .addClass(this.options.rightList.className);

            shuttle.append($('<div>')
                .attr('class', 'shuttle-list-container shuttle-right-list-container')
                .addClass(this.options.rightList.containerClassName)
                .append(this.rightList));

            shuttle.append(this._createRightButtonContainer());

            return shuttle;
        },
        _createListItem: function(option) {
            var listItem = $('<li>').attr('class', 'ui-widget-content').text(option.text())
                .prepend($('<span>')
                .attr('class', 'shuttle-icon')
                .attr('style', 'background-image: url(' + option.data('icon') + ');')
            );

            listItem.data('shuttle', {option: option});

            return listItem;
        },
        _createListBox: function(select) {
            var listbox = $('<ul>');
            var widget = this;

            $(select).find('option').each(function() {
                listbox.append(widget._createListItem($(this)));
                listbox.data('shuttle', {select: $(select)});
            });

            return listbox.selectable({selected: function(evt, ui) {
                    var unselectedList = (this == widget.rightList.get(0)) ? widget.leftList : widget.rightList;
                    unselectedList.find('.ui-selected').removeClass('ui-selected');
                }}
            );
        },
        _createLeftButtonContainer: function() {
            var leftButtonContainer = $('<div>')
                .attr('class', 'shuttle-button-container shuttle-left-button-container')
                .addClass(this.options.leftButtonContainerClass);

            leftButtonContainer.append(this._createCopyAllButton());
            leftButtonContainer.append(this._createCopySelectedButton());
            leftButtonContainer.append(this._createRemoveSelectedButton());
            leftButtonContainer.append(this._createRemoveAllButton());

            return leftButtonContainer;
        },
        _updateScroll: function(list, elem) {
            var container = list.parent();
            if (elem.offset().top > container.innerHeight()) //element is below the viewport
                container.scrollTop(container.scrollTop() + elem.offset().top - container.innerHeight() + elem.outerHeight());
            else if (elem.offset().top < 0) //element is above the viewport
                container.scrollTop(container.scrollTop() + elem.offset().top);
        },
        _Move: {
            all: 'li.ui-selectee',
            selected: 'li.ui-selected'
        },
        _move : function(fromList, toList, selector) {
            var widget = this;
            toList = $(toList);
            $(fromList).find(selector).each(
                function() {
                    toList.append($(this));
                    toList.data('shuttle').select.append($(this).data('shuttle').option);
                    widget._updateScroll(toList, $(this));
                });
        },
        _createCopyAllButton: function() {
            var widget = this;
            return $('<div>').attr('class', 'shuttle-button shuttle-copy-all-button')
                .addClass(this.options.buttonClass)
                .text(this.options.buttonText.copyAll)
                .click(function() {
                    widget._move(widget.leftList, widget.rightList, widget._Move.all);
                });
        }
        ,
        _createCopySelectedButton: function() {
            var widget = this;
            return $('<div>').attr('class', 'shuttle-button shuttle-copy-button')
                .addClass(this.options.buttonClass)
                .text(this.options.buttonText.copy)
                .click(function() {
                    widget._move(widget.leftList, widget.rightList, widget._Move.selected);
                });
        }
        ,
        _createRemoveSelectedButton: function() {
            var widget = this;
            return $('<div>').attr('class', 'shuttle-button shuttle-remove-button')
                .addClass(this.options.buttonClass)
                .text(this.options.buttonText.remove)
                .click(function() {
                    widget._move(widget.rightList, widget.leftList, widget._Move.selected);
                });
        }
        ,
        _createRemoveAllButton: function() {
            var widget = this;
            return $('<div>').attr('class', 'shuttle-button shuttle-remove-all-button')
                .addClass(this.options.buttonClass)
                .text(this.options.buttonText.removeAll)
                .click(function() {
                    widget._move(widget.rightList, widget.leftList, widget._Move.all);
                });
        }
        ,
        _createRightButtonContainer: function() {
            var rightButtonContainer = $('<div>')
                .attr('class', 'shuttle-button-container shuttle-right-button-container')
                .addClass(this.options.rightButtonContainerClass);

            rightButtonContainer.append(this._createFirstButton());
            rightButtonContainer.append(this._createUpButton());
            rightButtonContainer.append(this._createDownButton());
            rightButtonContainer.append(this._createLastButton());

            return rightButtonContainer;
        },

        _createFirstButton: function() {
            var widget = this;
            return $('<div>').attr('class', 'shuttle-button shuttle-first-button')
                .addClass(this.options.buttonClass)
                .text(this.options.buttonText.first)
                .click(function() {
                    var selectedItems = widget.rightList.find('.ui-selected');
                    widget.rightList.prepend(selectedItems);
                    $(selectedItems.get().reverse()).each(function() {
                        widget.rightList.data('shuttle').select.prepend($(this).data('shuttle').option);
                        widget._updateScroll(widget.rightList, $(this));
                    });
                });
        },
        _createUpButton: function() {
            var widget = this;
            return $('<div>').attr('class', 'shuttle-button shuttle-up-button')
                .addClass(this.options.buttonClass)
                .text(this.options.buttonText.up)
                .click(function() {
                    widget.rightList.find('.ui-selected').each(
                        function() {
                            var previous = $(this).prev();
                            if (previous.data('shuttle') && !previous.hasClass('ui-selected')) {
                                $(this).insertBefore(previous);
                                $(this).data('shuttle').option.insertBefore(previous.data('shuttle').option);
                                widget._updateScroll(widget.rightList, $(this));
                            }
                        });
                });
        }
        ,
        _createDownButton: function() {
            var widget = this;
            return $('<div>').attr('class', 'shuttle-button shuttle-down-button')
                .addClass(this.options.buttonClass)
                .text(this.options.buttonText.down)
                .click(function() {
                    $(widget.rightList.find('.ui-selected').get().reverse()).each(
                        function() {
                            var next = $(this).next();
                            if (next.data('shuttle') && !next.hasClass('ui-selected')) {
                                $(this).insertAfter(next);
                                $(this).data('shuttle').option.insertAfter(next.data('shuttle').option);
                                widget._updateScroll(widget.rightList, $(this));
                            }
                        });
                });

        }
        ,
        _createLastButton: function() {
            var widget = this;
            return $('<div>').attr('class', 'shuttle-button shuttle-last-button')
                .addClass(this.options.buttonClass)
                .text(this.options.buttonText.last)
                .click(function() {
                    var selectedItems = widget.rightList.find('.ui-selected');
                    widget.rightList.append(selectedItems);
                    selectedItems.each(function() {
                        widget.rightList.data('shuttle').select.append($(this).data('shuttle').option);
                        widget._updateScroll(widget.rightList, $(this));
                    });

                });
        }
        ,
        _error: function(txt) {
            if (console && console.error) {
                console.error(txt);
            }
        }
        ,
        _pluginPreconditionsOK: function(selects) {
            if (selects.length != 2) {
                this._error('Invalid number of <select> elements. There should have exactly 2 <select> elements as child of the matched query.');
                return false;
            } else {
                return true;
            }
        }
    });
})
    (jQuery);