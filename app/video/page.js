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

      <section className="blk" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <p className="eyebrow">Momentos</p>
          <h2 className="h2">Pequenos filmes, <em>grandes dias.</em></h2>
          <div className="clips">
            {CLIPS.map(([name, cap]) => <Clip key={name} name={name} cap={cap} showPlay />)}
          </div>
        </div>
      </section>
    </main>
  );
}
