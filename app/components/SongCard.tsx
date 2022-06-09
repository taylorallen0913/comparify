interface SongCardProps {
  name: string;
  artist: string;
  imageUrl: string;
}

export default function SongCard({ name, artist, imageUrl }: SongCardProps) {
  return (
    <div className="flex w-full max-w-xs rounded-md bg-gray-900 p-2 m-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center">
        <img width={64} height={64} src={imageUrl} alt="Song Image" />
      </div>
      <div className="ml-2 flex w-full flex-col justify-center overflow-hidden text-left">
        <h1 className="truncate text-sm text-white">{name}</h1>
        <h1 className="truncate text-xs text-gray-200">{artist}</h1>
      </div>
    </div>
  );
}
