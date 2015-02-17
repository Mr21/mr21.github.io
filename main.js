function lg(s) { console.log(s) }

$(function() {

	var	jq_aOld,
		jq_page = $(".global .page").detach().hide(),
		slideDur = 150;

	// data --------------------------------
	function createEachData(arr, jq_content) {
		$.each(arr, function() {
			$('<a>')
				.prop("pageData", this)
				.attr({
					class: this.href,
					href:  "##toggle(p, " + this.href + ")",
				})
				.append('<img src="'+this.img+'"/>')
				.appendTo(jq_content);
		});
	}
	createEachData(window.projectsData, $(".rub.projects .content"));
	createEachData(window.skillsData, $(".rub.skills .content"));
	// -------------------------------------

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

	function writeData(jq_a) {
		var d = jq_a.prop("pageData");
		if (jq_aOld)
			jq_aOld
				.removeClass("selected");
		jq_a
			.addClass("selected")
			.parent()
				.addClass("alpha-selected");
		jq_page
			.children("h2").text(d.title).end()
			.children("a").prop("href", d.link).end()
			.children("p[lang='en']").html(d.en).end()
			.children("p[lang='fr']").html(d.fr).end();
		jq_aOld = jq_a;
	}

	function openPage(jq_a) {
		if (jq_a.prop("pageData")) {
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
				jq_page.slideDown(slideDur);
			} else {
				jq_page.slideUp(slideDur, function() {
					writeData(jq_a);
					jq_page
						.insertAfter(jq_aNext)
						.slideDown(slideDur);
				});
			}
		}
	}

	function closePage() {
		if (jq_aOld && jq_aOld[0]) {
			jq_page
				.slideUp(slideDur);
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
				openPage($('.' + p));
		}
	});

	// languages
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

});
