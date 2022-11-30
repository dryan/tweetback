let data = {
  username: "dryan", // No leading @ here
  homeLabel: "dryan.com",
  homeUrl: "https://dryan.com",
};

data.avatar = `https://v1.indieweb-avatar.11ty.dev/${encodeURIComponent(
  data.homeUrl
)}/`;

module.exports = data;
