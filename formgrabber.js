(function() {
	//initialize required libraries
	function loadScript(url, callback)
	{
		/* adding the script tag to the head as suggested before */
		var head= document.getElementsByTagName('head')[0];
		var script= document.createElement('script');
		script.type= 'text/javascript';
		script.src= url;

	   script.onreadystatechange = callback;
	   script.onload = callback;

		/* fire the loading */
		head.appendChild(script);
		/*return false;*/
	}
	loadScript('http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js', function() {
		$.getScript('http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.5/jquery-ui.min.js', function() {
			// jQuery url parser minified
			jQuery.url=function(){var segments={};var parsed={};var options={url:window.location,strictMode:false,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}};var parseUri=function(){str=decodeURI(options.url);var m=options.parser[options.strictMode?"strict":"loose"].exec(str);var uri={};var i=14;while(i--){uri[options.key[i]]=m[i]||""}uri[options.q.name]={};uri[options.key[12]].replace(options.q.parser,function($0,$1,$2){if($1){uri[options.q.name][$1]=$2}});return uri};var key=function(key){if(!parsed.length){setUp()}if(key=="base"){if(parsed.port!==null&&parsed.port!==""){return parsed.protocol+"://"+parsed.host+":"+parsed.port+"/"}else{return parsed.protocol+"://"+parsed.host+"/"}}return(parsed[key]==="")?null:parsed[key]};var param=function(item){if(!parsed.length){setUp()}return(parsed.queryKey[item]===null)?null:parsed.queryKey[item]};var setUp=function(){parsed=parseUri();getSegments()};var getSegments=function(){var p=parsed.path;segments=[];segments=parsed.path.length==1?{}:(p.charAt(p.length-1)=="/"?p.substring(1,p.length-1):path=p.substring(1)).split("/")};return{setMode:function(mode){strictMode=mode=="strict"?true:false;return this},setUrl:function(newUri){options.url=newUri===undefined?window.location:newUri;setUp();return this},segment:function(pos){if(!parsed.length){setUp()}if(pos===undefined){return segments.length}return(segments[pos]===""||segments[pos]===undefined)?null:segments[pos]},attr:key,param:param}}();
			init(jQuery);
		})
	});
	
	function init($) {
		var FormGrabber = {
			display: function() {
				$(document).ready(function() {
					var buttons = '<div><button id="foo-grab">Grab Forms!</button><button id="foo-clear">Clear Forms</button>'
						+ '<style>.formGrabberFormElement{ clear:both; padding: 10px; margin:0px; }'
						+ ' .formGrabberFormElement label, .formGrabberFormElement input, .formGrabberFormElement select, .formGrabberFormElement textarea'
						+ ' { float:none; clear:both; margin:2px; padding:2px; position:static; }'
						+ ' .formgrabber td { padding:20px; border-bottom: 1px solid black; }'
						+ ' .formgrabber h2 {color: black;}</style></div>';
					$('<div class="formgrabber"><h2>CSRF FormGrabber</h2></div>').draggable().append(buttons).appendTo('body')
						.attr('style', 'position:absolute;top:40px;left:10px;background-color:#aeaeae;z-index:100;padding:10px;border:2px solid black;')
						.find('#foo-grab').click(function() {
							var display = $('<table style="border-top: 1px solid black; margin-top:10px"></table>');
							$('form').each(function() {
								var tr, td, 
									$form = $(this), /* each form */
									copiedForm;
								tr = $('<tr style="vertical-align:top;"></tr>').appendTo(display);
								td = $('<td style="border-right: 1px solid black;"></td>').appendTo(tr)
									.append('<p>Action: '+$form.attr('action')+'</p>')
									.append('<p>Method: '+$form.attr('method')+'</p>');

								copiedForm = $('<div></div>');

								$('input, select, textarea, button[type=submit]', this).each(function() {
									var $input = $(this), /* form input */
										label = $('label[for='+this.id+']').clone();

									$inputClone = $input.clone();

									if (label.length > 0) {
										/* we found a label */
										label.find('input, select, textarea, button[type=submit]').remove();
									} else {
										/* create a label based on the element name */
										label = $('<label for="'+$input.attr('id')+'">'+($input.attr('name') ? $input.attr('name') : $input.attr('id'))+'</label>');
									}
									if ($inputClone.is(':hidden')) {
										label.append(' (hidden element)');
										if ($inputClone.attr('type') == 'hidden') {
											$inputClone.attr('type', 'text');
										}
										$inputClone.show();
									}

									copiedForm.append(createField(label, $inputClone));
								});
								copiedForm.appendTo(td);

								var formhtml = copiedForm.html().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
									formAction = $form.attr('action'),
									td2 = $('<td><p>Copy the text below into the FormBuilder "Load Form" box.</p></td>').appendTo(tr);

								if (formAction.length < 1) {
									formAction = $.url.attr('source');
								} else {
									if ( (formAction.search('http') != 0) ) {
										if (formAction.charAt(0) != '/') {
											var dir = $.url.attr('directory');
											if (dir.charAt(dir.length-1) != '/') {
												formAction = '/' + formAction;
											}
											formAction = dir + formAction;
										}
										formAction = jQuery.url.attr("protocol") + '://' + jQuery.url.attr("host") + formAction;
									}
								}

								$('<textarea style="width:300px; height:200px"></textarea>').appendTo(td2).html(JSON.stringify([formhtml, formAction, $form.attr('method'), $form.attr('enctype')]))
									.mousedown(function(event) { 
										event.stopPropagation()
									}).click(function(event) {
										$(this).select();
									});
							});
							if (display.find('tr').length == 0) {
								display.append("<tr><td>No forms found on the current page.</td></tr>");
							}
							$(this).parent().append(display);
						}); // end find function
					$('#foo-clear').click(function() {
						$(this).parent().find('table').remove();
					});
				});

				//function used when building form display -- todo: refactor so its not sitting here looking wierd
				function createField(label, element) {
					return $('<div class="formGrabberFormElement"></div>').append(label).append(element);
				}
			}
		}
		FormGrabber.display();
	};
})();
