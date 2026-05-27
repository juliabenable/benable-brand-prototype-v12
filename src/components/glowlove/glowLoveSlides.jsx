import { useEffect, useMemo, useState } from 'react';
import { BRAND, TOTALS, PLATFORM, CREATORS, ALL_POSTS } from '../../data/glowCampaign.js';
import { WRAPPED_COMMENTS, avColor, likeCount, timeAgo } from '../../data/wrappedComments.js';

/* "Glow Love" wrap — master deck (selected design per slide). 28 Litsea. */

export const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`);
const mention = (t) => t.split(/(@[\w.]+)/g).map((p, i) => (p.startsWith('@') ? <span key={i} className="gl-men">{p}</span> : p));
const TT = WRAPPED_COMMENTS.filter((c) => c.p === 'tt');
const IG = WRAPPED_COMMENTS.filter((c) => c.p === 'ig');
const TT_PCT = Math.round((PLATFORM.tiktok / (PLATFORM.tiktok + PLATFORM.reels)) * 100);
const IG_PCT = 100 - TT_PCT;
const CAMPAIGN = "Experience 28 Litsea's Award Winning Body Oil";

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
function usePlayOnMount() {
  const [play, setPlay] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => setPlay(true)); return () => cancelAnimationFrame(id); }, []);
  return play;
}

/* ---- phone mockup + comment feed (Comments · phone feed) ---- */
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

/* ---- floating emoji layer (sides only) ---- */
const EMOJI = [
  { e: '✨', x: '5%', y: '14%', s: 26, d: 0 }, { e: '🥹', x: '94%', y: '34%', s: 30, d: 0.8 },
  { e: '💖', x: '8%', y: '40%', s: 24, d: 0.4 }, { e: '🤩', x: '95%', y: '12%', s: 28, d: 1.2 },
  { e: '⭐', x: '92%', y: '62%', s: 26, d: 0.6 }, { e: '❤️', x: '3%', y: '60%', s: 30, d: 1.5 },
  { e: '🔥', x: '6%', y: '84%', s: 22, d: 1.0 }, { e: '🤍', x: '90%', y: '86%', s: 24, d: 0.3 },
  { e: '✨', x: '96%', y: '50%', s: 20, d: 1.8 }, { e: '🥰', x: '4%', y: '26%', s: 22, d: 0.9 },
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

/* Cover · B — stat tease (dark) */
export function Cover() {
  return (
    <div className="gl-slide gl-slide--center">
      <span className="gl-eyebrow">{BRAND} · Campaign Wrapped</span>
      <h1 className="gl-h1">Your campaign,<br /><span className="gl-accent">wrapped.</span></h1>
      <div className="gl-tease">
        <span><b>~{fmt(TOTALS.reach.base)}</b> reached</span><span className="gl-tease__dot">·</span>
        <span><b>{TOTALS.viewER}%</b> ER</span><span className="gl-tease__dot">·</span>
        <span><b>{WRAPPED_COMMENTS.length}</b> comments</span>
      </div>
      <p className="gl-sub">{CAMPAIGN}</p>
    </div>
  );
}

/* Reach · C — heart of dots (clean hex lattice + soft sphere + pulse) */
const HEART = (() => {
  const pts = []; const step = 0.11; let row = 0;
  const sx = 150, sy = 106, cx = 215, cy = 172;
  for (let y = 1.32; y >= -1.26; y -= step, row += 1) {
    const xoff = row % 2 ? step / 2 : 0;
    for (let x = -1.4 + xoff; x <= 1.4; x += step) {
      if (Math.pow(x * x + y * y - 1, 3) - x * x * Math.pow(y, 3) <= 0) pts.push([cx + x * sx, cy - y * sy, x, y]);
    }
  }
  return pts;
})();
const HEART_DOT = 10;
const PEOPLE_PER_DOT = Math.round(TOTALS.reach.base / HEART.length);

export function Reach() {
  const play = usePlayOnMount();
  const reach = useCountUp(TOTALS.reach.base, { dur: 1900, play });
  return (
    <div className="gl-slide gl-slide--center">
      <span className="gl-eyebrow">You reached</span>
      <div className="gl-reach-num">≈ {Number(reach).toLocaleString()}</div>
      <div className={`gl-hwrap ${play ? 'play' : ''}`} aria-hidden="true">
        {HEART.map((p, i) => {
          const cd = Math.hypot(p[2], p[3] - 0.2);
          const del = (0.25 + cd * 0.5);
          return (
            <span key={i} className="gl-hd" style={{
              left: `${p[0]}px`, top: `${p[1]}px`, width: `${HEART_DOT}px`, height: `${HEART_DOT}px`,
              animationDelay: `${del.toFixed(2)}s, ${(del + 0.5).toFixed(2)}s`,
            }} />
          );
        })}
      </div>
      <p className="gl-sub">each dot ≈ {PEOPLE_PER_DOT} people · observed {TOTALS.observedViews.toLocaleString()} → {fmt(TOTALS.reach.high)} with stories</p>
      <div className="gl-chips">
        <span className="gl-chip"><span className="gl-chip__ic gl-chip__ic--tt">♪</span>TikTok <b>{TT_PCT}%</b></span>
        <span className="gl-chip"><span className="gl-chip__ic gl-chip__ic--ig">◉</span>Instagram <b>{IG_PCT}%</b></span>
      </div>
    </div>
  );
}

/* Engagement · B — hero 5× + proof stats */
export function Engagement() {
  const play = usePlayOnMount();
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
          <div className="gl-eng-stat__v">{er}%</div><div className="gl-eng-stat__l">your engagement rate</div>
        </div>
        <div className={`gl-eng-stat gl-eng-stat--mut gl-proof ${on}`} style={{ '--i': 1 }}>
          <div className="gl-eng-stat__v">{TOTALS.benchmark}%</div><div className="gl-eng-stat__l">industry average</div>
        </div>
        <div className={`gl-eng-stat gl-proof ${on}`} style={{ '--i': 2 }}>
          <div className="gl-eng-stat__v">{eng}</div><div className="gl-eng-stat__l">total engagements</div>
        </div>
      </div>
    </div>
  );
}

/* Comments · C — phone feed */
export function Comments() {
  return (
    <div className="gl-slide gl-slide--split">
      <div className="gl-split__text">
        <span className="gl-eyebrow gl-eyebrow--dot">Straight from the source</span>
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

/* Comments · A — collage wall */
const WALL_TILT = ['-2deg', '1.5deg', '-1.2deg', '2deg', '-1.6deg', '1deg'];
export function CommentsWall() {
  return (
    <div className="gl-slide">
      <div className="gl-cnt-head"><span className="gl-eyebrow">Every single one</span><h2 className="gl-h2">The <span className="gl-accent">wall of love.</span></h2></div>
      <div className="gl-wall">
        {WRAPPED_COMMENTS.map((c, i) => (
          <div key={i} className="gl-wcard" style={{ '--t': WALL_TILT[i % WALL_TILT.length] }}>
            <span className={`gl-wcard__plat ${c.p === 'tt' ? 'tt' : 'ig'}`}>{c.p === 'tt' ? '♪' : '◉'}</span>
            <div className="gl-wcard__row">
              <span className="gl-wcard__av" style={{ background: avColor(c.u) }}>{c.u[0].toUpperCase()}</span>
              <div className="gl-wcard__b"><div className="gl-wcard__u">@{c.u}</div><div className="gl-wcard__t">{mention(c.t)}</div></div>
            </div>
          </div>
        ))}
      </div>
      <div className="gl-wall__fade" />
    </div>
  );
}

/* Content · photowall (held — kept as-is) */
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

/* Creators · F — relationship cards (no ranking) */
export function Creators() {
  const maxEr = Math.max(...CREATORS.map((c) => c.er));
  const relMeta = { Favorite: ['fav', '★'], Repeat: ['rep', '↻'], 'New find': ['new', '✦'] };
  return (
    <div className="gl-slide">
      <div className="gl-cnt-head"><span className="gl-eyebrow">Your creator crew</span><h2 className="gl-h2">The people <span className="gl-accent">behind the glow.</span></h2></div>
      <div className="gl-team">
        {CREATORS.map((c) => {
          const [cls, icon] = relMeta[c.rel] || relMeta.Repeat;
          return (
            <div key={c.handle} className="gl-rcard">
              <span className={`gl-rcard__rel gl-rcard__rel--${cls}`}>{icon} {c.rel}</span>
              <div className="gl-rcard__top">
                <span className="gl-rcard__pic" style={{ backgroundImage: `url(${c.pic})` }} />
                <div className="gl-rcard__id"><b>{c.name}</b><small>{c.handle}</small></div>
              </div>
              <div className="gl-rcard__stats">
                <span><b>{fmt(c.views)}</b><small>views</small></span>
                <span><b>{c.eng}</b><small>eng.</small></span>
                <span><b className="gl-rcard__er">{c.er}%</b><small>ER</small></span>
              </div>
              <div className="gl-rcard__bar"><span style={{ width: `${(c.er / maxEr) * 100}%` }} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Note from Katie · A — handwritten postcard */
export function Katie() {
  return (
    <div className="gl-slide gl-slide--center">
      <span className="gl-eyebrow">A note from your Benable strategist</span>
      <div className="gl-postcard">
        <span className="gl-postcard__tape" />
        <p className="gl-postcard__msg">Hi {BRAND} team — what a glow-up! Your creators pulled a <b>{TOTALS.viewER}%</b> engagement rate, 5× the benchmark, and the comments were pure love. So proud of this one — already dreaming up round two. ♥</p>
        <div className="gl-postcard__sign">
          <span className="gl-postcard__av">K</span>
          <div><b>Katie</b><small>your Benable strategist</small></div>
        </div>
      </div>
    </div>
  );
}

/* Recap · D2 — editorial dark */
export function Recap({ onCta }) {
  const ledger = [
    [`~${fmt(TOTALS.reach.base)}`, 'reach'],
    [`${TOTALS.viewER}%`, 'engagement rate · 5× the average', true],
    [`${TOTALS.engagements}`, 'total engagements'],
    [`${WRAPPED_COMMENTS.length}`, 'comments · all positive'],
    [`${TOTALS.pieces}`, 'pieces of content'],
    [`${TOTALS.creators}`, 'creators'],
  ];
  return (
    <div className="gl-slide gl-recap2">
      <div className="gl-recap2__left">
        <span className="gl-eyebrow">That's a wrap</span>
        <h2 className="gl-recap2__h">{BRAND},<br /><em className="gl-accent">wrapped.</em></h2>
        <p className="gl-recap2__sub">{CAMPAIGN}</p>
        <button className="gl-cta" onClick={onCta}>Launch round two →</button>
      </div>
      <div className="gl-recap2__ledger">
        {ledger.map(([v, l, hero], i) => (
          <div key={i} className={`gl-led ${hero ? 'gl-led--hero' : ''}`}><b>{v}</b><small>{l}</small></div>
        ))}
      </div>
    </div>
  );
}

/* Thank-yous · sent notes (message + wax-seal/envelope) + CTA for the rest */
const THANKED = [
  { c: CREATORS[0], msg: 'Sam — your glow routine stopped the scroll. Thank you for making us look this good 💛' },
  { c: CREATORS[1], msg: 'Lulu, that body-oil glow was unreal. So grateful to have you on this one 🌿' },
];
const UNTHANKED = [CREATORS[2], CREATORS[3]];
export function Thanks() {
  return (
    <div className="gl-slide gl-slide--center glt">
      <div className="gl-cnt-head">
        <span className="gl-eyebrow">Thank-yous</span>
        <h2 className="gl-h2">You sent <span className="gl-accent">{THANKED.length} notes</span> of love.</h2>
      </div>
      <div className="glt-cards">
        {THANKED.map(({ c, msg }, i) => (
          <div key={c.handle} className="glt-card" style={{ '--t': i % 2 ? '2.5deg' : '-2.5deg' }}>
            <span className="glt-card__seal">♥<i>SENT</i></span>
            <p className="glt-card__msg">{msg}</p>
            <div className="glt-card__sign">
              <span className="glt-card__av" style={{ backgroundImage: `url(${c.pic})` }} />
              <div><b>{c.name}</b><small>{c.handle}</small></div>
            </div>
          </div>
        ))}
      </div>
      <div className="glt-cta">
        <div className="glt-cta__avs">{UNTHANKED.map((c) => <span key={c.handle} style={{ backgroundImage: `url(${c.pic})` }} />)}</div>
        <div className="glt-cta__txt">
          <b>{UNTHANKED.length} still to thank</b>
          <small>{UNTHANKED.map((c) => c.name.split(' ')[0]).join(' & ')} haven't heard from you yet</small>
        </div>
        <button type="button" className="gl-cta glt-cta__btn">Send a thank-you →</button>
      </div>
    </div>
  );
}

export const SLIDES = [
  { key: 'cover', grad: 'dark', dark: true, Body: Cover },
  { key: 'reach', grad: 'b', Body: Reach },
  { key: 'engagement', grad: 'c', Body: Engagement },
  { key: 'comments', grad: 'd', Body: Comments },
  { key: 'comments-wall', grad: 'e', Body: CommentsWall },
  { key: 'content', grad: 'f', Body: Content },
  { key: 'creators', grad: 'g', Body: Creators },
  { key: 'thanks', grad: 'h', Body: Thanks },
  { key: 'note', grad: 'a', Body: Katie },
  { key: 'recap', grad: 'dark', dark: true, Body: Recap },
];
