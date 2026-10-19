type VideoPlayerProps = {
  src: string
  poster?: string
}

// key={src}: trocar a fonte recarrega o vídeo em vez de manter o anterior
function VideoPlayer({ src, poster }: VideoPlayerProps) {
  return (
    <video
      key={src}
      src={src}
      poster={poster}
      controls
      muted
      loop
      playsInline
      className="aspect-video w-full rounded-xl border bg-black object-contain"
    />
  )
}

export default VideoPlayer
