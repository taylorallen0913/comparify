import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useSpotify } from '~/context/spotify';
import { AUTHORIZATION_ENDPOINT, getRefreshToken } from '~/lib/spotify';
import axios from 'axios';
import SongCard from '~/components/SongCard';

export const meta: MetaFunction = () => ({
  refresh: {
    httpEquiv: 'expires',
    content: '0',
  },
});

interface Song {
  name: string;
  artist: string;
  imageUrl: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const code = new URL(request.url).searchParams.get('code');
  const refreshToken = code ? await getRefreshToken(code) : null;

  if (refreshToken) {
    const accessToken = refreshToken.access_token;
    if (typeof accessToken == 'string' && accessToken) {
      const topTracks = await axios
        .get('https://api.spotify.com/v1/me/top/tracks?limit=50', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          return res.data.items.map((track: any) => ({
            name: track.name,
            artist: track.album.artists[0].name,
            imageUrl: track.album.images[0].url,
          }));
        })
        .catch((err) => {});
      return json({
        recentTracks: topTracks,
        authorizationEndpoint: AUTHORIZATION_ENDPOINT,
        refreshToken,
      });
    }
  }

  return json({
    authorizationEndpoint: AUTHORIZATION_ENDPOINT,
    refreshToken,
  });
};

export default function Index() {
  const { authorizationEndpoint, recentTracks } = useLoaderData();
  return (
    <div className="flex h-screen justify-center">
      {recentTracks ? (
        <div className="">
          {recentTracks.map((track: Song) => (
            <SongCard
              name={track.name}
              artist={track.artist}
              imageUrl={track.imageUrl}
            />
          ))}
        </div>
      ) : (
        <div className="mt-20">
          <a
            href={authorizationEndpoint}
            className="bg-[#EDF2F4] text-gray-800 p-3 rounded-lg"
          >
            Login
          </a>
        </div>
      )}
    </div>
  );
}
