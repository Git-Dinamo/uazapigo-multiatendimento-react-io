/** Right pane when no conversation is open: a soft card with a simple drawing. */
export function EmptyState({ status }: { status: string }) {
  return (
    <section className="empty">
      <div className="empty-wrap">
        <div className="empty-card">
          <div className="cloud c1">
            <i style={{ top: 27, left: 0, width: 65, height: 30 }} />
            <i style={{ top: 14, left: 16, width: 30, height: 30 }} />
          </div>
          <div className="cloud c2">
            <i style={{ top: 21, left: 2, width: 45, height: 20 }} />
            <i style={{ top: 14, left: 16, width: 20, height: 20 }} />
          </div>
          <div className="cloud c3">
            <i style={{ top: 27, left: 5, width: 60, height: 25 }} />
            <i style={{ top: 14, left: 23, width: 25, height: 25 }} />
          </div>
          <svg className="empty-art" viewBox="0 0 320 320" aria-hidden="true">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#25d366" />
                <stop offset="1" stopColor="#008069" />
              </linearGradient>
            </defs>
            <path
              d="M60 70h170a26 26 0 0 1 26 26v92a26 26 0 0 1-26 26H128l-44 36v-36H60a26 26 0 0 1-26-26V96a26 26 0 0 1 26-26z"
              fill="url(#g1)"
            />
            <rect x="70" y="112" width="120" height="12" rx="6" fill="#fff" opacity=".9" />
            <rect x="70" y="138" width="150" height="12" rx="6" fill="#fff" opacity=".75" />
            <rect x="70" y="164" width="90" height="12" rx="6" fill="#fff" opacity=".6" />
            <path
              d="M168 196h104a20 20 0 0 1 20 20v52a20 20 0 0 1-20 20h-10v26l-30-26h-64a20 20 0 0 1-20-20v-52a20 20 0 0 1 20-20z"
              fill="#fff"
            />
            <circle cx="196" cy="242" r="7" fill="#008069" />
            <circle cx="220" cy="242" r="7" fill="#008069" opacity=".7" />
            <circle cx="244" cy="242" r="7" fill="#008069" opacity=".45" />
          </svg>
        </div>
        <div className="empty-text">
          <strong>uazapi</strong> - API de WhatsApp · {status}
        </div>
      </div>
    </section>
  );
}
