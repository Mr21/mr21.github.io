$(function() {

	var	SLIDE_DUR = 250;

	// data --------------------------------
	$("#data > *").each(function() {
		var jq_content = $(".rub." + this.className + " .content");
		$(this).children().each(function() {
			$("<a>")
				.prop("el_data", this)
				.attr("class", this.className)
				.attr("href", "##toggle(p, " + this.className + ")")
				.append($(this).children("img:first-child"))
				.appendTo(jq_content);
		});
	});

	// languages ---------------------------
	(function() {
		var	jq_oldLang = $(),
			jq_languages = $(".languages"),
			langs = {
				en: $("[href*=en]", jq_languages),
				fr: $("[href*=fr]", jq_languages)
			};
		locationHash.watch({
			lang: function(l) {
				l = l || "en";
				jq_oldLang.removeClass("selected");
				jq_oldLang = langs[l].addClass("selected");
				document.body.lang = oldLang = l;
			}
		});
	})();

	// links mouseover/out -----------------
	$(".rub .content").each(function() {
		var	idTimeout,
			jq_content = $(this);
		jq_content.children("a")
			.mouseover(function() {
				jq_content.addClass("alpha-mouseover");
				clearTimeout(idTimeout);
			})
			.mouseout(function() {
				idTimeout = setTimeout(function() {
					jq_content.removeClass("alpha-mouseover");
				}, 50);
			});
	});

	// page .thatUseIt ---------------------
	(function() {
		var	jq_page = $("#data > * > *"),
			jq_tags = jq_page.find(".tags a");
		jq_page.each(function() {
			var	jq_this = $(this),
				name = this.className,
				html = "",
				nbProj = 0;
			jq_tags.each(function(i) {
				if (name === this.textContent.toLowerCase()) {
					var jq_page = jq_tags.eq(i).parent().parent();
					++nbProj;
					html +=
						"<li><a href='##toggle(p, "+jq_page[0].className+")'>"+
							jq_page.find("h2").html()+
						"</a></li>";
				}
			});
			if (nbProj) {
				$(
					"<br/>"+
					"<a href='#' class='subTitle'>"+
						"<i class='fa fa-fw fa-code'></i>"+
						"<span lang='en'>I made "+nbProj+" project"+(nbProj>1?"s":"")+" with it</span> "+
						"<span lang='fr'>J'ai fait "+nbProj+" projet"+(nbProj>1?"s":"")+" avec</span> "+
					"</a>"+
					"<ul>"+
						html+
					"</ul>"
				).appendTo(this);
			}
		});
	})();

	// page .subTitle ----------------------
	$("#data .subTitle").click(function() {
		$(this)
			.toggleClass("close")
			.next().slideToggle(SLIDE_DUR);
		return false;
	}).click();

	// -------------------------------------

	var	jq_aOld,
		jq_page = $("<div class='page'>").hide();

	function writeData(jq_a) {
		if (jq_aOld)
			jq_aOld.removeClass("selected");
		jq_a.addClass("selected")
			.parent().addClass("alpha-selected");
		jq_page
			.children().detach().end()
			.append(jq_a.prop("el_data"));
		jq_aOld = jq_a;
	}

	function openPage(jq_a) {
		if (jq_a.prop("el_data")) {
			var	jq_aNext_before,
				jq_aNext = jq_a;
			for (;;) {
				jq_aNext_before = jq_aNext;
				jq_aNext = jq_aNext.next();
				if (!jq_aNext[0])
					jq_aNext = jq_aNext_before;
				else if (jq_aNext[0].tagName !== "A")
					jq_aNext = null;
				else if (jq_aNext.position().top > jq_aNext_before.position().top)
					jq_aNext = jq_aNext_before;
				else
					continue;
				break;
			}
			if (!jq_aNext || (jq_aOld && jq_a[0] === jq_aOld[0])) {
				writeData(jq_a);
				jq_page.slideDown(SLIDE_DUR);
			} else {
				if (jq_aOld)
					jq_aOld.parent().removeClass("alpha-selected alpha-mouseover");
				jq_page.slideUp(SLIDE_DUR, function() {
					writeData(jq_a);
					jq_page
						.insertAfter(jq_aNext)
						.slideDown(SLIDE_DUR);
				});
			}
		}
	}

	function closePage() {
		if (jq_aOld && jq_aOld[0]) {
			jq_page
				.slideUp(SLIDE_DUR);
			jq_aOld
				.removeClass("selected")
				.parent()
					.removeClass("alpha-selected alpha-mouseover");
		}
	}

	locationHash.watch({
		p: function(p) {
			if (!p)
				closePage();
			else
				openPage($("a." + p));
		}
	});

});
