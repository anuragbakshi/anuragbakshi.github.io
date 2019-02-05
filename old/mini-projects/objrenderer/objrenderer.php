<!DOCTYPE html>
<html>
	<head>
		<title>OBJ Renderer</title>

		<script type="text/javascript" src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
		<script type="text/javascript" src="https://rawgithub.com/toji/gl-matrix/master/dist/gl-matrix.js"></script>
		<script type="text/javascript" src="https://rawgithub.com/html5rocks/www.html5rocks.com/master/content/tutorials/webgl/webgl_orthographic_3d/static/webgl/resources/webgl-utils.js"></script>

		<script type="text/javascript" src="../libs/objloader/obj-loader.js"></script>

		<script type="text/javascript" src="http://coffeescript.org/extras/coffee-script.js"></script>
		<!-- WebGL shaders. --><!--
		<script id="vertex-shader" type="x-shader/x-vertex" src="shaders/vertex.vs"></script>
		<script id="fragment-shader" type="x-shader/x-fragment" src="shaders/fragment.fs"></script>-->

		<style type="text/css">
			* {
				margin: 0px;
				padding: 0px;
			}

			#main-canvas {
				position: fixed;
			}
		</style>
	</head>

	<body>
		<canvas id="main-canvas"></canvas>
	</body>

	<!-- Tiny script to make canvas fill screen. -->
	<script type="text/javascript">
		var canvas = $('#main-canvas');

		canvas.attr('width', $(window).width());
		canvas.attr('height', $(window).height());
	</script>

	<!-- // <script type="text/javascript" src="webgltest.js"></script> -->
	<script type="text/coffeescript" src="objrenderer.coffee"></script>
</html>