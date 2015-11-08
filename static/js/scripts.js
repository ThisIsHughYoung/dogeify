// Utility function to get the value of a get request argument
function get(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
   return decodeURIComponent(name[1]);
}

function pushDogeHistory() {
	history.pushState(null, null, "dogeify?userText=" + encodeURIComponent($('#userTextArea').val()))
	ga('send', 'pageview', "dogeify?userText=" + encodeURIComponent($('#userTextArea').val()));	
}

// Send an ajax POST request, and handle/format the dogeified response.
function doDogeAjax(text) {
		  $.ajax({
		    'url' : '/dogeify',
		    'type' : 'POST',
		    'data' : {
		      'userText' : text
		    },
		  //The response from the server
		    'success' : function(data) {
		      if (data != "fail") {
				$('#dogeTextTitle').show();
				pushDogeHistory();
				$('#getResponse').html('');
				var dogePairs = data.list[1];
				for (var i = 0; i < dogePairs.length; i++) {
					var dogePair = dogePairs[i];
					var dogeText = dogePair[0];
					var color = dogePair[1];
					var div = $('<span></span>')
					div.addClass("wow");
					div.css({'color': color});
					div.text(dogeText + " ");
					div.appendTo('#getResponse');
				};
		      }
		    }
		  });
}

function doLuckyAjax() {
          $.ajax({
            'url' : '/lucky',
          //The response from the server
            'success' : function(data) {
              if (data != "fail") {
		$('#dogeTextTitle').show();
                $('#getResponse').html('');
                var undogedText = data.list[0];
                $('#userTextArea').val(undogedText);
		pushDogeHistory();
                var dogePairs = data.list[1];
                for (var i = 0; i < dogePairs.length; i++) {
                    var dogePair = dogePairs[i];
                    var dogeText = dogePair[0];
                    var color = dogePair[1];
		    var div = $('<span></span>')
		    div.addClass("wow");
		    div.css({'color': color});
		    div.text(dogeText + " ");
		    div.appendTo('#getResponse');
                };
		
		// Scroll the textarea to the top so
		// the user can see the new input
                $('#userTextArea').scrollTop(0);
              }
            }
          });
}

/**
 * Character Counter v1.5.1
 * ======================
 *
 * Character Counter is a simple, Twitter style character counter.
 *
 * https://github.com/dtisgodsson/jquery-character-counter
 *
 * @author Darren Taylor
 * @author Email: shout@darrenonthe.net
 * @author Twitter: darrentaytay
 * @author Website: http://darrenonthe.net
 *
 */
(function($) {

    $.fn.characterCounter = function(opts){

        var defaults = {
            exceeded: false,
            counterSelector: false,
            limit: 150,
            renderTotal: false,
            counterWrapper: 'span',
            counterCssClass: 'counter',
            counterFormat: '%1',
            counterExceededCssClass: 'exceeded',
            increaseCounting: false,
            onExceed: function(count) {},
            onDeceed: function(count) {},
            customFields: {}
        };

        var options = $.extend(defaults, opts);

        return this.each(function() {
            var html5len = $(this).attr('maxlength');
            if (typeof html5len !== typeof undefined && html5len !== false) {
                $.extend(defaults, {
                    limit: parseInt($(this).attr('maxlength'))
                });
            }
            if (!options.counterSelector) {
                $(this).after(generateCounter());
            }
            bindEvents(this);
            checkCount(this);
        });

        function customFields(params)
        {
            var i, html='';

            for (i in params)
            {
                html += ' ' + i + '="' + params[i] + '"';
            }

            return html;
        }

        function generateCounter()
        {
            var classString = options.counterCssClass;

            if ( options.customFields.class )
            {
                classString += " " + options.customFields.class;
                delete options.customFields['class'];
            }

            return '<'+ options.counterWrapper +customFields(options.customFields)+' class="' + classString + '"></'+ options.counterWrapper +'>';
        }

        function renderText(count)
        {
            var rendered_count = options.counterFormat.replace(/%1/, count);

            if ( options.renderTotal )
            {
                rendered_count += '/'+ options.limit;
            }

            return rendered_count;
        }

        function checkCount(element)
        {
            var characterCount = $(element).val().length;
            var counter = options.counterSelector ? $(options.counterSelector) : $(element).nextAll("." + options.counterCssClass).first();
            var remaining = options.limit - characterCount;
            var condition = remaining < 0;

            if ( options.increaseCounting )
            {
                remaining = characterCount;
                condition = remaining > options.limit;
            }

            if ( condition )
            {
                counter.addClass(options.counterExceededCssClass);
                options.exceeded = true;
                options.onExceed(characterCount);
            }
            else
            {
                if ( options.exceeded ) {
                    counter.removeClass(options.counterExceededCssClass);
                    options.onDeceed(characterCount);
                    options.exceeded = false;
                }
            }

            counter.html(renderText(remaining));
        }

        function bindEvents(element)
        {
            $(element)
                .on("input change", function () {
                    checkCount(element);
                });
        }
    };

})(jQuery);
