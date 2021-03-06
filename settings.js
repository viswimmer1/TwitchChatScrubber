
var checkboxes = $("[type='checkbox'");
var allOptions_currentValues = {};

$("[type='checkbox'").change(function() {
	if ($(this).is(':checked')) {
		console.log("Checked");
	} else {
		console.log("Unchecked");
	}
});

$(".header [type='checkbox']").change(function() {
	var type = $(this).parent().attr("scrubber");

	if ($(this).is(':checked')) {
		$(".sub-header." + type).show(250);
		console.log($(".sub-header." + type));
	} else {
		$(".sub-header." + type).hide(250);
		console.log("Header Unchecked");
	}
});

$("input [type='submit']").click(function() {
	saveChanges();
})

function saveChanges() {
	// Get a value saved in a form.
	var theValue = $("textarea").val();
	// Check that there's some code there.
	if (!theValue) {
	  message('Error: No value specified');
	  return;
	}
	console.log("theValue: " + theValue);
	// Save it using the Chrome extension storage API.
	chrome.storage.sync.set({'value': theValue}, function() {
	  // Notify that we saved.
	  console.log('Settings saved');
	});
	chrome.storage.sync.get(function(e) {
		console.log(e);
		$("textarea").html(e.toString());
	});
}