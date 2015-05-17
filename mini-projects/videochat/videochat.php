<!DOCTYPE html>
<html>
	<head>
		<title>Video Chat</title>

		<script type="text/javascript" src="http://code.jquery.com/jquery-1.10.1.min.js"></script>

		<style type="text/css">
			* {
				margin: 0px;
				padding: 0px;
			}

			body {
				background-color: gray;
			}

			#other-view {
				position: fixed;

				width: 100%;
				height: 100%;
			}

			#self-view {
				position: fixed;

				margin: 0px;
				bottom: 0;
				width: 20%;
				height: 20%;
			}
		</style>
	</head>

	<body>
		<video id="other-view" autoplay></video>
		<video id="self-view" autoplay></video>
	</body>

	<script type="text/javascript" src="videochat.js"></script>
</html>