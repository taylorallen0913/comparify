import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useSpotify } from '~/context/spotify';
import { AUTHORIZATION_ENDPOINT, getRefreshToken } from '~/lib/spotify';

export const meta: MetaFunction = () => ({
  refresh: {
    httpEquiv: 'expires',
    content: '0',
  },
});

export const loader: LoaderFunction = async ({ request }) => {
  const code = new URL(request.url).searchParams.get('code');
  const refreshToken = code ? await getRefreshToken(code) : null;
  if (refreshToken) {
    const accessToken = refreshToken.access_token;
    if (accessToken) {
      return json({
        // recentTracks: res,
        authorizationEndpoint: AUTHORIZATION_ENDPOINT,
        refreshToken,
      });
    }
  }

  return json({
    // recentTracks: res,
    authorizationEndpoint: AUTHORIZATION_ENDPOINT,
    refreshToken,
  });
};

export default function Index() {
  const { authorizationEndpoint, refreshToken, recentTracks } = useLoaderData();
  console.log(recentTracks);
  return (
    <div className="h-screen bg-[#2B2D42]">
      <div className="w-1/2 flex justify-center">
        <a
          href={authorizationEndpoint}
          className="bg-[#EDF2F4] text-gray-800 p-3 rounded-lg"
        >
          Login
        </a>
      </div>
    </div>
  );
}
