import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getRefreshToken } from '~/lib/spotify';

export const meta: MetaFunction = () => ({
  refresh: {
    httpEquiv: 'expires',
    content: '0',
  },
});

export const loader: LoaderFunction = async ({ request }) => {
  const code = new URL(request.url).searchParams.get('code');
  const refreshToken = code ? await getRefreshToken(code) : null;
  return json({ client_id: process.env.SPOTIFY_CLIENT_ID!, refreshToken });
};

export default function Index() {
  const { client_id, refreshToken } = useLoaderData();
  console.log(refreshToken);

  return (
    <div className="h-screen bg-gray-50">
      <div className="">
        <a
          href={`https://accounts.spotify.com/authorize?client_id=${client_id}&show_dialog=true&response_type=code&redirect_uri=http%3A%2F%2Flocalhost:3000&scope=user-read-currently-playing%20user-top-read`}
          className="bg-black text-white p-3 rounded-lg"
        >
          Login
        </a>
        {refreshToken.refresh_token && (
          <div>
            <h1>Refresh Token:</h1>
            <code>{refreshToken.refresh_token}</code>
          </div>
        )}
      </div>
    </div>
  );
}
