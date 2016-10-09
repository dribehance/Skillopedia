// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").directive('dribehanceGallery', function($rootScope, $sce, $timeout) {
	return {
		restrict: 'E',
		templateUrl: "templates/gallery.html",
		scope: {
			galleryImage: "=",
			galleryVideo: "="
		},
		link: function(scope, element, attrs) {
			var scripts = document.getElementsByTagName("script");

			var jsFolder = "";

			for (var i = 0; i < scripts.length; i++)

			{

				if (scripts[i].src && scripts[i].src.match(/initslider-1\.js/i))

					jsFolder = scripts[i].src.substr(0, scripts[i].src.lastIndexOf("/") + 1);

			}
			scope.staticImageUrl = $rootScope.staticImageUrl;
			// parse video url
			scope.get_video = function(video) {
				if (video) {
					// ?autoplay=0
					var video = video.replace("watch?v=", "embed/");
					return $sce.trustAsResourceUrl(video);
				}
			};
			scope.$on("onRepeatDone", function() {
				console.log("onRepeatDone")
					// return;
				$timeout(function() {
					$("#amazingslider-1").amazingslider({

						sliderid: 1,

						jsfolder: jsFolder,

						width: 900,

						height: 500,

						skinsfoldername: "",

						loadimageondemand: false,

						videohidecontrols: false,

						fullwidth: false,

						donotresize: false,

						enabletouchswipe: true,

						fullscreen: false,

						autoplayvideo: false,

						addmargin: true,

						transitiononfirstslide: false,

						forceflash: false,

						isresponsive: true,

						forceflashonie11: true,

						forceflashonie10: true,

						pauseonmouseover: false,

						playvideoonclickthumb: true,

						slideinterval: 5000,

						randomplay: false,

						scalemode: "fill",

						loop: 0,

						autoplay: true,

						navplayvideoimage: "../images/play-32-32-0.png",

						navpreviewheight: 60,

						timerheight: 2,

						descriptioncssresponsive: "font-size:12px;",

						shownumbering: false,

						skin: "Events",

						addgooglefonts: false,

						navshowplaypause: true,

						navshowplayvideo: true,

						navshowplaypausestandalonemarginx: 8,

						navshowplaypausestandalonemarginy: 8,

						navbuttonradius: 0,

						navthumbnavigationarrowimageheight: 32,

						navmarginy: 16,

						lightboxshownavigation: false,

						showshadow: false,

						navfeaturedarrowimagewidth: 16,

						navpreviewwidth: 120,

						googlefonts: "",

						navborderhighlightcolor: "",

						navcolor: "#999999",

						lightboxdescriptionbottomcss: "{color:#333; font-size:12px; font-family:Arial,Helvetica,sans-serif; overflow:hidden; text-align:left; margin:4px 0px 0px; padding: 0px;}",

						lightboxthumbwidth: 80,

						navthumbnavigationarrowimagewidth: 32,

						navthumbtitlehovercss: "text-decoration:underline;",

						navthumbmediumheight: 64,

						texteffectresponsivesize: 600,

						arrowwidth: 32,

						texteffecteasing: "easeOutCubic",

						texteffect: "slide",

						lightboxthumbheight: 60,

						navspacing: 8,

						navarrowimage: "../images/navarrows-28-28-0.png",

						bordercolor: "#ffffff",

						ribbonimage: "../images/ribbon_topleft-0.png",

						navwidth: 120,

						navheight: 60,

						arrowimage: "../images/arrows-32-32-0.png",

						timeropacity: 0.6,

						arrowhideonmouseleave: 1000,

						navthumbnavigationarrowimage: "../images/../images/carouselarrows-32-32-0.png",

						navshowplaypausestandalone: true,

						texteffect1: "slide",

						navpreviewbordercolor: "#ffffff",

						texteffect2: "slide",

						customcss: "",

						ribbonposition: "topleft",

						navthumbdescriptioncss: "display:block;position:relative;padding:2px 4px;text-align:left;font:normal 12px Arial,Helvetica,sans-serif;color:#333;",

						lightboxtitlebottomcss: "{color:#333; font-size:14px; font-family:Armata,sans-serif,Arial; overflow:hidden; text-align:left;}",

						arrowstyle: "mouseover",

						navthumbmediumsize: 800,

						navthumbtitleheight: 18,

						textpositionmargintop: 24,

						buttoncssresponsive: "",

						navswitchonmouseover: false,

						playvideoimage: "../images/playvideo-64-64-0.png",

						arrowtop: 50,

						textstyle: "none",

						playvideoimageheight: 64,

						navfonthighlightcolor: "#666666",

						showbackgroundimage: false,

						navpreviewborder: 4,

						navshowplaypausestandaloneheight: 48,

						navdirection: "horizontal",

						navbuttonshowbgimage: true,

						navbuttonbgimage: "../images/navbuttonbgimage-28-28-0.png",

						textbgcss: "display:none;",

						textpositiondynamic: "bottomleft",

						playvideoimagewidth: 64,

						buttoncss: "display:block; position:relative; margin-top:8px;",

						navborder: 2,

						navshowpreviewontouch: false,

						bottomshadowimagewidth: 96,

						showtimer: false,

						navradius: 0,

						navmultirows: false,

						navshowpreview: false,

						navpreviewarrowheight: 8,

						navmarginx: 16,

						navfeaturedarrowimage: "../images/featuredarrow-16-8-0.png",

						navthumbsmallsize: 480,

						showribbon: false,

						navstyle: "thumbnails",

						textpositionmarginleft: 24,

						descriptioncss: "display:block; position:relative; font:12px \"Lucida Sans Unicode\",\"Lucida Grande\",sans-serif,Arial; color:#fff; margin-top:8px;",

						navplaypauseimage: "../images/navplaypause-48-48-0.png",

						backgroundimagetop: -10,

						timercolor: "#ffffff",

						numberingformat: "%NUM/%TOTAL ",

						navthumbmediumwidth: 64,

						navfontsize: 12,

						navhighlightcolor: "#333333",

						texteffectdelay1: 1000,

						navimage: "../images/bullet-24-24-5.png",

						texteffectdelay2: 1500,

						texteffectduration1: 600,

						navshowplaypausestandaloneautohide: true,

						texteffectduration2: 600,

						navbuttoncolor: "",

						navshowarrow: false,

						texteffectslidedirection: "left",

						navshowfeaturedarrow: true,

						lightboxbarheight: 64,

						titlecss: "display:block; position:relative; font:bold 14px \"Lucida Sans Unicode\",\"Lucida Grande\",sans-serif,Arial; color:#fff;",

						ribbonimagey: 0,

						ribbonimagex: 0,

						navthumbsmallheight: 48,

						texteffectslidedistance1: 120,

						texteffectslidedistance2: 120,

						navrowspacing: 8,

						navshowplaypausestandaloneposition: "bottomright",

						shadowsize: 5,

						lightboxthumbtopmargin: 12,

						titlecssresponsive: "font-size:12px;",

						navshowplaypausestandalonewidth: 48,

						navthumbresponsive: false,

						navfeaturedarrowimageheight: 8,

						navopacity: 0.8,

						textpositionmarginright: 24,

						backgroundimagewidth: 120,

						textautohide: true,

						navthumbtitlewidth: 120,

						navpreviewposition: "top",

						texteffectseparate: false,

						arrowheight: 32,

						shadowcolor: "#aaaaaa",

						arrowmargin: 8,

						texteffectduration: 600,

						bottomshadowimage: "../images/bottomshadow-110-95-4.png",

						border: 6,

						lightboxshowdescription: false,

						timerposition: "bottom",

						navfontcolor: "#333333",

						navthumbnavigationstyle: "arrow",

						borderradius: 0,

						navbuttonhighlightcolor: "",

						textpositionstatic: "bottom",

						texteffecteasing2: "easeOutCubic",

						navthumbstyle: "imageonly",

						texteffecteasing1: "easeOutCubic",

						textcss: "display:block; padding:12px; text-align:left;",

						navthumbsmallwidth: 48,

						navbordercolor: "#ffffff",

						navpreviewarrowimage: "../images/previewarrow-16-8-0.png",

						navthumbtitlecss: "display:block;position:relative;padding:2px 4px;text-align:center;font:bold 12px Arial,Helvetica,sans-serif;color:#333;",

						showbottomshadow: false,

						texteffectslidedistance: 30,

						texteffectdelay: 500,

						textpositionmarginstatic: 0,

						backgroundimage: "../images/",

						navposition: "bottom",

						texteffectslidedirection1: "right",

						navpreviewarrowwidth: 16,

						textformat: "Bottom left",

						texteffectslidedirection2: "right",

						bottomshadowimagetop: 98,

						texteffectresponsive: true,

						navshowbuttons: false,

						lightboxthumbbottommargin: 8,

						textpositionmarginbottom: 24,

						lightboxshowtitle: true,

						slide: {

							duration: 1000,

							easing: "easeOutCubic",

							checked: true,

							effectdirection: 0

						},

						transition: "slide",

						scalemode: "fill",

						isfullscreen: false,

						textformat: {



						}

					});
				}, 200);
			});
		}
	};
});