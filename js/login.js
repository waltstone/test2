(function (){
			var elms = document.forms[0];
			var positions = ['<table>'];

			/* FileAPI.each(['TOP', 'CENTER', 'BOTTOM'], function (x, i){
				positions.push('<tr>');
				FileAPI.each(['LEFT', 'CENTER', 'RIGHT'], function (y, j){
					positions.push('<td><label><input type="radio" name="rel" value="'+ (i*3 + j) +'"/> '+x+'_'+y+'</label></td>');
				});
				positions.push('</tr>');
			}); */


			//pos.innerHTML += positions.join('')+'</table>';


			function _updWatermark(evt){
				var file = FileAPI.getFiles(elms.file)[0];
				//var rel =  (FileAPI.filter(elms.rel, function (rel){ return rel.checked; })[0] || {}).value;
				var type = (FileAPI.filter(elms.type, function (type){ return type.checked; })[0] || {}).value;
				//var overlay = { x: 5, y: 5, src: 'js/FileAPI-master/statics/watermark.png', rel: rel };

				document.getElementById('preview-processing').style.display = '';

				// Create preview
				FileAPI.Image(file)
					.resize(600, 600, 'max')
					//.overlay(overlay)
					.get(function (err, img){
						image.innerHTML = '';
						image.appendChild(img);
						document.getElementById('preview-processing').style.display = 'none';
					})
				;

				document.getElementById('uploading').style.display = '';

				// Upload
				FileAPI.upload({
					  url: '//rubaxa.org/FileAPI/server/ctrl.php'
					, files: elms.file
					, imageTransform: {
						  width: elms.width.value|0
						, height: elms.height.value|0
						, preview: true
						, type: type // Output type
						//, overlay: overlay // Add watermark
					}
					, upload: function (){
						document.getElementById('uploading').innerHTML = '(uploading&hellip;)';
					}
					, progress: function (evt){
						document.getElementById('uploading').innerHTML = (evt.loaded/evt.total * 100).toFixed(2) +'%';
					}
					, complete: function (err, xhr){
						if( err ){
							alert('Oops, server error.');
						} else {
							var res = JSON.parse(xhr.responseText);

							FileAPI.each(res.images, function (file){
								var matrix	= FileAPI.Image.prototype.getMatrix.call({ matrix: { dw: 300, dh: 300, resize: 'max' } }, file);

								FileAPI.Image.fromDataURL(file.dataURL, { width: matrix.dw, height: matrix.dh }, function (img){
									server.innerHTML = '';
									server.appendChild(img);
									server.innerHTML += '<div><b>'+file.width+'x'+file.height+', '+file.mime+', '+(file.size/1024).toFixed(3)+'KB</b></div>';
								});

								document.getElementById('uploading').style.display = 'none';
							});
						}
					}
				});
			}


			// Relative position
			/* FileAPI.each(pos.getElementsByTagName('input'), function (el){
				FileAPI.event.on(el, 'click', _updWatermark);
			}); */


			// Output type
			FileAPI.each(output.getElementsByTagName('input'), function (el){
				FileAPI.event.on(el, 'click', _updWatermark);
			});


			FileAPI.event.on(output, 'keyup', function (){
				clearTimeout(this.pid);
				this.pid = setTimeout(function (){
					_updWatermark();
				}, 1000);
			});


			FileAPI.event.on(elms.file, 'change', function (){
				FileAPI.getInfo(FileAPI.getFiles(elms.file)[0], function (err, info){
					var html = ['<table>'];

					FileAPI.each(info && info.exif, function (val, key){
						html.push('<tr><td>'+ key +'</td><td>'+ val +'</td></tr>');
					});
					exif.innerHTML = html.join('')+'</table>';

					elms.width.value = info.width;
					elms.height.value = info.height;

					preview.style.display = '';
					_updWatermark();
				});
			});
})();

$(function() {
    $( "#draggable" ).draggable();
    $( "#droppable" ).droppable({
      drop: function( event, ui ) {
        $( this )
          .addClass( "ui-state-highlight" )
          .find( "p" )
            .html( "Dropped!" );
      }
    });
  });


jQuery(function ($){
if( FileAPI.support.dnd ){
				$('#drag-n-drop').show();
				$(document).dnd(function (over){
					$('#drop-zone').toggle(over);
				}, function (files){
					onFiles(files);
				});
			}

}); // ready













