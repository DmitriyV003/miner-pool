$(document).ready(function () {
	$('.js-tab-content').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		fade: true,
		asNavFor: '.js-nav-tabs',
		prevArrow: '.banner-tabs .tab-prev',
		nextArrow: '.banner-tabs .tab-next',
		infinite: true
	})
	$('.js-nav-tabs').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		asNavFor: '.tab-content',
		variableWidth: true,
		dots: false,
		centerMode: false,
		focusOnSelect: true,
		infinite: true,
		arrows: false
	})

	const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
	const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl)
	})

});
