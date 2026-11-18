// Rolling Letters Menu by Made for Award: https://www.madeforaward.com/ui/interactions/rolling-letters-menu
// Free and open source (MIT). If it helped, a star means a lot: https://github.com/shivc868/madeforaward-ui
'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'
import gsap from 'gsap'
import {useGSAP} from '@gsap/react'

gsap.registerPlugin(useGSAP)

/** Lets a host (e.g. your navbar) render the trigger itself and drive the menu. */
export type RollingMenuApi = {
  open: boolean
  toggle: () => void
  close: () => void
  /** attach to your own trigger button so the reveal grows from it */
  registerTrigger: (el: HTMLButtonElement | null) => void
}

const RollingMenuContext = createContext<RollingMenuApi | null>(null)

export function useRollingMenu(): RollingMenuApi {
  const api = useContext(RollingMenuContext)
  if (!api) {
    throw new Error('useRollingMenu must be used inside <RollingLettersMenu>')
  }
  return api
}

export type RollingMenuItem = {
  label: string
  href: string
  /** the panel turns this colour while the item is active */
  color?: string
  /** the text colour on that panel */
  ink?: string
  /** a short line shown beside the list */
  note?: string
}

export type RollingLettersMenuProps = {
  items?: RollingMenuItem[]
  /** your page, behind the menu */
  children?: ReactNode
  /** your logo or name, in the corner */
  brand?: ReactNode
  /** start open */
  defaultOpen?: boolean
  /** the panel when nothing's active */
  background?: string
  /** the text when nothing's active */
  ink?: string
  /** how far the other items fade while one is active, 0–1 */
  dim?: number
  /** seconds one letter takes to roll */
  duration?: number
  /** seconds between one letter and the next */
  stagger?: number
  /** which letter starts the roll */
  order?: 'start' | 'center' | 'end' | 'random'
  /** seconds the panel takes to open */
  openSpeed?: number
  /** cover the whole window and lock its scroll while open */
  fixed?: boolean
  /** a link was chosen; the menu closes after this */
  onNavigate?: (item: RollingMenuItem, event: MouseEvent<HTMLAnchorElement>) => void
  className?: string
  /** text direction of the panel — pass 'rtl' for Arabic */
  dir?: 'ltr' | 'rtl'
  /** background of the built-in toggle button */
  triggerColor?: string
  /** text colour of the built-in toggle button */
  triggerInk?: string
  /** words shown on the built-in toggle button when closed / open */
  triggerLabels?: {open: string; close: string}
  /**
   * Rendered outside the inert page wrapper, above the panel. Use it for chrome
   * that must stay interactive while the menu is open — e.g. a navbar whose own
   * button drives the menu via `useRollingMenu()`.
   */
  header?: ReactNode
}

// Muted tones at much the same depth (moss, clay, indigo, ochre, plum) under one
// cream ink, so moving between links shifts the panel's hue without flashing.
const DEFAULT_ITEMS: RollingMenuItem[] = [
  {label: 'Work', href: '#work', color: '#2e4a3c', ink: '#f2ede3', note: 'Twenty-four projects, nine industries'},
  {label: 'Studio', href: '#studio', color: '#7a3b33', ink: '#f2ede3', note: 'Six people around one long table'},
  {label: 'Journal', href: '#journal', color: '#2b3463', ink: '#f2ede3', note: 'Notes from the workbench'},
  {label: 'Shop', href: '#shop', color: '#6e5524', ink: '#f2ede3', note: 'Prints and small editions'},
  {label: 'Contact', href: '#contact', color: '#4f2d44', ink: '#f2ede3', note: 'We read everything we get'},
]

// Arabic (and other cursive scripts) join their letters, so splitting a word into
// separate cubes breaks the shaping. Those words roll as one cube instead.
const CURSIVE_SCRIPT = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

// One word as a row of little cubes: each letter sits on a cube's front face with
// the same letter on the face below, and rolling a quarter turn swaps them.
function RollWord({text, wheels}: {text: string; wheels: (el: HTMLSpanElement | null) => void}) {
  if (CURSIVE_SCRIPT.test(text)) {
    return (
      <span aria-hidden className="inline-block select-none whitespace-nowrap">
        <span className="inline-block h-[1em] leading-none perspective-[2.6em]">
          <span className="block h-full transform-3d [transform:translateZ(-0.5em)]">
            <span ref={wheels} className="block h-full transform-3d will-change-transform">
              <span className="block h-full backface-hidden [transform:translateZ(0.5em)]">{text}</span>
              <span className="absolute inset-0 backface-hidden [transform:rotateX(-90deg)_translateZ(0.5em)]">{text}</span>
            </span>
          </span>
        </span>
      </span>
    )
  }

  return (
    // dir="ltr" keeps Latin words reading left-to-right even when the panel is
    // RTL (e.g. the "English" link inside the Arabic menu).
    <span aria-hidden dir="ltr" className="inline-block select-none whitespace-pre">
      {Array.from(text).map((char, i) => (
        <span key={i} className="inline-block h-[1em] leading-none perspective-[2.6em]">
          <span className="block h-full transform-3d [transform:translateZ(-0.5em)]">
            <span ref={wheels} className="block h-full transform-3d will-change-transform">
              <span className="block h-full backface-hidden [transform:translateZ(0.5em)]">{char}</span>
              <span className="absolute inset-0 backface-hidden [transform:rotateX(-90deg)_translateZ(0.5em)]">{char}</span>
            </span>
          </span>
        </span>
      ))}
    </span>
  )
}

// A complete fullscreen menu. The panel opens as a circle from the button and
// every letter rolls like a cube, on the way in and under the pointer. Each link
// recolours the whole panel. Real links with keyboard support: focus rolls them
// too, Esc closes, the page behind is inert while open, and focus goes back to
// the button. Reduced motion fades and swaps colours without the rolling.
export default function RollingLettersMenu({
  items = DEFAULT_ITEMS,
  children,
  brand,
  defaultOpen = false,
  background = '#141414',
  ink = '#f2ede3',
  dim = 0.75,
  duration = 0.55,
  stagger = 0.022,
  order = 'start',
  openSpeed = 0.95,
  fixed = false,
  onNavigate,
  className = '',
  dir = 'ltr',
  triggerColor = '#141414',
  triggerInk = '#ffffff',
  triggerLabels = {open: 'Menu', close: 'Close'},
  header,
}: RollingLettersMenuProps) {
  const [open, setOpen] = useState(defaultOpen)
  const panelRef = useRef<HTMLDivElement>(null)
  const internalButtonRef = useRef<HTMLButtonElement>(null)
  const externalButtonRef = useRef<HTMLButtonElement>(null)
  // A host can take over the trigger (so it can live inside its navbar). The
  // built-in button then disappears, but the reveal still grows from the host's
  // button — hence two refs and one lookup. Seeding from `header` avoids a
  // one-frame flash of the floating button before the host registers.
  const [hasExternalTrigger, setHasExternalTrigger] = useState(Boolean(header))
  const triggerRef = () => externalButtonRef.current ?? internalButtonRef.current
  const registerTrigger = useCallback((el: HTMLButtonElement | null) => {
    externalButtonRef.current = el
    setHasExternalTrigger(el !== null)
  }, [])
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const itemWheels = useRef<HTMLSpanElement[][]>([])
  const buttonWheels = useRef<HTMLSpanElement[]>([])
  const lineRefs = useRef<(HTMLLIElement | null)[]>([])
  const noteRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const opened = useRef(false)
  const look = useRef({background, ink, dim, duration, stagger, order})

  useEffect(() => {
    look.current = {background, ink, dim, duration, stagger, order}
    if (panelRef.current) gsap.set(panelRef.current, {backgroundColor: background, '--ink': ink})
  }, [background, ink, dim, duration, stagger, order])

  const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const setActive = (index: number | null) => {
    const panel = panelRef.current
    if (!panel) return
    const item = index === null ? null : items[index]
    const {background: base, ink: text, dim: fade} = look.current
    gsap.to(panel, {backgroundColor: item?.color ?? base, '--ink': item?.ink ?? text, duration: 0.6, ease: 'power2.inOut', overwrite: 'auto'})
    lineRefs.current.forEach((line, i) => {
      gsap.to(line, {opacity: index === null || i === index ? 1 : 1 - fade, duration: 0.3, overwrite: 'auto'})
    })
    // The old note leaves quickly and the new one waits for it, so two never overlap.
    noteRefs.current.forEach((note, i) => {
      const shown = i === index
      gsap.to(note, {autoAlpha: shown ? 1 : 0, y: shown ? 0 : 8, duration: shown ? 0.35 : 0.15, delay: shown ? 0.15 : 0, ease: 'power2.out', overwrite: 'auto'})
    })
  }

  const roll = (wheels: HTMLSpanElement[], to: number) => {
    if (still()) return
    const {duration: time, stagger: gap, order: from} = look.current
    gsap.to(wheels, {rotationX: to, duration: time, ease: 'power3.inOut', stagger: {each: gap, from}, overwrite: 'auto'})
  }
  const enter = (index: number) => {
    setActive(index)
    roll(itemWheels.current[index], 90)
  }
  const leave = (index: number) => {
    setActive(null)
    roll(itemWheels.current[index], 0)
  }

  useGSAP(
    () => {
      const panel = panelRef.current
      const button = triggerRef()
      if (!panel || !button) return
      const reduced = still()
      const all = itemWheels.current.slice(0, items.length)

      gsap.set(panel, {backgroundColor: look.current.background, '--ink': look.current.ink})
      gsap.set(noteRefs.current, {autoAlpha: 0})
      if (reduced) gsap.set(buttonWheels.current, {rotationX: open ? 90 : 0})
      else roll(buttonWheels.current, open ? 90 : 0)

      if (!open && !opened.current) {
        gsap.set(panel, {autoAlpha: 0})
        return
      }
      if (reduced) {
        gsap.to(panel, {autoAlpha: open ? 1 : 0, duration: 0.2})
        opened.current = open
        return
      }

      // The circle grows from the middle of the button to the farthest corner.
      const panelBox = panel.getBoundingClientRect()
      const buttonBox = button.getBoundingClientRect()
      const x = buttonBox.left + buttonBox.width / 2 - panelBox.left
      const y = buttonBox.top + buttonBox.height / 2 - panelBox.top
      const reach = Math.hypot(Math.max(x, panelBox.width - x), Math.max(y, panelBox.height - y)) + 2
      const circle = (r: number) => `circle(${r}px at ${x}px ${y}px)`

      if (open) {
        gsap.set(panel, {autoAlpha: 1})
        gsap.set(lineRefs.current, {opacity: 1})
        gsap.fromTo(panel, {clipPath: circle(0)}, {clipPath: circle(reach), duration: openSpeed, ease: 'expo.inOut'})
        all.forEach((wheels, i) => {
          gsap.fromTo(
            wheels,
            {rotationX: -90},
            {rotationX: 0, duration: 0.8, ease: 'power3.out', stagger: {each: 0.016, from: 'start'}, delay: openSpeed * 0.42 + i * 0.05},
          )
        })
      } else {
        setActive(null)
        gsap.to(panel, {clipPath: circle(0), duration: openSpeed * 0.7, ease: 'expo.inOut', onComplete: () => void gsap.set(panel, {autoAlpha: 0})})
      }
      opened.current = open
    },
    {scope: panelRef, dependencies: [open]},
  )

  // Esc closes, the first link takes focus on opening, and it goes back on closing.
  const wasOpen = useRef(defaultOpen)
  useEffect(() => {
    if (open && !wasOpen.current) firstLinkRef.current?.focus({preventScroll: true})
    if (!open && wasOpen.current) triggerRef()?.focus({preventScroll: true})
    wasOpen.current = open
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (!fixed || !open) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [fixed, open])

  // Expose the menu state so a host (e.g. the navbar) can render the trigger
  // itself and keep it interactive while the panel is open.
  const api = useMemo<RollingMenuApi>(
    () => ({
      open,
      toggle: () => setOpen((o) => !o),
      close: () => setOpen(false),
      registerTrigger,
    }),
    [open, registerTrigger],
  )

  const menu = (
    <div className={fixed ? className : `relative h-full w-full overflow-hidden ${className}`}>
      <div inert={open} className={fixed ? 'relative flex min-h-screen w-full flex-col' : 'h-full w-full'}>
        {children}
      </div>
      <div
        ref={panelRef}
        inert={!open}
        dir={dir}
        className={`${fixed ? 'fixed z-100' : 'absolute z-50'} invisible inset-0 flex flex-col justify-between overflow-hidden [container-type:size]`}
        style={{color: 'var(--ink)'}}
      >
        <div className="h-[clamp(64px,12cqh,96px)] shrink-0 px-[clamp(18px,3.5cqw,44px)] pt-[clamp(18px,3.5cqw,32px)] text-[clamp(15px,1.8cqw,20px)]">{brand}</div>
        <nav aria-label="Main" className="flex min-h-0 flex-1 items-center justify-between gap-8 px-[clamp(18px,3.5cqw,44px)]">
          <ul className="m-0 list-none p-0">
            {items.map((item, i) => (
              <li
                key={item.href}
                ref={(el) => {
                  lineRefs.current[i] = el
                }}
                className="flex items-start gap-[0.4em] text-[clamp(44px,min(14cqw,15.5cqh),190px)] leading-[1.06] @[640px]:text-[clamp(44px,min(12cqw,15.5cqh),190px)]"
              >
                <span aria-hidden className="pt-[0.5em] text-[clamp(11px,1.2cqw,14px)] leading-none tabular-nums opacity-80">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <a
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  aria-label={item.label}
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') enter(i)
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === 'mouse') leave(i)
                  }}
                  onFocus={() => enter(i)}
                  onBlur={() => leave(i)}
                  onClick={(e) => {
                    onNavigate?.(item, e)
                    setOpen(false)
                  }}
                  className="block uppercase no-underline outline-offset-4 focus-visible:outline-2 focus-visible:outline-current"
                  style={{color: 'inherit'}}
                >
                  <RollWord
                    text={item.label}
                    wheels={(el) => {
                      itemWheels.current[i] ??= []
                      if (el && !itemWheels.current[i].includes(el)) itemWheels.current[i].push(el)
                    }}
                  />
                </a>
              </li>
            ))}
          </ul>
          <div className="relative hidden h-full max-w-[340px] min-w-0 flex-1 text-[clamp(17px,2.1cqw,28px)] leading-tight @[640px]:block">
            {items.map((item, i) => (
              <p
                key={item.href}
                ref={(el) => {
                  noteRefs.current[i] = el
                }}
                className="invisible absolute right-0 bottom-[8cqh] left-0 m-0"
              >
                {item.note}
              </p>
            ))}
          </div>
        </nav>
        <div className="h-[clamp(20px,5cqh,48px)] shrink-0" />
      </div>
      {!hasExternalTrigger && (
        <button
          ref={internalButtonRef}
          type="button"
          aria-expanded={open}
          aria-label={open ? triggerLabels.close : triggerLabels.open}
          onClick={() => setOpen((o) => !o)}
          style={{backgroundColor: triggerColor, color: triggerInk}}
          className={`${fixed ? 'fixed z-101' : 'absolute z-51'} top-[22px] right-3 h-12 min-w-12 cursor-pointer select-none rounded-2xl border border-white/20 px-5 text-[13px] font-medium backdrop-blur-md transition-[filter] hover:brightness-110 outline-offset-2 focus-visible:outline-2 focus-visible:outline-white sm:top-[32px] sm:right-4 xl:right-6 ${dir === 'rtl' ? '' : 'tracking-[0.08em] uppercase'}`}
        >
          <span className="relative inline-block h-[1em] leading-none perspective-[3em]">
            <span className="block h-full transform-3d [transform:translateZ(-0.5em)]">
              <span
                ref={(el) => {
                  if (el && !buttonWheels.current.includes(el)) buttonWheels.current.push(el)
                }}
                className="block h-full transform-3d"
              >
                <span className="block h-full backface-hidden [transform:translateZ(0.5em)]">{triggerLabels.open}</span>
                <span className="absolute inset-0 backface-hidden [transform:rotateX(-90deg)_translateZ(0.5em)]">{triggerLabels.close}</span>
              </span>
            </span>
          </span>
        </button>
      )}
    </div>
  )

  return (
    <RollingMenuContext.Provider value={api}>
      {header}
      {menu}
    </RollingMenuContext.Provider>
  )
}
