(function($, undefined) {

    $.widget("ui.shuttle", {

        _create: function() {

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
            var shuttle = $('<div class="shuttle"></div>');

            this.leftList = this._createListBox(this.leftSelect, 'shuttle-left-list');
            shuttle.append(this.leftList);

            shuttle.append(this._createLeftButtonContainer());

            this.rightList = this._createListBox(this.rightSelect, 'shuttle-right-list');
            shuttle.append(this.rightList);

            shuttle.append(this._createRightButtonContainer());

            return shuttle;
        },
        _createListItem: function(option) {
            var listItem = $('<li class=\"ui-widget-content\"><span class=\"shuttle-icon ' + option.data('class') + '\"></span>' + option.text() + '</li>');
            listItem.data('shuttle', {option: option});
            return listItem;
        },
        _createListBox: function(select, clazz) {
            var listbox = $('<ul class=\"' + clazz + '\"></ul>');
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
            var leftButtonContainer = $('<div class="shuttle-button-container shuttle-left-button-container"></div>');

            leftButtonContainer.append(this._createCopyAllButton());
            leftButtonContainer.append(this._createCopySelectedButton());
            leftButtonContainer.append(this._createRemoveSelectedButton());
            leftButtonContainer.append(this._createRemoveAllButton());

            return leftButtonContainer;
        },
        _Move: { all: 'li.ui-selectee', selected: 'li.ui-selected' },
        _move : function(fromList, toList, selector) {
            $(fromList).find(selector).each(
                function() {
                    $(toList).append($(this));
                    $(toList).data('shuttle').select.append($(this).data('shuttle').option);
                });
        },
        _createCopyAllButton: function() {
            var widget = this;
            return $('<div class="shuttle-button-copy-all">Copiar Todos</div>')
                .button()
                .click(function() {
                    widget._move(widget.leftList, widget.rightList, widget._Move.all);
                });
        }
        ,
        _createCopySelectedButton: function() {
            var widget = this;
            return $('<div class="shuttle-button-copy-selected">Copiar</div>')
                .button()
                .click(function() {
                    widget._move(widget.leftList, widget.rightList, widget._Move.selected);
                });
        }
        ,
        _createRemoveSelectedButton: function() {
            var widget = this;
            return $('<div class="shuttle-button-remove-selected">Remover </div>')
                .button()
                .click(function() {
                    widget._move(widget.rightList, widget.leftList, widget._Move.selected);
                });
        }
        ,
        _createRemoveAllButton: function() {
            var widget = this;
            return $('<div class="button-remove-all">Remover Todos</div>')
                .button()
                .click(function() {
                    widget._move(widget.rightList, widget.leftList, widget._Move.all);
                });
        }
        ,
        _createRightButtonContainer: function() {
            var rightButtonContainer = $('<div class="shuttle-button-container shuttle-right-button-container"></div>');

            rightButtonContainer.append(this._createFirstButton());
            rightButtonContainer.append(this._createUpButton());
            rightButtonContainer.append(this._createDownButton());
            rightButtonContainer.append(this._createLastButton());

            return rightButtonContainer;
        }
        ,
        _createFirstButton: function() {
            var widget = this;
            return $('<div class="shuttle-button-first">Primeiro</div>').button().click(function() {
                var selectedItems = widget.rightList.find('.ui-selected');
                widget.rightList.prepend(selectedItems);
                $(selectedItems.get().reverse()).each(function() {
                    widget.rightList.data('shuttle').select.prepend($(this).data('shuttle').option);
                });
            });
        }
        ,
        _createUpButton: function() {
            var widget = this;
            return $('<div class="shuttle-button-up">Cima</div>').button().click(function() {
                widget.rightList.find('.ui-selected').each(
                    function() {
                        var previous = $(this).prev();
                        if (previous.data('shuttle') && !previous.hasClass('ui-selected')) {
                            $(this).insertBefore(previous);
                            $(this).data('shuttle').option.insertBefore(previous.data('shuttle').option);
                        }
                    });
            });
        }
        ,
        _createDownButton: function() {
            var widget = this;
            return $('<div class="shuttle-button-down">Baixo</div>').button().click(function() {
                $(widget.rightList.find('.ui-selected').get().reverse()).each(
                    function() {
                        var next = $(this).next();
                        if (next.data('shuttle') && !next.hasClass('ui-selected')) {
                            $(this).insertAfter(next);
                            $(this).data('shuttle').option.insertAfter(next.data('shuttle').option);
                        }
                    });
            });

        }
        ,
        _createLastButton: function() {
            var widget = this;
            return $('<div class="shuttle-button-last">&Uacute;ltimo</div>').button().click(function() {
                var selectedItems = widget.rightList.find('.ui-selected');
                widget.rightList.append(selectedItems);
                selectedItems.each(function() {
                    widget.rightList.data('shuttle').select.append($(this).data('shuttle').option);
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
})(jQuery);