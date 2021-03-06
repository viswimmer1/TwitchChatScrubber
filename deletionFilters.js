
function filter_notification(node_target, chat_line, text, badges) {
	if(chat_line.hasClass("admin")) {
		return DELETE_FALSE;
	}

	return DELETE_UNSURE;
}

function filter_byStaff(node_target, chat_line, text, badges) {
	// The poster can have multiple badges. If any of the poster's badges are a staff
	//  badge, we don't delete.
	for(var i = 0; i < badges.length; i++) {
		if(POWER.indexOf(badges[i]) > -1) {
			return DELETE_FALSE;
		}
	}

	// If we get here then the poster does not have a staff badge.
	return DELETE_UNSURE;
}

//TODO turbo?
function filter_byAccountStatus(node_target, chat_line, text, badges) {
	if(PARAM.byAccountStatus.hidePlebs) {
		if(badges.length === 0) {
			deletion_reason[$(node_target).attr("id")] = REASON.HIDE_PLEBS;
			return DELETE_TRUE;
		}
	}

	// for now, hides anyone who contains a sub badge (including mods etc)
	if(PARAM.byAccountStatus.hideSubs) {
		if(badges.indexOf(SUBSCRIBER) > -1) {
			deletion_reason[$(node_target).attr("id")] = REASON.HIDE_SUBS;
			return DELETE_TRUE;
		} 
	}

	return DELETE_UNSURE;
}

function filter_lengthRestrict(node_target, chat_line, text, badges) {
	var clone_message = chatlineToMessage(chat_line).clone();
	reduceEmotes(clone_message, false, " ");

	var text = $(clone_message).html().toLowerCase();
	if(text.length > PARAM.lengthRestrict.threshold) {
		deletion_reason[$(node_target).attr("id")] = REASON.LENGTH_RESTRICT;
		// console.log(deletion_reason);
		return DELETE_TRUE;
	}

	return DELETE_UNSURE;
}

function filter_triggerPhrase(node_target, chat_line, text, badges) {
	for(var phrase in PARAM.triggerPhrase.phrases) {
		if(PARAM.triggerPhrase.delimited) {
			if(text.indexOf(phrase) > -1) {
				deletion_reason[$(node_target).attr("id")] = REASON.TRIGGER_PHRASE;
				return DELETE_TRUE;
			}
		} else {
			// does not work correctly with accented/special chars/letters
			var regex = new RegExp("\\b" + phrase + "\\b");
			if(regex.test(text)) {
				deletion_reason[$(node_target).attr("id")] = REASON.TRIGGER_PHRASE;
				return DELETE_TRUE;
			}
		}
	}
	
	return DELETE_UNSURE;
}



/*
each longMessage ele is of the form
{text: String, lastAccess: Time, numOccurrences: Number}
*/

function filter_copyPasta(node_target, chat_line, text, badges) {
	// Replace emotes with their alt texts first before doing copyPasta comparison
	var clone_message = chatlineToMessage(chat_line).clone();
	// console.log("Clone_message:");
	// console.log(clone_message);
	reduceEmotes(clone_message, true);
	reduceLinks(clone_message, true);

	var text = $(clone_message).html().toLowerCase();
	// console.log("copyPasta check text: ");
	// console.log(text);
	// copyPasta only applies to long messages
	if(text.length > PARAM.copyPasta.lengthThreshold) {
		var logged = CP.alreadyLogged(text);
		if(logged) { // then it's already there so it's a copy paste
			// console.log("Is logged.");
			deletion_reason[$(node_target).attr("id")] = REASON.COPY_PASTA;
			// console.log(deletion_reason);
			return DELETE_TRUE;
		} else { // then add to listing and return false
			CP.addListing(text);
			return DELETE_UNSURE;
		}
	}

	return DELETE_UNSURE;
}