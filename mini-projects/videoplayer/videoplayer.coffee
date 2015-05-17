$ = jQuery

$("head").append "<link rel=\"stylesheet\" type=\"text/css\" href=\"resources/videoplayer.css\" />"

$.fn.addVideoPlayer = (properties) ->
	unless properties? then null

	unless properties.sources? and properties.sources.length > 1 then null

	videoPlayer = $ "<div class=\"video-player\">"

	video = $ "<video class=\"video\">"

	if properties.width? then video.attr "width", properties.width

	video.append "<source src=#{source} type=\"video/#{source.substring(source.lastIndexOf(".") + 1)}\" />" for source in properties.sources
	video.click ->
		togglePlayState videoPlayer

	controls = $ "<div class=\"video-controls\">"

	# Add progress bar
	videoProgressBar = $ "<div class=\"video-progress-bar\">"
	videoProgressBar.click (event) ->
		video[0].currentTime = video[0].duration * (event.pageX - $(@).position().left) / $(@).width()
		updateVideoProgress videoPlayer

	videoProgressBar.hover ->
		$(@).stop().animate
			height: 10
		, "fast"
	, ->
		$(@).stop().animate
			height: 5
		, "fast"

	currentVideoProgress = $ "<div class=\"current-video-progress\">"

	videoProgressBar.append currentVideoProgress

	controls.append videoProgressBar

	# Add play button
	playButton = $ "<div class=\"video-control-element play-button\">"
	playButton.html "<img src=\"resources/images/buttons/play.png\" width=\"16\" height=\"16\" />"
	playButton.click ->
		togglePlayState videoPlayer

	controls.append playButton

	# Add mute button
	muteButton = $ "<div title=\"Mute\" class=\"video-control-element mute-button\">"
	muteButton.html "<img src=\"resources/images/buttons/unmuted.png\" width=\"16\" height=\"16\" />"
	muteButton.tipsy
		gravity: "s"
	muteButton.click ->
		toggleMuteState videoPlayer

	controls.append muteButton

	# Add progress meter
	progressIndicator = $ "<div class=\"video-control-element progress-indicator\">"
	currentProgress = $ "<span class=\"current-progress\">"

	totalDuration = $ "<span class=\"total-duration\">"
	
	progressIndicator.append currentProgress
	progressIndicator.append totalDuration

	controls.append progressIndicator

	video.on "loadedmetadata", ->
		totalDuration.html " / #{formatTime video[0].duration}"

	video.on "progress", ->
		updateVideoProgress videoPlayer

	videoPlayer.append video
	videoPlayer.append controls

	$(@).append videoPlayer

	@

togglePlayState = (videoPlayer) ->
	video = $(videoPlayer).find(".video")[0]
	playButton = $(videoPlayer).find(".play-button")

	if video.paused
		video.play()
		playButton.html "<img src=\"resources/images/buttons/pause.png\" width=\"16\" height=\"16\" />"
	else
		video.pause()
		playButton.html "<img src=\"resources/images/buttons/play.png\" width=\"16\" height=\"16\" />"

toggleMuteState = (videoPlayer) ->
	video = $(videoPlayer).find(".video")[0]
	muteButton = $(videoPlayer).find(".mute-button")

	video.muted = !video.muted
	if video.muted
		muteButton.html "<img src=\"resources/images/buttons/muted.png\" width=\"16\" height=\"16\" />"
		muteButton.attr "title", "Unmute"
	else
		muteButton.html "<img src=\"resources/images/buttons/unmuted.png\" width=\"16\" height=\"16\" />"
		muteButton.attr "title", "Mute"

updateVideoProgress = (videoPlayer) ->
	video = $(videoPlayer).find(".video")[0]
	currentProgress = $(videoPlayer).find(".current-progress")
	currentVideoProgress = $(videoPlayer).find(".current-video-progress")

	currentProgress.html formatTime video.currentTime
	currentVideoProgress.width "#{100 * video.currentTime / video.duration}%"

formatTime = (seconds) ->
	hours = Math.floor seconds / 3600
	seconds %= 3600
	minutes = Math.floor seconds / 60
	seconds %= 60
	seconds = Math.floor seconds

	timeString = ""
	timeString += if hours > 0 then "#{hours}:" else ""
	timeString += minutes
	timeString += ":"
	timeString += if seconds >= 10 then seconds else if seconds > 0 then "0#{seconds}" else "00"

	timeString
