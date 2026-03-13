import packageJson from "../../package.json";

export const SMALL_IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";
export const ORIGINAL_IMG_BASE_URL = "https://image.tmdb.org/t/p/original";

export const MOVIE_CATEGORIES = [
  "now_playing",
  "top_rated",
  // "popular",
  "upcoming",
];
export const TV_CATEGORIES = ["airing_today", "on_the_air", "top_rated"];

export const servers = [
  // {
  //   key: "server1",
  //   label: "Server 1",
  //   movieUrl: "https://vidsrc.ru/movie/",
  //   tvUrl: "https://vidsrc.ru/tv/",
  // },
  {
    key: "server2",
    label: "Server 2",
    movieUrl: "https://vidsrc.icu/embed/movie/",
    tvUrl: "https://vidsrc.icu/embed/tv/",
  },
  {
    key: "server3",
    label: "Server 3",
    movieUrl: "https://vidlink.pro/movie/",
    tvUrl: "https://vidlink.pro/tv/",
  },
  {
    key: "server4",
    label: "Server 4",
    movieUrl: "https://player.autoembed.cc/embed/movie/",
    tvUrl: "https://player.autoembed.cc/embed/tv/",
  },
  {
    key: "server5",
    label: "Server 5",
    movieUrl: "https://vidrock.net/movie/",
    tvUrl: "https://vidrock.net/tv/",
  },
  {
    key: "server6",
    label: "Server 6",
    movieUrl: "https://vidsrc.cc/v2/embed/movie/",
    tvUrl: "https://vidsrc.cc/v2/embed/tv/",
  },
];
export const updates = [
  {
    version: packageJson.version,
    // v1.4.0
    date: "2026-03-13",
    title: "Password Recovery + Email Reset System",

    description:
      "Added secure password recovery with email-based reset links and improved account security features.",

    updates: `
  • Added Forgot Password functionality.
  • Implemented secure password reset via email link.
  `,

    bugFixes: `Minor bug fixes.`,

    active: true,
  },
  {
    version: "1.3.0",
    // v1.3.0
    date: "2026-03-11",
    title: "Watchlist Improvements + Password Management",

    description:
      "Improved watchlist data consistency and added account security features including password management.",

    updates: `
  • Added Release date support for Watchlist items.
  • Added Change Password feature for authenticated users.
  `,

    bugFixes: `No bug fixes.`,

    active: false,
  },
  {
    version: "1.2.1",
    // v1.2.1
    date: "2026-02-28",
    title: "Search History + Changelog System",
    description:
      "Enhanced user experience with persistent search history, dynamic footer versioning, and a dedicated changelog page for tracking updates.",

    updates: `
  • Implemented Search History system with newest searches appearing first.
  • Added support for movie, TV, and person history tracking.
  • Created dedicated FamFlix Changelog page.
  `,

    bugFixes: `
  • Corrected MongoDB $push position handling using $each + $position.
  `,

    active: false,
  },
];
