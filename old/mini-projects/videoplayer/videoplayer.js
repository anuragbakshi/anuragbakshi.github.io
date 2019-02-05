// Generated by CoffeeScript 1.6.3
(function() {
  var $, formatTime, toggleMuteState, togglePlayState, updateVideoProgress;

  $ = jQuery;

  $("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"resources/videoplayer.css\" />");

  $.fn.addVideoPlayer = function(properties) {
    var controls, currentProgress, currentVideoProgress, muteButton, playButton, progressIndicator, source, totalDuration, video, videoPlayer, videoProgressBar, _i, _len, _ref;
    if (properties == null) {
      null;
    }
    if (!((properties.sources != null) && properties.sources.length > 1)) {
      null;
    }
    videoPlayer = $("<div class=\"video-player\">");
    video = $("<video class=\"video\">");
    if (properties.width != null) {
      video.attr("width", properties.width);
    }
    _ref = properties.sources;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      source = _ref[_i];
      video.append("<source src=" + source + " type=\"video/" + (source.substring(source.lastIndexOf(".") + 1)) + "\" />");
    }
    video.click(function() {
      return togglePlayState(videoPlayer);
    });
    controls = $("<div class=\"video-controls\">");
    videoProgressBar = $("<div class=\"video-progress-bar\">");
    videoProgressBar.click(function(event) {
      video[0].currentTime = video[0].duration * (event.pageX - $(this).position().left) / $(this).width();
      return updateVideoProgress(videoPlayer);
    });
    videoProgressBar.hover(function() {
      return $(this).stop().animate({
        height: 10
      }, "fast");
    }, function() {
      return $(this).stop().animate({
        height: 5
      }, "fast");
    });
    currentVideoProgress = $("<div class=\"current-video-progress\">");
    videoProgressBar.append(currentVideoProgress);
    controls.append(videoProgressBar);
    playButton = $("<div class=\"video-control-element play-button\">");
    playButton.html("<img src=\"resources/images/buttons/play.png\" width=\"16\" height=\"16\" />");
    playButton.click(function() {
      return togglePlayState(videoPlayer);
    });
    controls.append(playButton);
    muteButton = $("<div title=\"Mute\" class=\"video-control-element mute-button\">");
    muteButton.html("<img src=\"resources/images/buttons/unmuted.png\" width=\"16\" height=\"16\" />");
    muteButton.tipsy({
      gravity: "s"
    });
    muteButton.click(function() {
      return toggleMuteState(videoPlayer);
    });
    controls.append(muteButton);
    progressIndicator = $("<div class=\"video-control-element progress-indicator\">");
    currentProgress = $("<span class=\"current-progress\">");
    totalDuration = $("<span class=\"total-duration\">");
    progressIndicator.append(currentProgress);
    progressIndicator.append(totalDuration);
    controls.append(progressIndicator);
    video.on("loadedmetadata", function() {
      return totalDuration.html(" / " + (formatTime(video[0].duration)));
    });
    video.on("progress", function() {
      return updateVideoProgress(videoPlayer);
    });
    videoPlayer.append(video);
    videoPlayer.append(controls);
    $(this).append(videoPlayer);
    return this;
  };

  togglePlayState = function(videoPlayer) {
    var playButton, video;
    video = $(videoPlayer).find(".video")[0];
    playButton = $(videoPlayer).find(".play-button");
    if (video.paused) {
      video.play();
      return playButton.html("<img src=\"resources/images/buttons/pause.png\" width=\"16\" height=\"16\" />");
    } else {
      video.pause();
      return playButton.html("<img src=\"resources/images/buttons/play.png\" width=\"16\" height=\"16\" />");
    }
  };

  toggleMuteState = function(videoPlayer) {
    var muteButton, video;
    video = $(videoPlayer).find(".video")[0];
    muteButton = $(videoPlayer).find(".mute-button");
    video.muted = !video.muted;
    if (video.muted) {
      muteButton.html("<img src=\"resources/images/buttons/muted.png\" width=\"16\" height=\"16\" />");
      return muteButton.attr("title", "Unmute");
    } else {
      muteButton.html("<img src=\"resources/images/buttons/unmuted.png\" width=\"16\" height=\"16\" />");
      return muteButton.attr("title", "Mute");
    }
  };

  updateVideoProgress = function(videoPlayer) {
    var currentProgress, currentVideoProgress, video;
    video = $(videoPlayer).find(".video")[0];
    currentProgress = $(videoPlayer).find(".current-progress");
    currentVideoProgress = $(videoPlayer).find(".current-video-progress");
    currentProgress.html(formatTime(video.currentTime));
    return currentVideoProgress.width("" + (100 * video.currentTime / video.duration) + "%");
  };

  formatTime = function(seconds) {
    var hours, minutes, timeString;
    hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    minutes = Math.floor(seconds / 60);
    seconds %= 60;
    seconds = Math.floor(seconds);
    timeString = "";
    timeString += hours > 0 ? "" + hours + ":" : "";
    timeString += minutes;
    timeString += ":";
    timeString += seconds >= 10 ? seconds : seconds > 0 ? "0" + seconds : "00";
    return timeString;
  };

}).call(this);