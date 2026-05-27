import { useEffect, useState } from 'react';
import { BRAND, TOTALS, PLATFORM, CREATORS, ALL_POSTS } from '../../data/glowCampaign.js';
import { WRAPPED_COMMENTS, avColor, likeCount, timeAgo } from '../../data/wrappedComments.js';

/* "Glow Love" style — soft gradient bg, editorial headlines, phone mockups,
   floating emojis. Slide bodies shared by the live player. */

export const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`);
const mention = (t) => t.split(/(@[\w.]+)/g).map((p, i) => (p.startsWith('@') ? <span key={i} className="gl-men">{p}</span> : p));
const TT = WRAPPED_COMMENTS.filter((c) => c.p === 'tt');
const IG = WRAPPED_COMMENTS.filter((c) => c.p === 'ig');

/* ---- phone mockup + comment feed ---- */
function CommentRow({ c, ig }) {
  return (
    <div className="gl-row">
      <span className="gl-row__av" style={{ background: avColor(c.u) }}>{c.u[0].toUpperCase()}</span>
      <div className="gl-row__b">
        <span className="gl-row__u">@{c.u}</span>
        <p className="gl-row__t">{mention(c.t)}</p>
        <div className="gl-row__meta"><span>{timeAgo(c.u)}</span><span>Reply</span></div>
      </div>
      <div className="gl-row__like"><span className={`gl-row__heart ${ig ? '' : 'tt'}`}>{ig ? '♡' : '♥'}</span><small>{likeCount(c.u)}</small></div>
    </div>
  );
}

function Phone({ kind, title, list, className, style }) {
  const ig = kind === 'ig';
  return (
    <div className={`gl-phone ${className || ''}`} style={style}>
      <div className="gl-phone__screen">
        <div className="gl-phone__status"><span>9:41</span><span className="gl-phone__sig"><i /><i /><i /> <b /></span></div>
        <div className="gl-phone__notch" />
        <div className={`gl-feed ${ig ? 'gl-feed--ig' : 'gl-feed--tt'}`}>
          <div className="gl-feed__hd">{title}</div>
          <div className="gl-feed__list">{list.map((c, i) => <CommentRow key={i} c={c} ig={ig} />)}</div>
        </div>
      </div>
    </div>
  );
}

/* ---- floating emoji layer (lives in the frame) ---- */
const EMOJI = [
  { e: '✨', x: '6%', y: '14%', s: 26, d: 0 }, { e: '🥹', x: '93%', y: '34%', s: 30, d: 0.8 },
  { e: '💖', x: '57%', y: '4%', s: 24, d: 0.4 }, { e: '🤩', x: '95%', y: '12%', s: 28, d: 1.2 },
  { e: '⭐', x: '90%', y: '62%', s: 26, d: 0.6 }, { e: '❤️', x: '3%', y: '54%', s: 30, d: 1.5 },
  { e: '🔥', x: '8%', y: '84%', s: 22, d: 1.0 }, { e: '🤍', x: '86%', y: '86%', s: 24, d: 0.3 },
  { e: '✨', x: '49%', y: '92%', s: 20, d: 1.8 }, { e: '🥰', x: '70%', y: '70%', s: 22, d: 0.9 },
];
export function FloatingEmojis() {
  return (
    <div className="gl-emojis" aria-hidden="true">
      {EMOJI.map((m, i) => (
        <span key={i} style={{ left: m.x, top: m.y, fontSize: `${m.s}px`, animationDelay: `${m.d}s` }}>{m.e}</span>
      ))}
    </div>
  );
}

/* ============================ slides ============================ */
export function Cover() {
  return (
    <div className="gl-slide gl-slide--center">
      <span className="gl-eyebrow">2025 Campaign · Wrapped</span>
      <h1 className="gl-h1">Your year,<br /><span className="gl-accent">all glow.</span></h1>
      <p className="gl-sub">{BRAND} × {TOTALS.creators} creators · {TOTALS.pieces} pieces of content</p>
      <div className="gl-faces">{CREATORS.map((c) => <span key={c.handle} style={{ backgroundImage: `url(${c.pic})` }} />)}</div>
    </div>
  );
}

export function Reach() {
  return (
    <div className="gl-slide gl-slide--center">
      <span className="gl-eyebrow">Reach estimate</span>
      <h2 className="gl-h2">Seen <span className="gl-accent">~{fmt(TOTALS.reach.base)}</span> times.</h2>
      <p className="gl-sub">across feeds &amp; stories — {TOTALS.observedViews.toLocaleString()} observed, up to {fmt(TOTALS.reach.high)} with stories.</p>
      <div className="gl-chips">
        <span className="gl-chip"><b>{fmt(PLATFORM.tiktok)}</b> TikTok views</span>
        <span className="gl-chip"><b>{fmt(PLATFORM.reels)}</b> IG Reel views</span>
        <span className="gl-chip"><b>~{fmt(PLATFORM.storyEst)}</b> Stories <i>est.</i></span>
      </div>
    </div>
  );
}

/* count-up that runs once `play` flips true, after an optional delay */
function useCountUp(to, { dec = 0, dur = 1300, delay = 0, play }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!play) return undefined;
    let raf;
    const t0 = performance.now() + delay;
    const tick = (now) => {
      if (now < t0) { raf = requestAnimationFrame(tick); return; }
      let t = Math.min(1, (now - t0) / dur);
      t = 1 - Math.pow(1 - t, 3);
      setVal(to * t);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setVal(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, to, dur, delay]);
  return val.toFixed(dec);
}

/* Hero 5× — lead with the multiple; supporting stats whisper the proof. */
export function Engagement() {
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setPlay(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const er = useCountUp(TOTALS.viewER, { dec: 1, dur: 1100, delay: 750, play });
  const eng = useCountUp(TOTALS.engagements, { dec: 0, dur: 1300, delay: 750, play });
  const on = play ? 'play' : '';
  return (
    <div className="gl-slide gl-slide--center gl-eng">
      <span className="gl-eyebrow">Engagement</span>
      <div className={`gl-five ${on}`}>5×</div>
      <div className="gl-five-sub">the industry benchmark</div>
      <div className="gl-eng-stats">
        <div className={`gl-eng-stat gl-proof ${on}`} style={{ '--i': 0 }}>
          <div className="gl-eng-stat__v">{er}%</div>
          <div className="gl-eng-stat__l">your engagement rate</div>
        </div>
        <div className={`gl-eng-stat gl-eng-stat--mut gl-proof ${on}`} style={{ '--i': 1 }}>
          <div className="gl-eng-stat__v">{TOTALS.benchmark}%</div>
          <div className="gl-eng-stat__l">industry average</div>
        </div>
        <div className={`gl-eng-stat gl-proof ${on}`} style={{ '--i': 2 }}>
          <div className="gl-eng-stat__v">{eng}</div>
          <div className="gl-eng-stat__l">total engagements</div>
        </div>
      </div>
    </div>
  );
}

export function Comments() {
  return (
    <div className="gl-slide gl-slide--split">
      <div className="gl-split__text">
        <span className="gl-eyebrow gl-eyebrow--dot">Live reactions</span>
        <h2 className="gl-h2">{WRAPPED_COMMENTS.length} comments.<br /><span className="gl-accent">All love.</span></h2>
        <p className="gl-sub">Real reactions poured in across your creators' TikToks &amp; Reels — and not one of them was anything but glowing.</p>
        <div className="gl-chips">
          <span className="gl-chip"><span className="gl-chip__ic gl-chip__ic--tt">♪</span><b>{TT.length}</b> TikTok</span>
          <span className="gl-chip"><span className="gl-chip__ic gl-chip__ic--ig">◉</span><b>{IG.length}</b> Instagram</span>
        </div>
        <span className="gl-chip gl-chip--ghost">most-said: <b>“glow”</b> ✨</span>
      </div>
      <div className="gl-split__phones">
        <Phone kind="tt" title="Comments" list={TT} className="gl-phone--back" style={{ '--t': '-6deg' }} />
        <Phone kind="ig" title={`${WRAPPED_COMMENTS.length} comments`} list={WRAPPED_COMMENTS} className="gl-phone--front" style={{ '--t': '4deg' }} />
      </div>
    </div>
  );
}

const TILT = ['-5deg', '4deg', '-3deg', '5deg', '-4deg', '3deg', '-2deg'];
export function Content() {
  const posts = ALL_POSTS.filter((p) => !p.story);
  return (
    <div className="gl-slide">
      <div className="gl-cnt-head"><span className="gl-eyebrow">The content they made</span><h2 className="gl-h2"><span className="gl-accent">{TOTALS.pieces} pieces</span> of glow.</h2></div>
      <div className="gl-photowall">
        {posts.map((p, i) => (
          <div key={i} className="gl-photo" style={{ '--t': TILT[i % TILT.length], marginTop: i % 2 ? '30px' : '0', marginLeft: i ? '-10px' : 0, zIndex: i + 1 }}>
            <span className="gl-photo__img" style={{ backgroundImage: `url(${p.img})` }} />
            <span className="gl-photo__tag"><span className="gl-photo__av" style={{ backgroundImage: `url(${p.creator.pic})` }} /><span><b>{p.creator.name}</b><small>{p.creator.handle}</small></span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Creators() {
  const ranked = [...CREATORS].sort((a, b) => b.er - a.er);
  const maxEr = Math.max(...ranked.map((c) => c.er));
  return (
    <div className="gl-slide">
      <div className="gl-cnt-head"><span className="gl-eyebrow">Your dream team</span><h2 className="gl-h2"><span className="gl-accent">{TOTALS.creators} creators</span>, all glowing.</h2></div>
      <div className="gl-team">
        {ranked.map((c) => (
          <div key={c.handle} className={`gl-tcard ${c.top ? 'is-top' : ''}`}>
            {c.top && <span className="gl-tcard__crown">★ Top performer</span>}
            <span className="gl-tcard__pic" style={{ backgroundImage: `url(${c.pic})` }} />
            <div className="gl-tcard__id"><b>{c.name}</b><small>{c.handle}</small></div>
            <div className="gl-tcard__stats"><span><b>{fmt(c.views)}</b><small>views</small></span><span><b>{c.eng}</b><small>eng.</small></span><span><b>{c.er}%</b><small>ER</small></span></div>
            <div className="gl-tcard__bar"><span style={{ width: `${(c.er / maxEr) * 100}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Katie() {
  return (
    <div className="gl-slide gl-slide--center">
      <span className="gl-eyebrow">A note from your Benable lead</span>
      <div className="gl-note">
        <span className="gl-note__av">K</span>
        <p className="gl-note__msg">Hi {BRAND} team — what a glow-up! Your creators pulled a <b>20.5%</b> engagement rate, 5× the benchmark. The comments are pure buying intent. I'm already lining up round two. 💜</p>
        <span className="gl-note__sign">— Katie</span>
      </div>
    </div>
  );
}

export function Recap({ onCta }) {
  const top = [...CREATORS].sort((a, b) => b.er - a.er)[0];
  return (
    <div className="gl-slide gl-slide--center">
      <span className="gl-eyebrow">That's a wrap</span>
      <h2 className="gl-h2">{BRAND}, <span className="gl-accent">wrapped.</span></h2>
      <div className="gl-recap">
        <div><b>~{fmt(TOTALS.reach.base)}</b><small>reach</small></div>
        <div className="hl"><b>{TOTALS.viewER}%</b><small>engagement</small></div>
        <div><b>{TOTALS.engagements}</b><small>reactions</small></div>
        <div><b>{TOTALS.creators}</b><small>creators</small></div>
      </div>
      <p className="gl-sub">Top performer: <b>{top.name}</b> · {top.er}% ER</p>
      <button className="gl-cta" onClick={onCta}>Launch round two →</button>
    </div>
  );
}

export const SLIDES = [
  { key: 'cover', grad: 'a', Body: Cover },
  { key: 'reach', grad: 'b', Body: Reach },
  { key: 'engagement', grad: 'c', Body: Engagement },
  { key: 'comments', grad: 'd', Body: Comments },
  { key: 'content', grad: 'e', Body: Content },
  { key: 'creators', grad: 'f', Body: Creators },
  { key: 'note', grad: 'g', Body: Katie },
  { key: 'recap', grad: 'h', Body: Recap },
];
