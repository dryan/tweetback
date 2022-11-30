const dataSource = require("../src/DataSource");
const metadata = require("../_data/metadata.js");

module.exports = async function (data) {
  let titleTweetNumberStr = "";
  if (data.page.fileSlug === "tweet-pages") {
    titleTweetNumberStr = `—№ ${this.renderNumber(
      data.pagination.hrefs.length - data.pagination.pageNumber
    )}`;
  } else if (data.page.fileSlug === "newest") {
    titleTweetNumberStr = `—№ ${this.renderNumber(
      (await dataSource.getAllTweets()).length
    )}`;
  }

  let navHtml = "";
  if (data.page.fileSlug === "tweet-pages" || data.page.fileSlug === "newest") {
    let newestHref = "/tweets/newest/";
    let previousHref = data.pagination.previousPageHref;
    let nextHref = data.pagination.nextPageHref;

    if (data.page.fileSlug === "newest") {
      newestHref = "";
      previousHref = "";
      nextHref =
        "/" +
        (await dataSource.getAllTweets())
          .sort((a, b) => b.date - a.date)
          .slice(1, 2)
          .map((tweet) => tweet.id_str)
          .join("") +
        "/";
    } else if (
      data.page.fileSlug === "tweet-pages" &&
      data.pagination.firstPageHref === data.page.url
    ) {
      newestHref = "";
    }

    navHtml = `<ul class="tweets-nav">
			<li>${
        newestHref ? `<a href="${newestHref}">` : ""
      }⇤ Newest<span class="sr-only"> Tweet</span>${newestHref ? `</a>` : ""}</li>
			<li>${
        previousHref ? `<a href="${previousHref}">` : ""
      }⇠ Newer<span class="sr-only"> Tweet</span>${previousHref ? `</a>` : ""}</li>
			<li>${
        nextHref ? `<a href="${nextHref}">` : ""
      }Older<span class="sr-only"> Tweet</span> ⇢${nextHref ? `</a>` : ""}</li>
		</ul>`;
  }

  return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>${data.metadata.username}’s Twitter Archive${titleTweetNumberStr}</title>
		<meta name="description" content="A read-only indieweb self-hosted archive of${
      data.pagination && data.pagination.hrefs && data.pagination.hrefs.length
        ? ` all ${data.pagination.hrefs.length}`
        : ""
    } of ${data.metadata.username}’s tweets." />
		<script>
		if("classList" in document.documentElement) {
			document.documentElement.classList.add("has-js");
		}
		</script>

		${
      data.page.fileSlug !== "tweet-pages"
        ? `
			<link rel="stylesheet" href="/tweets/assets/chartist.min.css">
			<link rel="stylesheet" href="/tweets/assets/chart.css">
			<script src="/tweets/assets/chartist.min.js"></script>
			<script src="/tweets/assets/chart.js"></script>
		`
        : ""
    }
		<link rel="stylesheet" href="https://unpkg.com/@dryan-llc/mnml.css">
		<link rel="stylesheet" href="/tweets/assets/style.css">
		<script src="/tweets/assets/script.js" type="module"></script>
		<script src="/tweets/assets/is-land.js" type="module"></script>
		${
      data.page.fileSlug === "newest"
        ? `<link rel="canonical" href="/${data.tweet.id_str}/">
<meta http-equiv="refresh" content="0; url=/${data.tweet.id_str}/">`
        : ""
    }
	</head>
	<body>
		<header>
			<div class="container">
			<h1 class="tweets-title"><a href="/tweets/"><img src="${
        metadata.avatar
      }" width="52" height="52" alt="${
    data.metadata.username
  }’s avatar" class="tweet-avatar">${
    data.metadata.username
  }’s Twitter Archive</a>${titleTweetNumberStr}</h1>
			${
        !data.hideHeaderTweetsLink
          ? `<ul class="tweets-nav">
				<li><a href="${data.metadata.homeUrl}">← ${data.metadata.homeLabel}</a></li>
			</ul>`
          : ""
      }
			${navHtml}
			</div>
		</header>
		<main>
			<div class="container">
				${data.content}
			</div>
		</main>
		<footer>
			<p>An open source project from <a href="https://github.com/tweetback">tweetback</a>.</p>
		</footer>
	</body>
</html>`;
};
