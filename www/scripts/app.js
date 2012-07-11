"use strict";

var $, alert, navigator;

var RocknCoder = RocknCoder || {};
RocknCoder.Pages = RocknCoder.Pages || {};
RocknCoder.Container = {width: 320, height: 300};

RocknCoder.Pages.Kernel = function (event) {
	var that = this,
		eventType = event.type,
		pageName = $(this).attr("data-rockncoder-jspage");
	if (RocknCoder && RocknCoder.Pages && pageName && RocknCoder.Pages[pageName] && RocknCoder.Pages[pageName][eventType]) {
		RocknCoder.Pages[pageName][eventType].call(that);
	}
};

RocknCoder.Pages.Events = (function () {
	$("div[data-rockncoder-jspage]").on(
		'pagebeforecreate pagecreate pagebeforeload pagebeforeshow pageshow pagebeforechange pagechange pagebeforehide pagehide pageinit',
		RocknCoder.Pages.Kernel
	);
}());

RocknCoder.Dimensions = (function () {
	var width, height, headerHeight, footerHeight, contentHeight,
		getContentDimensions = function () {
			return {
				width: width,
				height: contentHeight
			};
		},
		init = function () {
			width = $(window).width();
			height = $(window).height();
			headerHeight = $("header", $.mobile.activePage).height();
			footerHeight = $("footer", $.mobile.activePage).height();
			contentHeight = height - headerHeight - footerHeight;
		};
	return {
		init: init,
		getContent: getContentDimensions
	};
}());

RocknCoder.Pages.page1 = (function () {
	var $thePicture = $("#thePicture"),
		$snapPicture = $("#snapPicture"),
		dims,
		picLoaded = function () {
			var width, height;
			width = $thePicture.width();
			height = $thePicture.height();

			if (width > height) {
				$thePicture.width(RocknCoder.Container.width);
			} else {
				$thePicture.height(RocknCoder.Container.height);
			}
		},
		picSuccess = function (imageData) {
			$thePicture.attr('src', "data:image/jpeg;base64," + imageData).load(picLoaded);
		},
		picFail = function (message) {
			alert("Failed because: " + message);
		},
		pageshow = function () {
			RocknCoder.Dimensions.init();
			dims = RocknCoder.Dimensions.getContent();
			$("#picFrame").css("width", dims.width);
            $("#picFrame").css("height", dims.height);
			RocknCoder.Container.width = dims.width;
			RocknCoder.Container.height = dims.height;

			$snapPicture.unbind('tap').tap(function (event) {
				event.preventDefault();
				event.stopPropagation();
				navigator.camera.getPicture(picSuccess, picFail, {quality: 35, destinationType: Camera.DestinationType.DATA_URL});
				return false;
			});
		},
		pagehide = function () {
			$snapPicture.unbind('tap');
		};
	return {
		pageshow: pageshow,
		pagehide: pagehide
	};
}());
