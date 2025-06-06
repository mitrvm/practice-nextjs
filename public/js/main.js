import translations from "./translations.js";

let currentLang = navigator.language.startsWith("ru") ? "ru" : "en";

const API_URL =
	window.location.hostname === "localhost"
		? "http://localhost:8000/server.php"
		: "/api/server.php";

function switchLanguage(lang) {
	currentLang = lang;
	document.querySelectorAll("[data-translate]").forEach((element) => {
		const key = element.getAttribute("data-translate");
		if (translations[lang][key]) {
			if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
				element.placeholder = translations[lang][key];
			} else if (element.tagName === "OPTION") {
				element.textContent = translations[lang][key];
			} else if (element.tagName === "LABEL") {
				element.textContent = translations[lang][key];
			} else {
				element.textContent = translations[lang][key];
			}
		}
	});

	document.querySelector(".lang-select").value = lang;
}

document.addEventListener("DOMContentLoaded", () => {
	const langSelect = document.querySelector(".lang-select");
	langSelect.value = currentLang;
	langSelect.onchange = () => {
		switchLanguage(langSelect.value);
	};

	switchLanguage(currentLang);

	const forms = ["main-form", "freight-calc-form"];

	forms.forEach((formId) => {
		const form = document.getElementById(formId);
		if (form) {
			form.addEventListener("submit", async function (e) {
				e.preventDefault();

				const formData = new FormData(this);
				const data = Object.fromEntries(formData.entries());

				try {
					console.log("Sending data:", data);

					const response = await fetch(API_URL, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(data),
					});

					const responseText = await response.text();

					let result;
					try {
						result = JSON.parse(responseText);
					} catch (e) {
						console.error("Failed to parse JSON:", e);
						throw new Error("Invalid server response");
					}

					if (response.ok) {
						alert(result.message);
						this.reset();
					} else {
						alert(result.error || "Произошла ошибка при отправке формы");
					}
				} catch (error) {
					console.error("Error:", error);
					alert("Произошла ошибка при отправке формы");
				}
			});
		}
	});

	const scrollButton = document.getElementById("scrollButton");
	if (!scrollButton) return;
	const sections = Array.from(
		document.querySelectorAll("section, .yandex-map, footer")
	).sort((a, b) => a.offsetTop - b.offsetTop);
	const SCROLL_OFFSET = 80;
	const scrollY = () =>
		window.pageYOffset || document.documentElement.scrollTop;
	const isAtBottom = () =>
		scrollY() > 0 &&
		scrollY() + window.innerHeight >= document.documentElement.scrollHeight - 5;

	function updateScrollButton() {
		const y = scrollY();
		if (y > 50 || y === 0) {
			scrollButton.classList.add("visible");
			if (isAtBottom()) {
				scrollButton.classList.add("scroll-to-top");
				scrollButton.classList.remove("scroll-to-bottom");
			} else {
				scrollButton.classList.add("scroll-to-bottom");
				scrollButton.classList.remove("scroll-to-top");
			}
		} else {
			scrollButton.classList.remove("visible");
		}
	}
	scrollButton.addEventListener("click", () => {
		if (isAtBottom()) {
			window.scrollTo({ top: 0, behavior: "smooth" });
			return;
		}
		const y = scrollY();
		const next = sections.find((sec) => sec.offsetTop - SCROLL_OFFSET > y + 1);
		let targetY;

		if (next) {
			targetY = next.offsetTop - SCROLL_OFFSET;
		} else {
			targetY = document.documentElement.scrollHeight;
		}

		window.scrollTo({ top: targetY, behavior: "smooth" });
	});
	window.addEventListener("scroll", updateScrollButton);
	updateScrollButton();

	const privacyLink = document.getElementById("privacyLink");
	const privacyPopup = document.getElementById("privacyPopup");
	const privacyAccept = document.getElementById("privacyAccept");

	if (privacyLink && privacyPopup && privacyAccept) {
		privacyLink.addEventListener("click", (e) => {
			e.preventDefault();
			privacyPopup.style.display = "block";
		});

		privacyAccept.addEventListener("click", () => {
			privacyPopup.classList.add("hiding");
			setTimeout(() => {
				privacyPopup.style.display = "none";
				privacyPopup.classList.remove("hiding");
			}, 300);
		});

		window.addEventListener("click", (e) => {
			if (e.target === privacyPopup) {
				privacyPopup.classList.add("hiding");
				setTimeout(() => {
					privacyPopup.style.display = "none";
					privacyPopup.classList.remove("hiding");
				}, 300);
			}
		});
	}
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
		e.preventDefault();
		const target = document.querySelector(this.getAttribute("href"));
		if (target) {
			const header = document.querySelector("header");
			const headerHeight = header ? header.offsetHeight : 0;
			const targetPosition =
				target.getBoundingClientRect().top + window.pageYOffset;
			window.scrollTo({
				top: targetPosition - headerHeight,
				behavior: "smooth",
			});
		}
	});
});

$(document).ready(function () {
	$("select.form-control").select2({
		minimumResultsForSearch: -1,
		width: "100%",
	});
});
