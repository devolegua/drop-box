import React, {useState, useEffect} from 'react'
import { Dropbox } from 'dropbox';

const CLIENT_ID = '1bvnw4o653fzbgt';

function DbxAuth() {
  const [isAuthedSectionShown, showAuthedSection] = useState(false);
  const [isPreAuthSectionShown, showPreAuthSection] = useState(false);
  const [entries, setEntries] = useState<any[] | null>(null);
  const onInit = createOnInit({
    showAuthedSection,
    showPreAuthSection,
    setEntries
  });

  useEffect(onInit, []);

  // This example takes the user through Dropbox's API OAuth flow
  // using <code>Dropbox.getAuthenticationUrl()</code> method
  // [<a href="http://dropbox.github.io/dropbox-sdk-js/Dropbox.html#getAuthenticationUrl">docs</a>]
  // and then uses the generated access token to list the contents of
  // their root directory.

  return (
    <div className="App">
      <div className="container main">
        <div
          id="pre-auth-section"
          style={{display: isPreAuthSectionShown ? 'block' : 'none'}}
        >
          <a href="" id="authlink" className="button">Authenticate</a>
          <p className="info">
            Once authenticated, it will use the access token to list the files in your root directory.
          </p>
        </div>

        <div
          id="authed-section"
          style={{display: isAuthedSectionShown ? 'block' : 'none'}}
        >
          <p>
            You have successfully authenticated. Below are the contents of your
            root directory. They were fetched using the SDK and access
            token.
          </p>

          <ul id="files">
            {entries && entries.map(entr => (
              <li>{ entr.name }</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}


function createOnInit(opts: any) {
  return function onInit() {
    if (isAuthenticated()) {
      opts.showAuthedSection(true);

      // Create an instance of Dropbox with the access token and use it to
      // fetch and render the files in the users root directory.
      const accessToken = getAccessTokenFromUrl();
      localStorage.accessToken = accessToken;
      const dbx = new Dropbox({ accessToken });

      dbx.filesListFolder({
        path: '',
        recursive: false,
        include_media_info: false,
        include_deleted: false,
        include_has_explicit_shared_members: false
      }).then(resp => {
        opts.setEntries(resp.entries);
      }).catch(err => {
        console.error(err);
      })
    } else {
      opts.showPreAuthSection(true);

      // Set the login anchors href using dbx.getAuthenticationUrl()
      const dbx = new Dropbox({ clientId: CLIENT_ID });
      const authUrl = dbx.getAuthenticationUrl('http://localhost:3100');
      (document.getElementById('authlink') as HTMLAnchorElement).href = authUrl;
    }
  }
}


// Parses the url and gets the access token if it is in the urls hash
function getAccessTokenFromUrl(): string {
  return parseQueryString(window.location.hash)['access_token'] as string;
}

// If the user was just redirected from authenticating, the urls hash will
// contain the access token.
function isAuthenticated(): boolean {
  return Boolean(getAccessTokenFromUrl()) || localStorage.accessToken;
}

function parseQueryString(str: string | undefined) {
  const ret: Record<string, string[] | string> = Object.create(null);

  if (typeof str !== 'string') {
    return ret;
  }

  str = str.trim().replace(/^(\?|#|&)/, '');

  if (!str) {
    return ret;
  }

  str.split('&').forEach(function (param: string) {
    const [rawKey, ...rest] = param.replace(/\+/g, ' ').split('=');
    // Firefox (pre 40) decodes `%3D` to `=`
    // https://github.com/sindresorhus/query-string/pull/37
    const key = decodeURIComponent(rawKey);
    const val = rest.length > 0 ? decodeURIComponent(rest.join('=')) : null;

    if (!val) return;

    const retVal = ret[key];

    if (retVal === undefined) {
      ret[key] = val;
    } else if (Array.isArray(retVal)) {
      retVal.push(val);
    } else {
      ret[key] = [retVal as string, val];
    }
  });

  return ret;
}

export default DbxAuth;
