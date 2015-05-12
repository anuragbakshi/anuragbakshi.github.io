<!DOCTYPE html>
<html>
	<head>
		<title>Video Player</title>

		<!-- jQuery -->
		<script type="text/javascript" src="http://code.jquery.com/jquery-1.10.1.min.js"></script>

		<!-- Tipsy -->
		<script type="text/javascript" src="https://rawgithub.com/jaz303/tipsy/master/src/javascripts/jquery.tipsy.js"></script>

		<script type="text/javascript" src="videoplayer.js"></script>

		<style type="text/css">
			* {
				margin: 0px;
				padding: 0px;
			}
		</style>
	</head>

	<body>
		<div id="player-container"></div>
	</body>

	<script type="text/javascript">
		$('#player-container').addVideoPlayer({
			sources: ['videos/master-surgeon.mp4', 'videos/master-surgeon.webm'],
			width: 720
		});
	</script>
</html>