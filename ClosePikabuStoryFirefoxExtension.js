/// @file
/// @brief Firefox plugin which add close buttons for stories on pikabu.ru.
/// @details For all stories on current pikabu's page add close buttons 
/// on left and footer raiting blocks.

/// @brief List of all stories on current page.
var stories = document.getElementsByClassName("story");

/// @brief Create and construct close story button as image with onclick 
/// action. When button click delete story with given id.
/// @note This function only creates close button but doesn't place
/// it at any place on the page.
function createCloseButton(storyId)
{
	var deletePostButton = document.createElement("img");
	deletePostButton.src = browser.extension.getURL("icons/close.png");
	deletePostButton.height = "25";
	deletePostButton.width = "25";
	deletePostButton.classList.add("story__delete-post");
	deletePostButton.title = "Закрыть пост";
	
	deletePostButton.onclick = (function () 
	{
		var id = storyId;
		return function() 
		{
			for (storyIter in stories)
			{
				var story = stories[storyIter];
				if (story.getAttribute("data-story-id") == id)
				{
					story.remove();
					return;
				}
			}
		}
	})();
	
	return deletePostButton;
}

/// @brief Search left raiting block of given story and 
/// place new close button on it.
function addLeftCloseButton(story)
{
	var storyId = story.getAttribute("data-story-id");
	var deletePostButton = createCloseButton(storyId);
	
	var storyLeft = story.getElementsByClassName("story__left")[0];
	var raitingBlock = storyLeft.getElementsByClassName("story__rating-block")[0];
	raitingBlock.appendChild(deletePostButton);
}

/// @brief Search footer raiting block of given story and 
/// place new close button on it.
function addFooterCloseButton(story)
{
	var storyId = story.getAttribute("data-story-id");
	
	var deletePostButton = createCloseButton(storyId);
	
	var storyMain = story.getElementsByClassName("story__main")[0];
	var storyWrapper = storyMain.getElementsByClassName("story__wrapper")[0];
	var storyFooter = storyWrapper.getElementsByClassName("story__footer")[0];
	var raitingBlock = storyFooter.getElementsByClassName("story__rating-block")[0];
	raitingBlock.appendChild(deletePostButton);
}

/// @brief For all stories on current page add close buttons 
/// on left and footer raiting blocks.
function addCloseButtons()
{
	for (storyIter in stories)
	{
		var story = stories[storyIter];
		try
		{
			addLeftCloseButton(story)
			addFooterCloseButton(story);
		}
		catch (e)
		{
			continue;
		}
	}
}

addCloseButtons();

/// Setup mutation listener that detect when new stories 
/// was loaded and add close post buttons.
(function(){
	
var MutationObserver = window.MutationObserver || window.WebKilMutationObserver || window.MozMutationObserver;

var stories = document.getElementsByClassName("stories")[0];
var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		if (!(mutation.type === 'childList'))
			return;
		var deleters = document.getElementsByClassName("story__delete-post");
		while (deleters.length > 0)
			deleters[0].remove();
		addCloseButtons();
	})
});
var observerAttributes = {
	childList: true
};
observer.observe(stories, observerAttributes);

})();

alert("ClosePikabuStory extension was loaded!");