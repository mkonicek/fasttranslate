// from jQuery samples - http://jqueryui.com/demos/autocomplete/#combobox

(function( $ ) {
    $.widget( "ui.combobox", {
        options: {
            spanId: ''
        },
		_create: function() {
			var self = this,
				originalSelect = this.element,
				select = this.element.hide(),
				selected = select.children( ":selected" ),
				value = selected.val() ? selected.text() : "";
			var theSpan = $("<span> /").insertAfter(select);    
			if (this.options.spanId) {
                theSpan.attr('id', this.options.spanId);
            }
			var input = this.input = $( "<input>" )
				.val( value )
				.autocomplete({
					delay: 0,
					minLength: 0,
					source: function( request, response ) {
						var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
						response( select.children( "option" ).map(function() {
							var text = $( this ).text();
							if ( this.value && ( !request.term || matcher.test(text) ) )
								return {
									label: text.replace(
										new RegExp(
											"(?![^&;]+;)(?!<[^<>]*)(" +
											$.ui.autocomplete.escapeRegex(request.term) +
											")(?![^<>]*>)(?![^&;]+;)", "gi"
										), "<strong>$1</strong>" ),
									value: text,
									option: this
								};
						}) );
					},
					select: function( event, ui ) {
						ui.item.option.selected = true;
						// raise change event on the original select item
			            $(originalSelect).change();
						self._trigger( "selected", event, {
							item: ui.item.option
						});
					},
					change: function( event, ui ) {
						if ( !ui.item ) {
							var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
								valid = false;
							select.children( "option" ).each(function() {
								if ( $( this ).text().match( matcher ) ) {
									this.selected = valid = true;
									return false;
								}
							});
							if ( !valid ) {
								// remove invalid value, as it didn't match anything
								$( this ).val( "" );
								select.val( "" );
								input.data( "autocomplete" ).term = "";
								return false;
							}
						}
					}
				})
				.addClass( "ui-widget ui-widget-content ui-corner-left" );	

            theSpan.append(input);

			input.data( "autocomplete" )._renderItem = function( ul, item ) {
				return $( "<li></li>" )
					.data( "item.autocomplete", item )
					.append( "<a>" + item.label + "</a>" )
					.appendTo( ul );
			};

			this.button = $( "<button type='button'>&nbsp;</button>" )
				.attr( "tabIndex", -1 )
				.attr( "title", "Show All Items" )
				.insertAfter( input )
				.button({
					icons: {
						primary: "ui-icon-triangle-1-s"
					},
					text: false
				})
				.removeClass( "ui-corner-all" )
				.addClass( "ui-corner-right ui-button-icon" )
				.click(function() {
					// close if already visible
					if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
						input.autocomplete("close");
						return;
					}
                    // pass empty string as value to search for, displaying all results	
					input.autocomplete("search", "");
					input.focus();
				});
		}, // create

		destroy: function() {
			this.input.remove();
			this.button.remove();
			this.element.show();
			$.Widget.prototype.destroy.call( this );
		}
	});
})( jQuery );

var randomSpanCounter = 0;

// Creates a span with a jQuery combo box based on existing select
$.prototype.makeComboBox = function()
{
    var newSpanId = 'randomSpanId' + randomSpanCounter;
    randomSpanCounter++;
    this.combobox({spanId: newSpanId});
    // raise blur - bubble up to recognize if clicked inside the div
    /*$("body").click(function (evt) {
        var target = evt.target;
        if(target.id !== 'cCmbDefaultLang'){
            setTargetLang('pl');
        }                
    });*/    
}