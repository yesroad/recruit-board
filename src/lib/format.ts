const dateFormatter = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export const formatDate = (value: string): string => dateFormatter.format(new Date(value))

const longDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export const formatDateLong = (value: string): string => longDateFormatter.format(new Date(value))
