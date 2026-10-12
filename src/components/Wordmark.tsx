import './Wordmark.css'

const HEAD = `${import.meta.env.BASE_URL}media/head.png`

/** The logo, rebuilt so it reads on light and dark: The · Queen's head · Vic. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`}>
      <span className="wordmark__word" aria-hidden="true">
        The
      </span>
      <img className="wordmark__head" src={HEAD} alt="" width={92} height={119} />
      <span className="wordmark__word" aria-hidden="true">
        Vic
      </span>
      <span className="sr-only">The Victoria</span>
    </span>
  )
}
