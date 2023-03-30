// cspell:disable

export type SiteContentInfo = {
  APPLE_MUSIC_ALBUM: {
    albumId: string;
    contentType: 'ALBUM';
    site: 'APPLE_MUSIC';
    url: string;
  };
  APPLE_MUSIC_ARTIST: {
    artistId: string;
    contentType: 'ARTIST';
    site: 'APPLE_MUSIC';
    url: string;
  };
  BEHANCE_GALLERY: {
    contentType: 'GALLERY';
    galleryId: string;
    site: 'BEHANCE';
    url: string;
  };
  BEHANCE_PROFILE: {
    contentType: 'PROFILE';
    site: 'BEHANCE';
    url: string;
    username: string;
  };
  CANVA_DESIGN: {
    contentType: 'DESIGN';
    designId: string;
    site: 'CANVA';
    url: string;
  };
  CODEPEN_PEN: {
    contentType: 'PEN';
    penId: string;
    site: 'CODEPEN';
    url: string;
    username: string;
  };
  DROPBOX_FILE: {
    contentType: 'FILE';
    fileId: string;
    site: 'DROPBOX';
    url: string;
  };
  FIGMA_FILE: {
    contentType: 'FILE';
    fileId: string;
    site: 'FIGMA';
    url: string;
  };
  FIGMA_PROTOTYPE: {
    contentType: 'PROTOTYPE';
    prototypeId: string;
    site: 'FIGMA';
    url: string;
  };
  GOOGLE_DOCS_DOCUMENT: {
    contentType: 'DOCUMENT';
    documentId: string;
    site: 'GOOGLE_DOCS';
    url: string;
  };
  GOOGLE_DOCS_PRESENTATION: {
    contentType: 'PRESENTATION';
    presentationId: string;
    site: 'GOOGLE_DOCS';
    url: string;
  };
  GOOGLE_DOCS_SPREADSHEET: {
    contentType: 'SPREADSHEET';
    site: 'GOOGLE_DOCS';
    spreadsheetId: string;
    url: string;
  };
  GOOGLE_DRIVE_FILE: {
    contentType: 'FILE';
    fileId: string;
    site: 'GOOGLE_DRIVE';
    url: string;
  };
  GOOGLE_DRIVE_FOLDER: {
    contentType: 'FOLDER';
    folderId: string;
    site: 'GOOGLE_DRIVE';
    url: string;
  };
  INSTAGRAM_POST: {
    contentType: 'POST';
    postId: string;
    site: 'INSTAGRAM';
    url: string;
  };
  LINKTREE_PROFILE: {
    contentType: 'PROFILE';
    site: 'LINKTREE';
    url: string;
    username: string;
  };
  LOOM_VIDEO: {
    contentType: 'VIDEO';
    site: 'LOOM';
    url: string;
    videoId: string;
  };
  SOUNDCLOUD_TRACK: {
    contentType: 'TRACK';
    site: 'SOUNDCLOUD';
    trackId: string;
    url: string;
    username: string;
  };
  SPOTIFY_ALBUM: {
    albumId: string;
    contentType: 'ALBUM';
    site: 'SPOTIFY';
    url: string;
  };
  SPOTIFY_ARTIST: {
    artistId: string;
    contentType: 'ARTIST';
    site: 'SPOTIFY';
    url: string;
  };
  SPOTIFY_EPISODE: {
    contentType: 'EPISODE';
    episodeId: string;
    site: 'SPOTIFY';
    url: string;
  };
  SPOTIFY_PLAYLIST: {
    contentType: 'PLAYLIST';
    playlistId: string;
    site: 'SPOTIFY';
    url: string;
  };
  SPOTIFY_SHOW: {
    contentType: 'SHOW';
    showId: string;
    site: 'SPOTIFY';
    url: string;
  };
  SPOTIFY_TRACK: {
    contentType: 'TRACK';
    site: 'SPOTIFY';
    trackId: string;
    url: string;
  };
  TIKTOK_PROFILE: {
    contentType: 'PROFILE';
    site: 'TIKTOK';
    url: string;
    username: string;
  };
  TIKTOK_VIDEO: {
    contentType: 'VIDEO';
    site: 'TIKTOK';
    url: string;
    username: string;
    videoId: string;
  };
  TWITTER_PROFILE: {
    contentType: 'PROFILE';
    site: 'TWITTER';
    url: string;
    username: string;
  };
  TWITTER_STATUS: {
    contentType: 'STATUS';
    site: 'TWITTER';
    statusId: string;
    url: string;
    username: string;
  };
  VIMEO_MANAGE_VIDEO: {
    contentType: 'VIDEO';
    site: 'VIMEO';
    url: string;
    videoId: string;
  };
  VIMEO_PROFILE: {
    contentType: 'PROFILE';
    site: 'VIMEO';
    url: string;
    username: string;
  };
  VIMEO_VIDEO: {
    contentType: 'VIDEO';
    site: 'VIMEO';
    url: string;
    videoId: string;
  };
  YOUTUBE_SHORT_VIDEO: {
    contentType: 'SHORT_VIDEO';
    site: 'YOUTUBE';
    url: string;
    videoId: string;
  };
  YOUTUBE_VIDEO: {
    contentType: 'VIDEO';
    site: 'YOUTUBE';
    url: string;
    videoId: string;
  };
  YOUTUBE_VIDEO_SHORT_URL: {
    contentType: 'VIDEO';
    site: 'YOUTUBE';
    url: string;
    videoId: string;
  };
};

export type Site = SiteContentInfo[keyof SiteContentInfo]['site'];
export type ContentType = SiteContentInfo[keyof SiteContentInfo]['contentType'];

type SiteContentInfoExtractor<T> = (
  url: URL,
  searchParameters: URLSearchParams,
) => T | null;

type SiteRule<T extends SiteContentInfo[keyof SiteContentInfo]> = {
  contentType: T['contentType'];
  domain: string;
  extractContentInfo: SiteContentInfoExtractor<
    Omit<Omit<T, 'contentType'>, 'site'>
  >;
  site: T['site'];
  tests: Record<string, Omit<Omit<T, 'contentType'>, 'site'> | null>;
  weight: number;
};

type ExtractedInfo<T extends string> = {
  [K in T]: string;
};

const createIdFromSearchParameterContentExtractor = <T extends string>(
  idName: T,
  searchParameterName: string,
  urlTemplate: string,
): SiteContentInfoExtractor<ExtractedInfo<T> & { url: string }> => {
  return (url, searchParameters) => {
    const id = searchParameters.get(searchParameterName);

    if (typeof id === 'string' && id) {
      return {
        [idName]: id,
        url: urlTemplate.replace('{{' + idName + '}}', id),
      } as ExtractedInfo<T> & { url: string };
    }

    return null;
  };
};

const createIdFromFirstPathnameRegexMatchContentInfoExtractor = <
  T extends string,
>(
  idName: T,
  regex: RegExp,
  urlTemplate: string,
): SiteContentInfoExtractor<ExtractedInfo<T> & { url: string }> => {
  return (url) => {
    const id = regex.exec(url.pathname)?.[1];

    if (id) {
      return {
        [idName]: id,
        url: urlTemplate.replace('{{' + idName + '}}', id),
      } as ExtractedInfo<T> & { url: string };
    }

    return null;
  };
};

export const siteContentRules: {
  [K in keyof SiteContentInfo]: SiteRule<SiteContentInfo[K]>;
} = {
  APPLE_MUSIC_ALBUM: {
    contentType: 'ALBUM',
    domain: 'music.apple.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'albumId',
      /\/album\/[\w-]+\/(\d+)/u,
      'https://music.apple.com/album/{{albumId}}',
    ),
    site: 'APPLE_MUSIC',
    tests: {
      'https://music.apple.com/us/album/diamonds/1632654221?i=1632654222': {
        albumId: '1632654221',
        url: 'https://music.apple.com/album/1632654221',
      },
    },
    weight: 100,
  },
  APPLE_MUSIC_ARTIST: {
    contentType: 'ARTIST',
    domain: 'music.apple.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'artistId',
      /\/artist\/[\w-]+\/(\d+)/u,
      'https://music.apple.com/artist/{{artistId}}',
    ),
    site: 'APPLE_MUSIC',
    tests: {
      'https://music.apple.com/us/artist/8karri/1465797897': {
        artistId: '1465797897',
        url: 'https://music.apple.com/artist/1465797897',
      },
    },
    weight: 100,
  },
  BEHANCE_GALLERY: {
    contentType: 'GALLERY',
    domain: 'behance.net',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'galleryId',
      /^\/gallery\/(\d+)/u,
      'https://behance.net/gallery/{{galleryId}}/view',
    ),
    site: 'BEHANCE',
    tests: {
      'https://www.behance.net/gallery/120073067/CITROEN-C5X-Lifestyle': {
        galleryId: '120073067',
        url: 'https://behance.net/gallery/120073067/view',
      },
    },
    weight: 100,
  },
  BEHANCE_PROFILE: {
    contentType: 'PROFILE',
    domain: 'behance.net',
    extractContentInfo: (url) => {
      const [, username] = /^\/([a-zA-Z]\w+)$/u.exec(url.pathname) ?? [];
      const segments = url.pathname.replace(/^\//u, '').split('/');

      if (segments.length === 1 && username) {
        return {
          url: 'https://behance.net/' + username,
          username,
        };
      }

      return null;
    },
    site: 'BEHANCE',
    tests: {
      'https://www.behance.net/': null,
      'https://www.behance.net/gajus': {
        url: 'https://behance.net/gajus',
        username: 'gajus',
      },
    },
    weight: 100,
  },
  CANVA_DESIGN: {
    contentType: 'DESIGN',
    domain: 'canva.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'designId',
      // TODO I am not clear what the two IDs map to.
      // I have confirmed as much that the first one is not a user ID, i.e.
      // If the same user created two designs, the first ID is not the same.
      /^\/design\/([\w-]+\/[\w-]+)/u,
      'https://canva.com/design/{{designId}}/view',
    ),
    site: 'CANVA',
    tests: {
      'https://www.canva.com/design/DAC1xq2GJMk/hIMpX3mPUmYkmNshGT0ZEw/view?utm_content=DAC1xq2GJMk&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink':
        {
          designId: 'DAC1xq2GJMk/hIMpX3mPUmYkmNshGT0ZEw',
          url: 'https://canva.com/design/DAC1xq2GJMk/hIMpX3mPUmYkmNshGT0ZEw/view',
        },
      'https://www.canva.com/design/DAE_HVNSl10/nZqb-SL59cV6Unj5Xd3y_w/view?utm_content=DAE_HVNSl10&utm_campaign=designshare&utm_medium=link&utm_source=homepage_design_menu':
        {
          designId: 'DAE_HVNSl10/nZqb-SL59cV6Unj5Xd3y_w',
          url: 'https://canva.com/design/DAE_HVNSl10/nZqb-SL59cV6Unj5Xd3y_w/view',
        },
    },
    weight: 100,
  },
  CODEPEN_PEN: {
    contentType: 'PEN',
    domain: 'codepen.io',
    extractContentInfo: (url) => {
      const [, username, penId] =
        /^\/([\w-]+)\/pen\/(\w+)/u.exec(url.pathname) ?? [];

      if (username && penId) {
        return {
          penId,
          url: 'https://codepen.io/' + username + '/pen/' + penId,
          username,
        };
      }

      return null;
    },
    site: 'CODEPEN',
    tests: {
      'https://codepen.io/Ashish-Nagvanshi/pen/RwBZJEx': {
        penId: 'RwBZJEx',
        url: 'https://codepen.io/Ashish-Nagvanshi/pen/RwBZJEx',
        username: 'Ashish-Nagvanshi',
      },
    },
    weight: 100,
  },
  DROPBOX_FILE: {
    contentType: 'FILE',
    domain: 'dropbox.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'fileId',
      /^\/s\/([a-z\d]+)/u,
      'https://dropbox.com/s/{{fileId}}',
    ),
    site: 'DROPBOX',
    tests: {
      'https://www.dropbox.com/s/0l5rt7y8rdfgy9l/': {
        fileId: '0l5rt7y8rdfgy9l',
        url: 'https://dropbox.com/s/0l5rt7y8rdfgy9l',
      },
      'https://www.dropbox.com/s/0l5rt7y8rdfgy9l/LL%20Envelope%20clutch%20REV.pdf':
        {
          fileId: '0l5rt7y8rdfgy9l',
          url: 'https://dropbox.com/s/0l5rt7y8rdfgy9l',
        },
    },
    weight: 100,
  },
  FIGMA_FILE: {
    contentType: 'FILE',
    domain: 'figma.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'fileId',
      /^\/file\/([a-zA-Z\d]+)/u,
      'https://figma.com/file/{{fileId}}',
    ),
    site: 'FIGMA',
    tests: {
      'https://www.figma.com/file/49P8UWLOadWskPwPvSz4bD': {
        fileId: '49P8UWLOadWskPwPvSz4bD',
        url: 'https://figma.com/file/49P8UWLOadWskPwPvSz4bD',
      },
    },
    weight: 100,
  },
  FIGMA_PROTOTYPE: {
    contentType: 'PROTOTYPE',
    domain: 'figma.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'prototypeId',
      /^\/proto\/([a-zA-Z\d]+)/u,
      'https://figma.com/proto/{{prototypeId}}',
    ),
    site: 'FIGMA',
    tests: {
      'https://www.figma.com/proto/JMT7Yw56eiphRJKp1S9EEe/Rabbit-UI?node-id=1-257&starting-point-node-id=1%3A257':
        {
          prototypeId: 'JMT7Yw56eiphRJKp1S9EEe',
          url: 'https://figma.com/proto/JMT7Yw56eiphRJKp1S9EEe',
        },
    },
    weight: 100,
  },
  GOOGLE_DOCS_DOCUMENT: {
    contentType: 'DOCUMENT',
    domain: 'docs.google.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'documentId',
      /^\/document\/d\/([\w-]+)/u,
      'https://docs.google.com/document/d/{{documentId}}/edit',
    ),
    site: 'GOOGLE_DOCS',
    tests: {
      'https://docs.google.com/document/d/1_1aYiJqjLeHUuO8c3hqOcIjKc567LoWIkKyC82Mt7P0/edit?usp=sharing':
        {
          documentId: '1_1aYiJqjLeHUuO8c3hqOcIjKc567LoWIkKyC82Mt7P0',
          url: 'https://docs.google.com/document/d/1_1aYiJqjLeHUuO8c3hqOcIjKc567LoWIkKyC82Mt7P0/edit',
        },
    },
    weight: 100,
  },
  GOOGLE_DOCS_PRESENTATION: {
    contentType: 'PRESENTATION',
    domain: 'docs.google.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'presentationId',
      /^\/presentation\/d\/([\w-]+)/u,
      'https://docs.google.com/presentation/d/{{presentationId}}/edit',
    ),
    site: 'GOOGLE_DOCS',
    tests: {
      'https://docs.google.com/presentation/d/11V5We7oJGoVOZESmjBg9B6iMiQzEeL58N4ujUEwbrxI/edit?usp=sharing':
        {
          presentationId: '11V5We7oJGoVOZESmjBg9B6iMiQzEeL58N4ujUEwbrxI',
          url: 'https://docs.google.com/presentation/d/11V5We7oJGoVOZESmjBg9B6iMiQzEeL58N4ujUEwbrxI/edit',
        },
    },
    weight: 100,
  },
  GOOGLE_DOCS_SPREADSHEET: {
    contentType: 'SPREADSHEET',
    domain: 'docs.google.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'spreadsheetId',
      /^\/spreadsheets\/d\/([\w-]+)/u,
      'https://docs.google.com/spreadsheets/d/{{spreadsheetId}}/edit',
    ),
    site: 'GOOGLE_DOCS',
    tests: {
      'https://docs.google.com/spreadsheets/d/1spdflo8CdY98uxwFlGQssbU5Yz8oVjbZ5uM_0qASRCk/':
        {
          spreadsheetId: '1spdflo8CdY98uxwFlGQssbU5Yz8oVjbZ5uM_0qASRCk',
          url: 'https://docs.google.com/spreadsheets/d/1spdflo8CdY98uxwFlGQssbU5Yz8oVjbZ5uM_0qASRCk/edit',
        },
    },
    weight: 100,
  },
  GOOGLE_DRIVE_FILE: {
    contentType: 'FILE',
    domain: 'drive.google.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'fileId',
      /^\/file\/d\/([\w-]+)/u,
      'https://drive.google.com/file/d/{{fileId}}/view',
    ),
    site: 'GOOGLE_DRIVE',
    tests: {
      'https://drive.google.com/file/d/1KBs8QdTjs-eJNEgZUxyvmkHkihg6mFnG/view?usp=share_link':
        {
          fileId: '1KBs8QdTjs-eJNEgZUxyvmkHkihg6mFnG',
          url: 'https://drive.google.com/file/d/1KBs8QdTjs-eJNEgZUxyvmkHkihg6mFnG/view',
        },
    },
    weight: 100,
  },
  GOOGLE_DRIVE_FOLDER: {
    contentType: 'FOLDER',
    domain: 'drive.google.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'folderId',
      /^\/drive\/folders\/([\w-]+)/u,
      'https://drive.google.com/drive/folders/{{folderId}}',
    ),
    site: 'GOOGLE_DRIVE',
    tests: {
      'https://drive.google.com/drive/folders/1JppVnu8-pIgr8IY0wuCo51JXP0H0YsDt?usp=share_link':
        {
          folderId: '1JppVnu8-pIgr8IY0wuCo51JXP0H0YsDt',
          url: 'https://drive.google.com/drive/folders/1JppVnu8-pIgr8IY0wuCo51JXP0H0YsDt',
        },
    },
    weight: 100,
  },
  INSTAGRAM_POST: {
    contentType: 'POST',
    domain: 'instagram.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'postId',
      /^\/p\/([a-zA-Z\d]+)/u,
      'https://instagram.com/p/{{postId}}',
    ),
    site: 'INSTAGRAM',
    tests: {
      'https://www.instagram.com/p/CqX93czLUe2/': {
        postId: 'CqX93czLUe2',
        url: 'https://instagram.com/p/CqX93czLUe2',
      },
      'https://www.instagram.com/p/CqX93czLUe2/?utm_source=ig_web_copy_link': {
        postId: 'CqX93czLUe2',
        url: 'https://instagram.com/p/CqX93czLUe2',
      },
    },
    weight: 100,
  },
  LINKTREE_PROFILE: {
    contentType: 'PROFILE',
    domain: 'linktr.ee',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'username',
      /^\/(\w+)$/u,
      'https://linktr.ee/{{username}}',
    ),
    site: 'LINKTREE',
    tests: {
      'https://linktr.ee/gajus': {
        url: 'https://linktr.ee/gajus',
        username: 'gajus',
      },
    },
    weight: 100,
  },
  LOOM_VIDEO: {
    contentType: 'VIDEO',
    domain: 'loom.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'videoId',
      /^\/share\/(\w+)/u,
      'https://www.loom.com/share/{{videoId}}',
    ),
    site: 'LOOM',
    tests: {
      'https://www.loom.com/share/1db1e88a454043b9a885016c5bd6053d': {
        url: 'https://www.loom.com/share/1db1e88a454043b9a885016c5bd6053d',
        videoId: '1db1e88a454043b9a885016c5bd6053d',
      },
    },
    weight: 100,
  },
  SOUNDCLOUD_TRACK: {
    contentType: 'TRACK',
    domain: 'soundcloud.com',
    extractContentInfo: (url) => {
      const [, username, trackId] =
        /([\w-]+)\/([\w-]+)/u.exec(url.pathname) ?? [];

      if (username && trackId) {
        return {
          trackId,
          url: 'https://soundcloud.com/' + username + '/' + trackId,
          username,
        };
      }

      return null;
    },
    site: 'SOUNDCLOUD',
    tests: {
      'https://soundcloud.com/strangehumman/kyoto-2?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing':
        {
          trackId: 'kyoto-2',
          url: 'https://soundcloud.com/strangehumman/kyoto-2',
          username: 'strangehumman',
        },
    },
    weight: 100,
  },
  SPOTIFY_ALBUM: {
    contentType: 'ALBUM',
    domain: 'open.spotify.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'albumId',
      /^\/album\/([a-zA-Z\d]+)/u,
      'https://open.spotify.com/album/{{albumId}}',
    ),
    site: 'SPOTIFY',
    tests: {
      'https://open.spotify.com/album/0sNOF9WDwhWunNAHPD3Baj?si=abC123dEeF': {
        albumId: '0sNOF9WDwhWunNAHPD3Baj',
        url: 'https://open.spotify.com/album/0sNOF9WDwhWunNAHPD3Baj',
      },
    },
    weight: 100,
  },
  SPOTIFY_ARTIST: {
    contentType: 'ARTIST',
    domain: 'open.spotify.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'artistId',
      /^\/artist\/([a-zA-Z\d]+)/u,
      'https://open.spotify.com/artist/{{artistId}}',
    ),
    site: 'SPOTIFY',
    tests: {
      'https://open.spotify.com/artist/0OdUWJ0sBjDrqHygGUXeCF?si=abC123dEeF': {
        artistId: '0OdUWJ0sBjDrqHygGUXeCF',
        url: 'https://open.spotify.com/artist/0OdUWJ0sBjDrqHygGUXeCF',
      },
    },
    weight: 100,
  },
  SPOTIFY_EPISODE: {
    contentType: 'EPISODE',
    domain: 'open.spotify.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'episodeId',
      /^\/episode\/([a-zA-Z\d]+)/u,
      'https://open.spotify.com/episode/{{episodeId}}',
    ),
    site: 'SPOTIFY',
    tests: {
      'https://open.spotify.com/episode/6xg5QY1nZzYkqXrY8X7Y3w?si=abC123dEeF': {
        episodeId: '6xg5QY1nZzYkqXrY8X7Y3w',
        url: 'https://open.spotify.com/episode/6xg5QY1nZzYkqXrY8X7Y3w',
      },
    },
    weight: 100,
  },
  SPOTIFY_PLAYLIST: {
    contentType: 'PLAYLIST',
    domain: 'open.spotify.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'playlistId',
      /^\/playlist\/([a-zA-Z\d]+)/u,
      'https://open.spotify.com/playlist/{{playlistId}}',
    ),
    site: 'SPOTIFY',
    tests: {
      'https://open.spotify.com/playlist/3rGUZnO9djjURH4SRYencD': {
        playlistId: '3rGUZnO9djjURH4SRYencD',
        url: 'https://open.spotify.com/playlist/3rGUZnO9djjURH4SRYencD',
      },
    },
    weight: 100,
  },
  SPOTIFY_SHOW: {
    contentType: 'SHOW',
    domain: 'open.spotify.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'showId',
      /^\/show\/([a-zA-Z\d]+)/u,
      'https://open.spotify.com/show/{{showId}}',
    ),
    site: 'SPOTIFY',
    tests: {
      'https://open.spotify.com/show/6vWDO969PvNqNYHIOW5v0m?si=abC123dEeF': {
        showId: '6vWDO969PvNqNYHIOW5v0m',
        url: 'https://open.spotify.com/show/6vWDO969PvNqNYHIOW5v0m',
      },
    },
    weight: 100,
  },
  SPOTIFY_TRACK: {
    contentType: 'TRACK',
    domain: 'open.spotify.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'trackId',
      /^\/track\/([a-zA-Z\d]+)/u,
      'https://open.spotify.com/track/{{trackId}}',
    ),
    site: 'SPOTIFY',
    tests: {
      'https://open.spotify.com/track/5uj0ZKm9chQRqB6mWKl4Uu': {
        trackId: '5uj0ZKm9chQRqB6mWKl4Uu',
        url: 'https://open.spotify.com/track/5uj0ZKm9chQRqB6mWKl4Uu',
      },
    },
    weight: 100,
  },
  TIKTOK_PROFILE: {
    contentType: 'PROFILE',
    domain: 'tiktok.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'username',
      /^\/@([\w.]+)/u,
      'https://tiktok.com/@{{username}}',
    ),
    site: 'TIKTOK',
    tests: {
      'https://www.tiktok.com/@fncischen?lang=en': {
        url: 'https://tiktok.com/@fncischen',
        username: 'fncischen',
      },
      'https://www.tiktok.com/@foo.bar': {
        url: 'https://tiktok.com/@foo.bar',
        username: 'foo.bar',
      },
    },
    weight: 100,
  },
  TIKTOK_VIDEO: {
    contentType: 'VIDEO',
    domain: 'tiktok.com',
    extractContentInfo: (url) => {
      const [, username, videoId] =
        /^\/@([\w.]+)\/video\/(\d+)/u.exec(url.pathname) ?? [];

      if (username && videoId) {
        return {
          url: 'https://tiktok.com/@' + username + '/video/' + videoId,
          username,
          videoId,
        };
      }

      return null;
    },
    site: 'TIKTOK',
    tests: {
      'https://www.tiktok.com/@fncischen/video/7020257482249374981?is_copy_url=1&is_from_webapp=v1':
        {
          url: 'https://tiktok.com/@fncischen/video/7020257482249374981',
          username: 'fncischen',
          videoId: '7020257482249374981',
        },
      'https://www.tiktok.com/@foo.bar/video/7020257482249374981': {
        url: 'https://tiktok.com/@foo.bar/video/7020257482249374981',
        username: 'foo.bar',
        videoId: '7020257482249374981',
      },
    },
    weight: 90,
  },
  TWITTER_PROFILE: {
    contentType: 'PROFILE',
    domain: 'twitter.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'username',
      /^\/([\w-]+)/u,
      'https://twitter.com/{{username}}',
    ),
    site: 'TWITTER',
    tests: {
      'https://twitter.com/gajus': {
        url: 'https://twitter.com/gajus',
        username: 'gajus',
      },
    },
    weight: 100,
  },
  TWITTER_STATUS: {
    contentType: 'STATUS',
    domain: 'twitter.com',
    extractContentInfo: (url) => {
      const [, username, statusId] =
        /^\/(\w+)\/status\/(\d+)/u.exec(url.pathname) ?? [];

      if (username && statusId) {
        return {
          statusId,
          url: 'https://twitter.com/' + username + '/status/' + statusId,
          username,
        };
      }

      return null;
    },
    site: 'TWITTER',
    tests: {
      'https://twitter.com/kuizinas/status/1640770515114532872': {
        statusId: '1640770515114532872',
        url: 'https://twitter.com/kuizinas/status/1640770515114532872',
        username: 'kuizinas',
      },
    },
    weight: 90,
  },
  VIMEO_MANAGE_VIDEO: {
    contentType: 'VIDEO',
    domain: 'vimeo.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'videoId',
      /^\/manage\/videos\/(\d+)/u,
      'https://vimeo.com/{{videoId}}',
    ),
    site: 'VIMEO',
    tests: {
      'https://vimeo.com/manage/videos/374790314': {
        url: 'https://vimeo.com/374790314',
        videoId: '374790314',
      },
    },
    weight: 100,
  },
  VIMEO_PROFILE: {
    contentType: 'PROFILE',
    domain: 'vimeo.com',
    extractContentInfo: (url) => {
      const [, username] = /^\/([a-zA-Z]\w+)$/u.exec(url.pathname) ?? [];
      const segments = url.pathname.replace(/^\//u, '').split('/');

      if (segments.length === 1 && username) {
        return {
          url: 'https://vimeo.com/' + username,
          username,
        };
      }

      return null;
    },
    site: 'VIMEO',
    tests: {
      'https://vimeo.com/gajus': {
        url: 'https://vimeo.com/gajus',
        username: 'gajus',
      },
      'https://vimeo.com/vobow/chiaroscuro': null,
    },
    weight: 100,
  },
  VIMEO_VIDEO: {
    contentType: 'VIDEO',
    domain: 'vimeo.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'videoId',
      /^\/(\d+)/u,
      'https://vimeo.com/{{videoId}}',
    ),
    site: 'VIMEO',
    tests: {
      'https://vimeo.com/123456789': {
        url: 'https://vimeo.com/123456789',
        videoId: '123456789',
      },
      'https://vimeo.com/403917615?embedded=true&source=video_title&owner=111305732':
        {
          url: 'https://vimeo.com/403917615',
          videoId: '403917615',
        },
    },
    weight: 100,
  },
  YOUTUBE_SHORT_VIDEO: {
    contentType: 'SHORT_VIDEO',
    domain: 'youtube.com',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'videoId',
      /^\/shorts\/([\w-]+)/u,
      'https://youtube.com/shorts/{{videoId}}',
    ),
    site: 'YOUTUBE',
    tests: {
      'https://youtube.com/shorts/wrBGTNMBkWc?feature=share': {
        url: 'https://youtube.com/shorts/wrBGTNMBkWc',
        videoId: 'wrBGTNMBkWc',
      },
    },
    weight: 100,
  },
  YOUTUBE_VIDEO: {
    contentType: 'VIDEO',
    domain: 'youtube.com',
    extractContentInfo: createIdFromSearchParameterContentExtractor(
      'videoId',
      'v',
      'https://www.youtube.com/watch?v={{videoId}}',
    ),
    site: 'YOUTUBE',
    tests: {
      'https://www.youtube.com/watch?v=5yrlJbeUgCc&ab_channel=EasyPeasyForTutorials':
        {
          url: 'https://www.youtube.com/watch?v=5yrlJbeUgCc',
          videoId: '5yrlJbeUgCc',
        },
      'https://www.youtube.com/watch?v=wE9vSGvzSHg': {
        url: 'https://www.youtube.com/watch?v=wE9vSGvzSHg',
        videoId: 'wE9vSGvzSHg',
      },
    },
    weight: 100,
  },
  YOUTUBE_VIDEO_SHORT_URL: {
    contentType: 'VIDEO',
    domain: 'youtu.be',
    extractContentInfo: createIdFromFirstPathnameRegexMatchContentInfoExtractor(
      'videoId',
      /^\/([\w-]+)/u,
      'https://www.youtube.com/watch?v={{videoId}}',
    ),
    site: 'YOUTUBE',
    tests: {
      'https://youtu.be/1JppVnu8-pI': {
        url: 'https://www.youtube.com/watch?v=1JppVnu8-pI',
        videoId: '1JppVnu8-pI',
      },
    },
    weight: 100,
  },
};
