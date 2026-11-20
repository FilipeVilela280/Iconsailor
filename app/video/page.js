import { Clip } from '@/components/Media';
import YouTubeFilm from '@/components/YouTubeFilm';
import { CLIPS } from '@/data/media';

export const metadata = { title: 'Vídeo' };

export default function Video() {
  return (
    <main>
      <section className="blk" style={{ paddingTop: 'calc(var(--nav-h) + 70px)' }}>
        <div className="wrap">
          <p className="eyebrow">Vídeo</p>
          <h2 className="h2">Icon Sailor <em>em movimento.</em></h2>
          <YouTubeFilm />
        </div>
      </section>

      
    </main>
  );
}
